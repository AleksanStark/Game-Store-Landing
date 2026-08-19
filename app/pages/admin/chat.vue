<template>
  <section class="admin-chat">
    <div class="admin-chat-head">
      <div>
        <h2>Чаты</h2>
        <p>
          {{ conversations.length }} диалогов · {{ totalUnread }} непрочитанных
        </p>
      </div>
    </div>

    <div class="chat-shell">
      <!-- список диалогов -->
      <div class="chat-list">
        <div
          v-for="c in conversations"
          :key="c.guest_id"
          class="chat-list-item"
          :class="{ active: activeGuestId === c.guest_id }"
          @click="openConversation(c.guest_id)"
        >
          <span
            class="chat-dot"
            :class="{ online: onlineGuestId === c.guest_id }"
          />
          <div class="chat-list-meta">
            <div class="row">
              <span class="guest mono">Гость {{ c.guest_id.slice(0, 8) }}</span>
              <span v-if="c.unread_count > 0" class="unread-badge">{{
                c.unread_count
              }}</span>
            </div>
            <div class="preview">{{ c.last_message || "Нет сообщений" }}</div>
          </div>
        </div>
        <div v-if="conversations.length === 0" class="chat-empty-list">
          Пока нет обращений
        </div>
      </div>

      <!-- активный диалог -->
      <div class="chat-thread">
        <template v-if="activeGuestId">
          <div class="chat-thread-head">
            <span class="mono">Гость {{ activeGuestId.slice(0, 8) }}</span>
            <span
              class="chip"
              :class="
                onlineGuestId === activeGuestId ? 'chip-online' : 'chip-offline'
              "
            >
              {{ onlineGuestId === activeGuestId ? "Онлайн" : "Офлайн" }}
            </span>
          </div>

          <div ref="scrollArea" class="chat-messages">
            <div
              v-for="m in activeMessages"
              :key="m.id"
              class="chat-bubble-row"
              :class="m.sender === 'admin' ? 'from-admin' : 'from-guest'"
            >
              <div class="chat-bubble">{{ m.body }}</div>
              <div class="chat-time mono">{{ formatTime(m.created_at) }}</div>
            </div>
          </div>

          <form class="chat-input-row" @submit.prevent="send">
            <input v-model="draft" type="text" placeholder="Ответить..." />
            <button
              type="submit"
              class="abtn abtn-primary abtn-sm"
              :disabled="!draft.trim()"
            >
              Отправить
            </button>
          </form>
        </template>
        <div v-else class="chat-thread-empty">Выберите диалог слева</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "admin" });

interface Conversation {
  guest_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}
interface ChatMessage {
  id: number;
  guest_id: string;
  sender: "guest" | "admin";
  body: string;
  created_at: string;
}

const config = useRuntimeConfig();
const { accessToken, apiFetch } = useAdminApi();

// wss:// на проде, ws:// локально — выводится из того же apiBase, что и весь остальной проект
const WS_BASE = config.public.apiBase.replace(/^http/, "ws");

const conversations = ref<Conversation[]>([]);
const activeGuestId = ref<string | null>(null);
const activeMessages = ref<ChatMessage[]>([]);
const onlineGuestId = ref<string | null>(null);
const draft = ref("");
const scrollArea = ref<HTMLDivElement | null>(null);

const totalUnread = computed(() =>
  conversations.value.reduce((sum, c) => sum + c.unread_count, 0),
);

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollArea.value)
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  });
};

const sortConversations = () => {
  conversations.value.sort(
    (a, b) =>
      new Date(b.last_message_at ?? 0).getTime() -
      new Date(a.last_message_at ?? 0).getTime(),
  );
};

let ws: WebSocket | null = null;

const connectAdminSocket = () => {
  ws = new WebSocket(`${WS_BASE}/chat/ws/admin?token=${accessToken.value}`);

  ws.onmessage = (event) => {
    const payload: ChatMessage = JSON.parse(event.data);
    onlineGuestId.value = payload.guest_id;

    if (payload.guest_id === activeGuestId.value) {
      activeMessages.value.push(payload);
      scrollToBottom();
      if (payload.sender === "guest") markAsRead(payload.guest_id);
    } else if (payload.sender === "guest") {
      const convo = conversations.value.find(
        (c) => c.guest_id === payload.guest_id,
      );
      if (convo) {
        convo.unread_count++;
        convo.last_message = payload.body;
        convo.last_message_at = payload.created_at;
      } else {
        loadConversations();
      }
    }

    sortConversations();
  };

  ws.onclose = () => {
    setTimeout(connectAdminSocket, 2000);
  };
};

const loadConversations = async () => {
  conversations.value = await apiFetch<Conversation[]>("/chat/conversations");
  sortConversations();
};

const markAsRead = async (guestId: string) => {
  await apiFetch(`/chat/mark-read/${guestId}`, { method: "POST" });
};

