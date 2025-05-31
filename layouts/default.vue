<template>
  <div>
    <header style="background-color: #f0f0f0; padding: 10px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center;">
      <NuxtLink to="/" style="font-weight: bold; text-decoration: none; color: #333;">Notes App</NuxtLink>
      <nav>
        <template v-if="authStore.isAuthenticated">
          <template v-if="authStore.user">
            <span style="margin-right: 15px;">Welcome, {{ authStore.user.email }}</span>
            <NuxtLink to="/notes" style="margin-right: 15px;">My Notes</NuxtLink>
            <button @click="handleLogout" style="background-color: #f44336; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" style="margin-right: 15px;">Login</NuxtLink>
            <NuxtLink to="/signup">Sign Up</NuxtLink>
          </template>
        </template>
        <template v-else>
          <span>Loading User...</span>
        </template>
      </nav>
    </header>
    <main style="padding: 20px;">
      <slot /> </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router'; // Nuxt provides the router instance

const authStore = useAuthStore();
const router = useRouter();

async function handleLogout() {
  try {
    await authStore.logout();
    router.push('/login'); // Redirect to login page after logout
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
</script>