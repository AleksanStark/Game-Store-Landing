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
        <NuxtLink
          v-for="c in conversations"
          :key="c.guest_id"
          :to="`/admin/chat/${c.guest_id}`"
          class="chat-list-item"
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
        </NuxtLink>
        <div v-if="conversations.length === 0" class="chat-empty-list">
          Пока нет обращений — ссылка на новый диалог придёт в Telegram
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Основной сценарий теперь — ссылка из Telegram сразу на /admin/chat/{guestId}.
// Эта страница — просто обзорный список на случай, если нужно найти диалог вручную.
definePageMeta({ middleware: "admin" });

interface Conversation {
  guest_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

const { apiFetch } = useAdminApi();
const conversations = ref<Conversation[]>([]);
const onlineGuestId = ref<string | null>(null);
const totalUnread = computed(() =>
  conversations.value.reduce((sum, c) => sum + c.unread_count, 0),
);

const loadConversations = async () => {
  const data = await apiFetch<Conversation[]>("/chat/conversations");
  conversations.value = data.sort(
    (a, b) =>
      new Date(b.last_message_at ?? 0).getTime() -
      new Date(a.last_message_at ?? 0).getTime(),
  );
};

onMounted(loadConversations);
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
  border: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  border-radius: 4px;
  overflow: hidden;
  max-width: 560px;
}

.chat-list {
  background: var(--bg-elev, #17191c);
}
.chat-list-item {
  display: flex;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line, rgba(255, 255, 255, 0.09));
  cursor: pointer;
  text-decoration: none;
  color: inherit;
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

@media (max-width: 720px) {
  .admin-chat {
    padding: 20px 16px 48px;
  }
}
</style>