const openConversation = async (guestId: string) => {
  activeGuestId.value = guestId;
  activeMessages.value = await apiFetch<ChatMessage[]>(
    `/chat/history/${guestId}`,
  );

  const convo = conversations.value.find((c) => c.guest_id === guestId);
  if (convo && convo.unread_count > 0) {
    convo.unread_count = 0;
    await markAsRead(guestId);
  }

  scrollToBottom();
};

const send = () => {
  const body = draft.value.trim();
  if (!body || !activeGuestId.value || !ws) return;
  ws.send(JSON.stringify({ guest_id: activeGuestId.value, body }));
  draft.value = "";
};

onMounted(async () => {
  await loadConversations();
  connectAdminSocket();
});
onBeforeUnmount(() => ws?.close());
</script>

<style scoped>
.admin-chat {
  padding: 32px 36px 64px;
  max-width: 1320px;
  margin: 0 auto;
}
.admin-chat-head {
  margin-bottom: 24px;
}
.admin-chat-head h2 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 22px;
  margin-bottom: 4px;
}
.admin-chat-head p {
  color: var(--text-muted, #989c9f);
  font-size: 13.5px;
}

.abtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 2px;
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.12s ease,
    opacity 0.12s ease;
}
.abtn-primary {
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
}
.abtn-primary:hover:not(:disabled) {
  background: #dba85b;
}
.abtn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.abtn-sm {
  padding: 6px 11px;
  font-size: 12px;
}

.chat-shell {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1px;
  background: var(--line, rgba(255, 255, 255, 0.09));
  border: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  border-radius: 4px;
  overflow: hidden;
  height: 600px;
}

.chat-list {
  background: var(--bg-elev, #17191c);
  overflow-y: auto;
}
.chat-list-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  cursor: pointer;
}
.chat-list-item:hover {
  background: var(--bg-elev-2, #1d2023);
}
.chat-list-item.active {
  background: var(--accent-soft, rgba(201, 151, 76, 0.14));
}
.chat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-dim, #6b6f73);
  margin-top: 5px;
  flex-shrink: 0;
}
.chat-dot.online {
  background: #7fa66b;
}
.chat-list-meta {
  flex: 1;
  min-width: 0;
}
.chat-list-meta .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.chat-list-meta .guest {
  font-size: 12px;
  color: var(--text-muted, #989c9f);
}
.unread-badge {
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
  font-family: "IBM Plex Mono", monospace;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  flex-shrink: 0;
}
.chat-list-meta .preview {
  font-size: 12.5px;
  color: var(--text-dim, #6b6f73);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}
.chat-empty-list {
  padding: 40px 16px;
  text-align: center;
  color: var(--text-dim, #6b6f73);
  font-size: 13px;
}

.chat-thread {
  background: var(--bg-elev, #17191c);
  display: flex;
  flex-direction: column;
}
.chat-thread-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line, rgba(255, 255, 255, 0.09));
}
.chip {
  font-family: "IBM Plex Mono", monospace;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 10px;
}
.chip-online {
  color: #7fa66b;
  background: rgba(127, 166, 107, 0.14);
}
.chip-offline {
  color: var(--text-dim, #6b6f73);
  background: rgba(255, 255, 255, 0.06);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-bubble-row {
  display: flex;
  flex-direction: column;
  max-width: 62%;
}
.chat-bubble-row.from-admin {
  align-self: flex-end;
  align-items: flex-end;
}
.chat-bubble-row.from-guest {
  align-self: flex-start;
  align-items: flex-start;
}
.chat-bubble {
  padding: 9px 13px;
  border-radius: 12px;
  font-size: 13.5px;
  line-height: 1.45;
  word-break: break-word;
}
.from-admin .chat-bubble {
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
  border-bottom-right-radius: 3px;
}
.from-guest .chat-bubble {
  background: var(--bg-elev-2, #1d2023);
  border: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  border-bottom-left-radius: 3px;
}
.chat-time {
  font-size: 10px;
  color: var(--text-dim, #6b6f73);
  margin-top: 4px;
}

.chat-input-row {
  display: flex;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid var(--line, rgba(255, 255, 255, 0.09));
}
.chat-input-row input {
  flex: 1;
  background: var(--bg, #0f1113);
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  color: var(--text, #f2f1ec);
  border-radius: 2px;
  padding: 9px 12px;
  font-size: 13.5px;
}
.chat-input-row input:focus {
  outline: none;
  border-color: var(--accent, #c9974c);
}

.chat-thread-empty {
  margin: auto;
  color: var(--text-dim, #6b6f73);
  font-size: 13.5px;
}

@media (max-width: 720px) {
  .admin-chat {
    padding: 20px 16px 48px;
  }
  .chat-shell {
    grid-template-columns: 1fr;
    height: auto;
  }
  .chat-list {
    max-height: 240px;
  }
  .chat-thread {
    height: 480px;
  }
}
</style>
