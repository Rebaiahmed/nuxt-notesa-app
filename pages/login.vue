<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-lg p-4">
          <div class="card-body">
            <h1 class="card-title text-center mb-4 fw-bold text-primary">Login to Your Notes App</h1>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control form-control-lg"
                  id="email"
                  v-model="email"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control form-control-lg"
                  id="password"
                  v-model="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div class="d-grid gap-2 mb-3">
                <button type="submit" class="btn btn-primary btn-lg">Login</button>
              </div>

              <p class="text-center mt-3">
                Don't have an account?
                <NuxtLink to="/signup" class="text-decoration-none fw-bold">Sign Up Here</NuxtLink>
              </p>
            </form>

            <div v-if="error" class="alert alert-danger mt-3" role="alert">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');


async function handleLogin() {
    error.value = ''; // Reset error message
    try {
        await authStore.login(email.value, password.value);
        router.push('/notes'); // Redirect to notes page after successful login
    } catch (err) {
        console.log('err',err);
        error.value = 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
    }
}

</script>

<style scoped>
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