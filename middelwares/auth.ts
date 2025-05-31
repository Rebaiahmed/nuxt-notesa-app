// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const router = useRouter(); // Access Nuxt's router
  if (!authStore.user && to.path !== '/login' && to.path !== '/signup') {
    return navigateTo('/login'); // Nuxt's helper for programmatic navigation
  }

  if (authStore.user && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/notes');
  }
});