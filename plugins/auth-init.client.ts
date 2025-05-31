export default defineNuxtPlugin((nuxtApp) => {
const authStore = useAuthStore();

 if (!nuxtApp.$auth) {
    console.warn('Firebase auth service not injected. Ensure firebase.client.ts runs first.');
    return;
  }

if (!authStore.isAuthenticated) {
    authStore.initAuth();
  }


})