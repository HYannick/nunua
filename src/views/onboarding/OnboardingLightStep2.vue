<script setup lang="ts">

import BaseInput from '@/components/BaseInput.vue';
import BaseAvatar from '@/components/BaseAvatar.vue';
import {ref} from 'vue';
import {generateRandomWord} from '@/utils/string.utils.ts';

const props = defineProps<{
  modelValue: string;
  avatarString: string;
}>()
const showError = ref(false)
const errorMessage = ref('')
const emit = defineEmits(['update:model-value', 'avatar-generated', 'handleNext'])

const avatar = ref(props.avatarString)

function generateNewAvatar() {
  avatar.value = generateRandomWord(10)
  emit('avatar-generated', avatar.value)
}

</script>
<template>
  <div class="text-center space-y-6 animate-fade-in">
    <h1 class="text-3xl font-bold font-serif text-gray-800">{{ $t('joinOnboarding.joinList.title') }}</h1>
    <p class="text-gray-600">{{ $t('joinOnboarding.joinList.description')}}</p>

    <!-- Avatar -->
    <div class="flex justify-center">
      <button
          @click="generateNewAvatar"
          class="relative group"
      >
        <div class="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold group-hover:scale-105 transition-transform">
          <BaseAvatar :name="avatarString" class="w-32 h-32 rounded-full" />
        </div>
        <div class="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="text-white text-sm font-medium">Tap to change</span>
        </div>
      </button>
    </div>

    <!-- Username input -->
    <div class="space-y-2">
      <BaseInput
          :model-value="modelValue"
          type="text"
          name="username"
          class="text-center"
          placeholder="Enter your username"
          @input="$emit('update:model-value', $event.target.value)"
          @keyup.enter="$emit('handleNext')"
      />
      <p v-if="showError" class="text-error text-sm">{{ errorMessage }}</p>
    </div>
  </div>
</template>