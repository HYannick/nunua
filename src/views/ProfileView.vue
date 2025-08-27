<script setup lang="ts">

import BaseInput from '@/components/BaseInput.vue';
import BaseAvatar from '@/components/BaseAvatar.vue';
import {inject, ref} from 'vue';
import {generateRandomWord} from '@/utils/string.utils.ts';
import {useUserStore} from '@/stores/userStore.ts';
import {storeToRefs} from 'pinia';
import BaseHeading from '@/components/BaseHeading.vue';
import FloatingActionButton from '@/components/FloatingActionButton.vue';
import type {UserService} from '@/user/services/UserService.ts';
import {useRouter} from 'vue-router';

const userService = inject('userService') as UserService
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);
const showError = ref(false)
const errorMessage = ref('')
const emit = defineEmits(['update:model-value', 'avatar-generated', 'handleNext'])

const avatar = ref(currentUser.value?.avatar || generateRandomWord(10))
const username = ref(currentUser.value?.username || '')
function generateNewAvatar() {
  avatar.value = generateRandomWord(10)
  emit('avatar-generated', avatar.value)
}
const router = useRouter()

const updateProfile = async () => {
  if (!username.value.trim()) {
    return
  }

  try {
    const user = await userService.saveUser(username.value, avatar.value)
    userStore.setCurrentUser(user);
    await router.replace({name: 'home'})
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

</script>
<template>
  <div class="page">
    <BaseHeading title="" />
    <div class="p-5 text-center space-y-6 animate-fade-in">
      <h1 class="text-3xl font-bold font-serif text-gray-800">{{ $t('profile.title') }}</h1>
      <p class="text-gray-600">{{ $t('profile.description')}}</p>

      <!-- Avatar -->
      <div class="flex justify-center">
        <button
            @click="generateNewAvatar"
            class="relative group"
        >
          <span class="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold group-hover:scale-105 transition-transform">
            <BaseAvatar :name="avatar" class="w-32 h-32 rounded-full" />
          </span>
          <span class="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="text-white text-sm font-medium">Tap to change</span>
          </span>
        </button>
      </div>

      <!-- Username input -->
      <div class="space-y-2">
        <BaseInput
            v-model="username"
            type="text"
            name="username"
            class="text-center"
            placeholder="Enter your username"
            @input="$emit('update:model-value', $event.target.value)"
            @keyup.enter="$emit('handleNext')"
        />
        <p v-if="showError" class="text-error text-sm">{{ errorMessage }}</p>
      </div>

      <FloatingActionButton label="buttons.update" @click="updateProfile" />
    </div>
  </div>
</template>