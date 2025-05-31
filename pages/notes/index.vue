<template>

    <div class="notes-list-page">
        <h1>My Notes</h1>
        <div v-if="!notes.length" class="no-notes">
            <p>No notes available. Please create a new note.</p>
        </div>
        <div v-else class="notes-container">
            <div v-for="note in notes" :key="note.id" class="note-item">
                <h2>{{ note.title }}</h2>
                <p>{{ note.content }}</p>
                <button @click="editNote(note.id)">Edit</button>
                <button @click="deleteNote(note.id)">Delete</button>
            </div>
        </div>
        <button @click="createNote">Create New Note</button>
    </div>

</template>

<script setup>

import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useNotes } from '~/composables/useNotes'; 


definePageMeta({
    middleware: 'auth' // Ensure user is authenticated
});
const authStore = useAuthStore();
const {notes, loading, error, addNote, updateNote, deleteNote  } = useNotes();

const newContent = ref('');
const editingNoteId = ref(null);
const editingNoteContent = ref('');


async function handleCreateNote() {
  if (newNoteContent.value.trim()) {
    try {
      await addNote(newNoteContent.value);
      newNoteContent.value = '';
    } catch (err) {
      console.error('Failed to add note:', err);
      // TODO: Display error to user via a notification system
    }
  }
}

function cancelEdit() {
  editingNoteId.value = null;
  editingNoteContent.value = '';
}

function handleEditNote(id, content) {
  editingNoteId.value = id;
  editingNoteContent.value = content;
}

async function saveEditedNote() {
  if (editingNoteId.value && editingNoteContent.value.trim()) {
    try {
      await updateNote(editingNoteId.value, editingNoteContent.value);
      cancelEdit();
    } catch (err) {
      console.error('Failed to update note:', err);
      // TODO: Display error to user
    }
  }
}

async function handleDeleteNote(id) {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await deleteNote(id);
    } catch (err) {
      console.error('Failed to delete note:', err);
      // TODO: Display error to user
    }
  }
}


</script>

<style scoped>
.notes-list-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
.new-note-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.new-note-form textarea {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 80px;
}
.new-note-form button {
  padding: 10px 15px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.note-item {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: relative;
}
.note-actions button {
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.note-actions button:first-of-type {
  background-color: #007bff;
  color: white;
}
.note-actions button:last-of-type {
  background-color: #dc3545;
  color: white;
}
.error-message {
  color: red;
  margin-bottom: 15px;
}
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.edit-modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  max-width: 500px;
  width: 90%;
}
.edit-modal-content textarea {
  width: calc(100% - 20px);
  min-height: 120px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>