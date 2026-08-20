<template>
  <NuxtLink
    v-if="showLauncher"
    to="/admin/chat"
    class="chat-launcher"
    aria-label="Перейти в чаты"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
    >
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      />
    </svg>
    <span v-if="unreadCount > 0" class="chat-launcher-badge">{{
      unreadCount > 99 ? "99+" : unreadCount
    }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Conversation {
  guest_id: string;
  unread_count: number;
}

const route = useRoute();
const { apiFetch } = useAdminApi();

const unreadCount = ref(0);
let pollTimer: ReturnType<typeof setInterval> | null = null;

// не показываем кнопку на самом экране чата (там она бессмысленна) и на логине
const showLauncher = computed(
  () =>
    route.path.startsWith("/admin") &&
    !route.path.startsWith("/admin/chat") &&
    route.path !== "/admin/login",
);

const loadUnreadCount = async () => {
  try {
    const conversations = await apiFetch<Conversation[]>("/chat/conversations");
    unreadCount.value = conversations.reduce(
      (sum, c) => sum + c.unread_count,
      0,
    );
  } catch {
    // не даём фейлу опроса ронять остальной интерфейс — просто оставляем прежнее значение
  }
};

onMounted(() => {
  loadUnreadCount();
  pollTimer = setInterval(loadUnreadCount, 15000); // раз в 15 секунд — лёгкий поллинг, не WS
});

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style scoped>
.chat-launcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 80;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--accent, #c9974c);
  color: var(--accent-ink, #171208);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}
.chat-launcher:hover {
  background: #dba85b;
  transform: translateY(-2px);
}
.chat-launcher svg {
  width: 22px;
  height: 22px;
}
.chat-launcher-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  background: #c9584c;
  color: #fff;
  font-family: "IBM Plex Mono", monospace;
  font-size: 10.5px;
  font-weight: 700;
  min-width: 19px;
  height: 19px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid var(--bg, #0f1113);
}

@media (max-width: 480px) {
  .chat-launcher {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
</style>
