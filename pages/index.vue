<template>
  <div>
    <h1>Welcome to my Notes App!</h1>
    <p>This is a simple real-time notes application built with Nuxt 3, Firebase</p>
    <div v-if="!authStore.user">
      <p>Please <NuxtLink to="/login">login</NuxtLink> or <NuxtLink to="/signup">sign up</NuxtLink> to start taking notes.</p>
    </div>
    <div v-else>
      <p>You are logged in. Go to <NuxtLink to="/notes">My Notes</NuxtLink>.</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
</script>