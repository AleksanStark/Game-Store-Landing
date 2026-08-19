<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <span class="dot" />
        GAME STORE
        <span class="suffix">admin</span>
      </div>

      <div class="admin-nav-group">Каталог</div>
      <NuxtLink
        to="/admin"
        class="admin-nav-link"
        :class="{ active: route.path === '/admin' }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Обзор
      </NuxtLink>
      <NuxtLink
        to="/admin/products"
        class="admin-nav-link"
        :class="{ active: route.path.startsWith('/admin/products') }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <rect x="3" y="7" width="18" height="13" rx="1" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Товары
        <span class="count">128</span>
      </NuxtLink>
      <NuxtLink
        to="/admin/categories"
        class="admin-nav-link"
        :class="{ active: route.path.startsWith('/admin/categories') }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M4 6h16M4 12h10M4 18h6" />
        </svg>
        Категории
      </NuxtLink>
      <NuxtLink
        to="/admin/orders"
        class="admin-nav-link"
        :class="{ active: route.path.startsWith('/admin/orders') }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13 5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17"
          />
          <circle cx="8" cy="21" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="17" cy="21" r="1.4" fill="currentColor" stroke="none" />
        </svg>
        Заявки
        <span class="count">6</span>
      </NuxtLink>

      <div class="admin-nav-group">Система</div>
      <NuxtLink
        to="/admin/settings"
        class="admin-nav-link"
        :class="{ active: route.path.startsWith('/admin/settings') }"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
        Настройки
      </NuxtLink>

      <div class="admin-sidebar-footer">
        <div class="admin-user-chip">
          <div class="admin-user-avatar">A</div>
          <div class="admin-user-meta">
            <div class="name">Alex</div>
            <div class="role">Admin</div>
          </div>
        </div>
      </div>
    </aside>

    <div>
      <header class="admin-topbar">
        <div class="admin-breadcrumb">
          <span>Админка</span>
          <span v-if="pageTitle">/</span>
          <span v-if="pageTitle" class="current">{{ pageTitle }}</span>
        </div>
        <div class="admin-topbar-actions">
          <div class="admin-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Поиск товаров..." />
            <span class="kbd">⌘K</span>
          </div>
          <button
            class="abtn abtn-ghost abtn-icon"
            title="Выйти"
            @click="logout"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </header>

      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import "~/assets/css/admin.css";
const route = useRoute();

// Optional: pages can set this via useState('admin-page-title') if you
// want the breadcrumb to reflect a dynamic title (e.g. product name on edit page).
const pageTitle = useState<string>("admin-page-title", () => "");

const logout = async () => {
  await $fetch("/auth/logout", { method: "POST", credentials: "include" });
  await navigateTo("/admin/login");
};
</script>
