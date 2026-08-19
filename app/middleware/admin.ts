export default defineNuxtRouteMiddleware(async () => {
  const { accessToken, refreshToken } = useAdminApi();

  if (accessToken.value) {
    return;
  }

  const refreshed = await refreshToken();

  if (!refreshed) {
    await navigateTo("admin/login");
  }
});
