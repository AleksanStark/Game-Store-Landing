export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const token = config.telegramBotToken;
  const chat_id = config.telegramChatId;

  const { message } = await readBody(event);

  try {
    const telegtamUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await $fetch(telegtamUrl, {
      method: "POST",
      body: {
        chat_id: chat_id,
        text: message,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    throw createError({
      status: 500,
      statusMessage: `Failed to send message via Telegram Bot ${error}`,
    });
  }
});
