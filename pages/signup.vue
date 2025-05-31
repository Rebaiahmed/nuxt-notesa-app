<template>
  <div class="auth-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignup">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
    <p>Already have an account? <NuxtLink to="/login">Login</NuxtLink></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const error = ref(null);

const authStore = useAuthStore();
const router = useRouter();

// Redirect if already logged in (client-side initial check)
if (authStore.user) {
  router.push('/notes');
}

async function handleSignup() {
  error.value = null;
  try {
    await authStore.signup(email.value, password.value);
    router.push('/notes'); // Redirect on successful signup
  } catch (err) {
    error.value = err.message || 'Signup failed. Please try again.';
  }
}
</script>

<style scoped>
/* Reuse auth-container styles from login.vue or move to global CSS */
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}
.auth-container input {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.auth-container button {
  width: 100%;
  padding: 10px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>