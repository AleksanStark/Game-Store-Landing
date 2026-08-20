import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  app: {
    head: {
      title: "Tim Game Store",
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/logo.svg",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/fonts"],
  fonts: {
    families: [
      {
        name: "Space Grotesk",
        provider: "google",
        weights: [400, 500, 600, 700],
      },

      {
        name: "Inter",
        provider: "google",
        weights: [400, 500, 600],
      },

      {
        name: "IBM Plex Mono",
        provider: "google",
        weights: [400, 500],
      },
    ],
  },

  runtimeConfig: {
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.NUXT_TELEGRAM_CHAT_ID,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
      mediaBase: process.env.NUXT_PUBLIC_MEDIA_BASE || "http://localhost:8080",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: true },
});
