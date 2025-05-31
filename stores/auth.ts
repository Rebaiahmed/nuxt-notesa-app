
import { defineStore } from 'pinia';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User // Import the User type from firebase/auth
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null, // Use Firebase's User type for better safety
    isAuthenticated: false,   // True when user is logged in, false otherwise
    authIsReady: false,       // New flag: True when the initial auth state has been determined
    isLoading: false,         // For signup/login/logout operations
    error: null as string | null, // For displaying error messages
  }),
  actions: {
    // This action initializes the Firebase authentication listener.
    // It's typically called once at app startup (e.g., in a Nuxt plugin).
    initAuth() {
      // It's crucial to call useNuxtApp() within a context where Nuxt composables are available,
      // which is true when this action is called from a Nuxt plugin or component setup.
      const nuxtApp = useNuxtApp();
      const auth = nuxtApp.$auth; // Access the injected Firebase auth instance

      if (!auth) {
        console.error('Firebase Auth service is not available. Ensure plugins/firebase.client.ts is correctly initialized.');
        // Set authIsReady to true even if auth is not available to avoid infinite loading states
        this.authIsReady = true;
        return;
      }

      // onAuthStateChanged is a global listener. It will fire initially and then on every auth state change.
      onAuthStateChanged(auth, (user) => {
        this.user = user;
        this.isAuthenticated = !!user; // Set true if user object exists, false otherwise
        this.authIsReady = true;       // Indicate that the initial auth state has been determined
        // You might consider navigating here, but Nuxt middleware is often better for routing logic.
      });
    },

    async signup(email: string, password: string) {
      const nuxtApp = useNuxtApp();
      const auth = nuxtApp.$auth;

      if (!auth) {
        this.error = 'Firebase Auth service not available.';
        throw new Error(this.error);
      }

      this.isLoading = true;
      this.error = null; // Clear previous errors

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        this.isAuthenticated = true; // User is now authenticated
      } catch (e: any) { // Catch the error to handle it locally and re-throw if needed
        this.error = e.message || 'An unknown error occurred during signup.';
        console.error('Signup error:', e);
        throw e; // Re-throw the error for component to catch
      } finally {
        this.isLoading = false; // Always set loading to false
      }
    },

    async login(email: string, password: string) {
      const nuxtApp = useNuxtApp();
      const auth = nuxtApp.$auth;

      if (!auth) {
        this.error = 'Firebase Auth service not available.';
        throw new Error(this.error);
      }

      this.isLoading = true;
      this.error = null;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
        this.isAuthenticated = true; // User is now authenticated
      } catch (e: any) {
        this.error = e.message || 'An unknown error occurred during login.';
        console.error('Login error:', e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      const nuxtApp = useNuxtApp();
      const auth = nuxtApp.$auth;

      if (!auth) {
        this.error = 'Firebase Auth service not available.';
        throw new Error(this.error);
      }

      this.isLoading = true;
      this.error = null;

      try {
        await signOut(auth);
        this.user = null;
        this.isAuthenticated = false; // User is no longer authenticated
      } catch (e: any) {
        this.error = e.message || 'An unknown error occurred during logout.';
        console.error('Logout error:', e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
  },
});