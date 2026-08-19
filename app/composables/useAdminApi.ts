export const useAdminApi = () => {
  const config = useRuntimeConfig();
  const accessToken = useState<string | null>("accessToken", () => null);

  const refreshToken = async () => {
    try {
      const data = await $fetch<{ access_token: string; token_type: string }>(
        "/auth/refresh",
        {
          method: "POST",
          baseURL: config.public.apiBase,
          credentials: "include",
        },
      );
      console.log(data.access_token);
      accessToken.value = data.access_token;

      return true;
    } catch (error) {
      accessToken.value = null;

      return false;
    }
  };

  const apiFetch = async <T>(url: string, options: any = {}): Promise<T> => {
    if (!accessToken.value) {
      const refreshed = await refreshToken();

      if (!refreshed) {
        await navigateTo("/admin/login");
        throw new Error("Вы не авторизованы");
      }
    }

    return $fetch<T>(url, {
      ...options,
      baseURL: config.public.apiBase,
      headers: { ...options, Authorization: `Bearer ${accessToken.value}` },
      credentials: "include",
      ignoreResponseError: true,
    });
  };

  //     if (res.status === 401) {
  //       const refreshed = await $fetch<{ access_token: string }>(
  //         "/auth/refresh",
  //         {
  //           method: "POST",
  //           credentials: "include",
  //         },
  //       );
  //       accessToken.value = refreshed.access_token;

  //       return $fetch(url, {
  //         ...options,
  //         headers: { Authorization: `Bearer ${accessToken.value}` },
  //       });
  //     }
  //     return res._data;
  //   };

  return { apiFetch, accessToken, refreshToken };
};
