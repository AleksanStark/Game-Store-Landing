<template>
  <div class="chat-root">
    <!-- FAB -->
    <button
      class="chat-fab"
      :class="{ open: isOpen }"
      @click="toggle"
      aria-label="Открыть чат"
    >
      <svg
        v-if="!isOpen"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
      <span v-if="unreadCount > 0 && !isOpen" class="chat-fab-badge">{{
        unreadCount
      }}</span>
    </button>

    <!-- PANEL -->
    <Transition name="chat-pop">
      <div v-if="isOpen" class="chat-panel">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              <span class="dot" />
            </div>
            <div>
              <div class="chat-title">TIM GAME STORE · поддержка</div>
              <div class="chat-status">
                <span class="status-dot" :class="{ online: adminOnline }" />
                {{
                  adminOnline
                    ? "Сейчас на связи"
                    : "Обычно отвечаем в течение часа"
                }}
              </div>
            </div>
          </div>
          <button class="chat-close" @click="toggle" aria-label="Закрыть">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref="scrollArea" class="chat-messages">
          <div v-if="messages.length === 0" class="chat-empty">
            <div class="eyebrow">Начните разговор</div>
            <p>
              Спросите про наличие, цену или сроки доставки — ответим в этом
              чате.
            </p>
          </div>

          <div
            v-for="m in messages"
            :key="m.id"
            class="chat-bubble-row"
            :class="m.sender === 'guest' ? 'from-guest' : 'from-admin'"
          >
            <div class="chat-bubble">{{ m.body }}</div>
            <div class="chat-time mono">{{ formatTime(m.created_at) }}</div>
          </div>
        </div>

        <form class="chat-input-row" @submit.prevent="send">
          <input
            v-model="draft"
            type="text"
            placeholder="Напишите сообщение..."
            :disabled="!connected"
          />
          <button
            type="submit"
            class="chat-send"
            :disabled="!draft.trim() || !connected"
            aria-label="Отправить"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface ChatMessage {
  id: number;
  guest_id: string;
  sender: "guest" | "admin";
  body: string;
  created_at: string;
}

// заменить на реальный адрес бэкенда

const config = useRuntimeConfig();

const WS_BASE = config.public.apiBase.replace(/^https?/, "wss");

const isOpen = ref(false);
const connected = ref(false);
const adminOnline = ref(false); // опционально: обновлять по отдельному presence-событию
const messages = ref<ChatMessage[]>([]);
const draft = ref("");
const unreadCount = ref(0);
const scrollArea = ref<HTMLDivElement | null>(null);

let ws: WebSocket | null = null;
let guestId: string | null = null;

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollArea.value)
      scrollArea.value.scrollTop = scrollArea.value.scrollHeight;
  });
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const ensureGuestId = async () => {
  const stored = localStorage.getItem("chat_guest_id");
  if (stored) {
    guestId = stored;
    return;
  }
  const res = await $fetch<{ guest_id: string }>(`/chat/guest`, {
    method: "POST",
    baseURL: config.public.apiBase,
  });
  guestId = res.guest_id;
  localStorage.setItem("chat_guest_id", guestId);
};

const loadHistory = async () => {
  if (!guestId) return;
  const history = await $fetch<ChatMessage[]>(`/chat/history/${guestId}`, {
    baseURL: config.public.apiBase,
  });
  messages.value = history;
  scrollToBottom();
};

const connectSocket = () => {
  if (!guestId) return;
  ws = new WebSocket(`${WS_BASE}/chat/ws/guest/${guestId}`);

  ws.onopen = () => {
    connected.value = true;
  };
  ws.onclose = () => {
    connected.value = false;
    setTimeout(connectSocket, 2000); // простой автореконнект
  };
  ws.onmessage = (event) => {
    const payload: ChatMessage = JSON.parse(event.data);
    messages.value.push(payload);
    scrollToBottom();
    if (payload.sender === "admin" && !isOpen.value) unreadCount.value++;
  };
};

const toggle = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    if (!guestId) {
      await ensureGuestId();
      await loadHistory();
      connectSocket();
    }
    scrollToBottom();
  }
};

