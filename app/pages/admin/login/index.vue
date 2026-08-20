<template>
  <div class="login-shell">
    <div class="login-box">
      <div class="login-brand"><span class="dot" />TIM GAME STORE</div>
      <div class="login-eyebrow">Вход в админ-панель</div>

      <div v-if="error" class="login-error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="afield">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="username"
            placeholder="admin@gamestore.kr"
          />
        </div>
        <div class="afield">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          class="abtn abtn-primary login-submit"
          :disabled="loading"
        >
          {{ loading ? "Входим..." : "Войти" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import "~/assets/css/admin.css";
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const { accessToken } = useAdminApi();

const handleLogin = async () => {
  const config = useRuntimeConfig();
  loading.value = true;
  error.value = "";
  try {
    const response = await $fetch<{
      access_token: string;
      token_type: "bearer";
    }>("/auth/login", {
      method: "POST",
      baseURL: config.public.apiBase,
      credentials: "include",
      body: { email: email.value, password: password.value },
    });
    accessToken.value = response.access_token;
    await navigateTo("/admin");
  } catch {
    error.value = "Неверный email или пароль";
  } finally {
    loading.value = false;
  }
};
</script>
