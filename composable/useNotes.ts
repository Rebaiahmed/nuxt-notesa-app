// composables/useNotes.ts
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, watchEffect, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

export function useNotes() {
  const notes = ref([]);
  const error = ref(null);
  const loading = ref(true);

  // Access Firestore and Auth from the Nuxt app context
  const { $firestore, $auth } = useNuxtApp();
  const authStore = useAuthStore(); // Access our auth store for user ID

  let unsubscribeFromFirestore = null; // To store the unsubscribe function

  const fetchNotes = () => {
    loading.value = true;
    error.value = null;

    // Ensure user is logged in before attempting to fetch notes
    if (!authStore.user || !authStore.user.uid) {
      notes.value = [];
      loading.value = false;
      // No error, just no user to fetch notes for
      return;
    }

    // Create a reference to the user's notes collection
    // This assumes a Firestore structure like: users/{uid}/notes/{noteId}
    const notesCollectionRef = collection($firestore, `users/${authStore.user.uid}/notes`);
    const q = query(notesCollectionRef, orderBy('createdAt', 'desc')); // Order by creation date

    // Set up real-time listener
    unsubscribeFromFirestore = onSnapshot(q, (snapshot) => {
      let docs = [];
      snapshot.forEach(doc => {
        // Include ID and all data. Convert Firebase Timestamp to JS Date for display.
        const data = doc.data();
        docs.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        });
      });
      notes.value = docs;
      loading.value = false;
      error.value = null; // Clear any previous errors on successful fetch
    }, (err) => {
      console.error('Error fetching notes:', err);
      error.value = 'Failed to load notes. Please try again.';
      loading.value = false;
    });
  };

  // Use watchEffect to re-fetch notes when the user changes (login/logout)
  watchEffect(() => {
    if (authStore.authIsReady) { // Only run once auth state is confirmed
      if (authStore.user) {
        // User logged in, subscribe to notes
        if (unsubscribeFromFirestore) { // Unsubscribe from previous user's notes if any
          unsubscribeFromFirestore();
        }
        fetchNotes();
      } else {
        // User logged out, clear notes and unsubscribe
        if (unsubscribeFromFirestore) {
          unsubscribeFromFirestore();
          unsubscribeFromFirestore = null;
        }
        notes.value = [];
        loading.value = false;
      }
    }
  });

  const addNote = async (content) => {
    if (!authStore.user || !authStore.user.uid) {
      throw new Error('User not authenticated.');
    }
    const note = {
      content: content,
      createdAt: Timestamp.now(), // Use Firebase Timestamp
      updatedAt: Timestamp.now(),
    };
    try {
      await addDoc(collection($firestore, `users/${authStore.user.uid}/notes`), note);
    } catch (err) {
      console.error('Error adding note:', err);
      throw err;
    }
  };

  const updateNote = async (id, newContent) => {
    if (!authStore.user || !authStore.user.uid) {
      throw new Error('User not authenticated.');
    }
    const noteRef = doc($firestore, `users/${authStore.user.uid}/notes`, id);
    try {
      await updateDoc(noteRef, { content: newContent, updatedAt: Timestamp.now() });
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    }
  };

  const deleteNote = async (id) => {
    if (!authStore.user || !authStore.user.uid) {
      throw new Error('User not authenticated.');
    }
    const noteRef = doc($firestore, `users/${authStore.user.uid}/notes`, id);
    try {
      await deleteDoc(noteRef);
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    }
  };

  // Lifecycle hook to ensure Firestore listener is unsubscribed when component unmounts
  onUnmounted(() => {
    if (unsubscribeFromFirestore) {
      unsubscribeFromFirestore();
      unsubscribeFromFirestore = null;
    }
  });

  return { notes, loading, error, addNote, updateNote, deleteNote };
}