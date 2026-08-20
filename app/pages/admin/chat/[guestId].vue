<template>
  <section class="chat-focus">
    <div class="chat-focus-head">
      <button
        class="back-btn"
        @click="goToInbox"
        aria-label="К списку диалогов"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div class="chat-focus-title">
        <span class="mono">Гость {{ shortId }}</span>
        <span class="chip" :class="isOnline ? 'chip-online' : 'chip-offline'">
          {{ isOnline ? "Онлайн" : "Офлайн" }}
        </span>
      </div>

      <button
        class="copy-btn"
        @click="copyLink"
        :class="{ copied }"
        aria-label="Скопировать ссылку на диалог"
      >
        <svg
          v-if="!copied"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </button>
    </div>

    <div v-if="loading" class="chat-focus-loading">Загружаем диалог...</div>

    <template v-else>
      <div ref="scrollArea" class="chat-focus-messages">
        <div v-if="messages.length === 0" class="chat-focus-empty">
          <div class="eyebrow">Пока нет сообщений</div>
          <p>Гость ещё не написал — сообщение появится здесь автоматически.</p>
        </div>

        <div
          v-for="m in messages"
          :key="m.id"
          class="chat-bubble-row"
          :class="m.sender === 'admin' ? 'from-admin' : 'from-guest'"
        >
          <div class="chat-bubble">{{ m.body }}</div>
          <div class="chat-time mono">{{ formatTime(m.created_at) }}</div>
        </div>
      </div>

      <form class="chat-focus-input" @submit.prevent="send">
        <input
          v-model="draft"
          type="text"
          placeholder="Ответить гостю..."
          autofocus
        />
        <button
          type="submit"
          class="abtn abtn-primary"
          :disabled="!draft.trim()"
        >
          Отправить
        </button>
      </form>
    </template>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "admin" });

interface ChatMessage {
  id: number;
  guest_id: string;
  sender: "guest" | "admin";
  body: string;
  created_at: string;
}

const route = useRoute();
const guestId = route.params.guestId as string;
const shortId = guestId.slice(0, 8);

const config = useRuntimeConfig();
const { accessToken, apiFetch } = useAdminApi();
const WS_BASE = config.public.apiBase.replace(/^http/, "ws");

const loading = ref(true);
const messages = ref<ChatMessage[]>([]);
const draft = ref("");
const isOnline = ref(false);
const copied = ref(false);
const scrollArea = ref<HTMLDivElement | null>(null);

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

const goToInbox = () => navigateTo("/admin/chat");

const copyLink = async () => {
  const url = `${window.location.origin}/admin/chat/${guestId}`;
  await navigator.clipboard.writeText(url);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
};

let ws: WebSocket | null = null;

const connectSocket = () => {
  ws = new WebSocket(`${WS_BASE}/chat/ws/admin?token=${accessToken.value}`);

  ws.onmessage = (event) => {
    const payload: ChatMessage = JSON.parse(event.data);
    if (payload.guest_id !== guestId) return; // сообщения по другим диалогам эту страницу не касаются

    isOnline.value = true;
    messages.value.push(payload);
    scrollToBottom();

    if (payload.sender === "guest") {
      apiFetch(`/chat/mark-read/${guestId}`, { method: "POST" }).catch(
        () => {},
      );
    }
  };

  ws.onclose = () => {
    setTimeout(connectSocket, 2000);
  };
};

const send = () => {
  const body = draft.value.trim();
  if (!body || !ws) return;
  ws.send(JSON.stringify({ guest_id: guestId, body }));
  draft.value = "";
};

onMounted(async () => {
  try {
    messages.value = await apiFetch<ChatMessage[]>(`/chat/history/${guestId}`);
    await apiFetch(`/chat/mark-read/${guestId}`, { method: "POST" });
    scrollToBottom();
  } finally {
    loading.value = false;
  }
  connectSocket();
});
onBeforeUnmount(() => ws?.close());
</script>

<style scoped>
.chat-focus {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px 32px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-focus-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  margin-bottom: 4px;
}
.back-btn,
.copy-btn {
  background: none;
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  color: var(--text-muted, #989c9f);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;
}
.back-btn:hover,
.copy-btn:hover {
  border-color: var(--accent, #c9974c);
  color: var(--accent, #c9974c);
}
.copy-btn.copied {
  border-color: #7fa66b;
  color: #7fa66b;
}
.back-btn svg,
.copy-btn svg {
  width: 16px;
  height: 16px;
}

.chat-focus-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}
.chat-focus-title .mono {
  font-family: "IBM Plex Mono", monospace;
  font-size: 14px;
  color: var(--text, #f2f1ec);
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

.chat-focus-loading {
  margin: auto;
  color: var(--text-dim, #6b6f73);
  font-size: 13.5px;
}

.chat-focus-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-focus-empty {
  margin: auto 0;
  text-align: center;
  padding: 0 20px;
}
.chat-focus-empty .eyebrow {
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent, #c9974c);
  margin-bottom: 8px;
}
.chat-focus-empty p {
  color: var(--text-muted, #989c9f);
  font-size: 13px;
}

.chat-bubble-row {
  display: flex;
  flex-direction: column;
  max-width: 72%;
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
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.5;
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
  font-size: 10.5px;
  color: var(--text-dim, #6b6f73);
  margin-top: 4px;
}

.chat-focus-input {
  display: flex;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--line, rgba(255, 255, 255, 0.09));
}
.chat-focus-input input {
  flex: 1;
  background: var(--bg-elev, #17191c);
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  color: var(--text, #f2f1ec);
  border-radius: 3px;
  padding: 12px 14px;
  font-size: 14px;
}
.chat-focus-input input:focus {
  outline: none;
  border-color: var(--accent, #c9974c);
}

.abtn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 3px;
  font-family: "Space Grotesk", sans-serif;
  font-weight: 600;
  font-size: 13.5px;
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

@media (max-width: 600px) {
  .chat-focus {
    padding: 16px 14px 20px;
  }
  .chat-bubble-row {
    max-width: 85%;
  }
}
</style>