const send = async () => {
  const body = draft.value.trim();
  if (!body || !ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ body }));
  const adminUrl = `/admin/chat/${guestId}`;
  console.log(adminUrl);
  const message =
    `Новое сообщение с сайта\n \n` + `<a href="${adminUrl}">Открыть чат</a>`;
  await $fetch("/api/send-message", {
    method: "POST",
    body: {
      message: message,
    },
  });

  draft.value = "";
  console.log(message);
};

onBeforeUnmount(() => {
  ws?.close();
});
</script>

<style scoped>
.chat-root {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 90;
  font-family: "Inter", sans-serif;
}

/* ---------- FAB ---------- */
.chat-fab {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transition:
    transform 0.15s ease,
    background 0.15s ease;
  position: relative;
}
.chat-fab:hover {
  background: #dba85b;
  transform: translateY(-2px);
}
.chat-fab.open {
  background: var(--bg-elev, #17191c);
  color: var(--text, #f2f1ec);
}
.chat-fab svg {
  width: 24px;
  height: 24px;
}
.chat-fab-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  background: #c9584c;
  color: #fff;
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid var(--bg, #0f1113);
}

/* ---------- PANEL ---------- */
.chat-panel {
  position: absolute;
  bottom: 74px;
  right: 0;
  width: 360px;
  max-width: calc(100vw - 32px);
  height: 500px;
  max-height: calc(100vh - 140px);
  background: var(--bg-elev, #17191c);
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 14px;
  border-bottom: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  background: var(--bg-elev-2, #1d2023);
}
.chat-header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chat-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent-soft, rgba(201, 151, 76, 0.14));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chat-avatar .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent, #c9974c);
}
.chat-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text, #f2f1ec);
}
.chat-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  color: var(--text-dim, #6b6f73);
  margin-top: 2px;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-dim, #6b6f73);
}
.status-dot.online {
  background: #7fa66b;
}
.chat-close {
  background: none;
  border: none;
  color: var(--text-dim, #6b6f73);
  cursor: pointer;
  padding: 4px;
}
.chat-close:hover {
  color: var(--text, #f2f1ec);
}
.chat-close svg {
  width: 16px;
  height: 16px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-empty {
  margin: auto 0;
  text-align: center;
  padding: 0 12px;
}
.chat-empty .eyebrow {
  font-family: "IBM Plex Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent, #c9974c);
  margin-bottom: 8px;
}
.chat-empty p {
  color: var(--text-muted, #989c9f);
  font-size: 13px;
  line-height: 1.5;
}

.chat-bubble-row {
  display: flex;
  flex-direction: column;
  max-width: 78%;
}
.chat-bubble-row.from-guest {
  align-self: flex-end;
  align-items: flex-end;
}
.chat-bubble-row.from-admin {
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
.from-guest .chat-bubble {
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
  border-bottom-right-radius: 3px;
}
.from-admin .chat-bubble {
  background: var(--bg-elev-2, #1d2023);
  color: var(--text, #f2f1ec);
  border: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  border-bottom-left-radius: 3px;
}
.chat-time {
  font-size: 10px;
  color: var(--text-dim, #6b6f73);
  margin-top: 4px;
  padding: 0 3px;
}

.chat-input-row {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  background: var(--bg-elev-2, #1d2023);
}
.chat-input-row input {
  flex: 1;
  background: var(--bg, #0f1113);
  border: 1px solid var(--line-strong, rgba(255, 255, 255, 0.16));
  color: var(--text, #f2f1ec);
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 13.5px;
  outline: none;
}
.chat-input-row input:focus {
  border-color: var(--accent, #c9974c);
}
.chat-input-row input::placeholder {
  color: var(--text-dim, #6b6f73);
}
.chat-send {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}
.chat-send:hover:not(:disabled) {
  background: #dba85b;
}
.chat-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.chat-send svg {
  width: 15px;
  height: 15px;
}

/* transitions */
.chat-pop-enter-active,
.chat-pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.chat-pop-enter-from,
.chat-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 480px) {
  .chat-root {
    bottom: 16px;
    right: 16px;
  }
  .chat-panel {
    width: calc(100vw - 24px);
    height: calc(100vh - 120px);
    right: -8px;
  }
}
</style>
