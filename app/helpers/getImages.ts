const config = useRuntimeConfig();

// Формирует правильную ссылку на картинку
export const getImageUrl = (path: string) => {
  if (!path) return "";

  // Если это уже полная ссылка или локальное превью
  if (path.startsWith("http") || path.startsWith("blob:")) {
    return path;
  }

  // Используем mediaBase вместо apiBase
  const baseUrl = config.public.mediaBase.replace(/\/$/, "");
  const imgPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${imgPath}`;
};
