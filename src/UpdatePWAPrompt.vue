<template>
  <div v-if="updateAvailable" class="toast toast-top toast-center">
    <div class="alert alert-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div>
        <h3 class="font-bold">Update Available!</h3>
        <div class="text-xs">A new version of the app is ready.</div>
      </div>
      <div class="flex gap-2">
        <button @click="closePrompt" class="btn btn-sm">Later</button>
        <button @click="updateApp" class="btn btn-sm btn-primary">Update</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePWA } from '@/composables/usePWA'

const { updateAvailable, updateApp, closePrompt } = usePWA()
</script>