<script setup lang="ts">

import BaseInput from '@/components/BaseInput.vue';
import {ref} from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import backgroundPictureOne from '@/assets/background-1.jpg';
import type {GroceryListToCreateDto} from '@/grocery-list/dtos/GroceryListToCreate.dto.ts';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import GroceryListBackgroundSelector from '@/grocery-list/compontents/GroceryListBackgroundSelector.vue';

const props = defineProps<{
  username: string;
}>()

const formData = ref<GroceryListToCreateDto>({
  name: '',
  description: '',
  createdBy: props.username,
  background: backgroundPictureOne,
  status: 'local',
  budget: 0
});

const isOnline = ref(false);

const emit = defineEmits(['submit', 'close'])
const notificationStore = useNotificationStore();
const {error} = notificationStore;
const submitForm = async () => {
  if (formData.value.name.trim() === '') {
    error('Please enter a name for the list.');
    return;
  }
  emit('submit', {
    ...formData.value,
    status: isOnline.value ? 'active' : 'local',
  });
  formData.value = {
    name: '',
    description: '',
    createdBy: props.username,
    background: backgroundPictureOne,
    status: 'local',
    budget: 0
  };
}

const resetFormAndClose = () => {
  formData.value = {
    name: '',
    description: '',
    createdBy: props.username,
    background: backgroundPictureOne,
    status: 'local',
    budget: 0
  };
  emit('close');
}

const handleEnterKey = () => {
  (document.activeElement as HTMLElement)?.blur();
}

</script>
<template>
  <form @submit.prevent="submitForm">
    <h2 class="text-2xl font-serif font-bold mb-5 px-5 pt-5">{{ $t('listCreation.title') }}</h2>
    <div class="space-y-2">
      <div class="px-5">
        <BaseInput name="name" label="listCreation.inputNameLabel" placeholder="listCreation.inputNamePlaceholder" v-model="formData.name" @keydown.enter.prevent="handleEnterKey"/>
      </div>
      <GroceryListBackgroundSelector label="listCreation.themeTitle" v-model="formData.background"/>
      <div class="px-5">
        <div class="flex flex-col space-y-2 bg-base-300 p-3 rounded-lg">
          <div>
            <label for="putOnline" class="font-bold">{{ $t('listCreation.shareList.title') }}</label>
          </div>
          <p class="text-sm">
            {{ $t('listCreation.shareList.description') }}
          </p>
          <input id="putOnline" type="checkbox" class="toggle toggle-xl" v-model="isOnline"/>
        </div>
      </div>
    </div>
    <div class="mt-10 space-y-3 flex justify-between gap-10 px-5">
      <div class="flex-1">
        <BaseButton @click="resetFormAndClose" label="buttons.cancel" btn-style="ghost" type="reset"/>
      </div>
      <div class="flex-1">
        <BaseButton label="buttons.createList" btn-style="other" type="submit"/>
      </div>
    </div>
  </form>
</template>

<style scoped>

</style>