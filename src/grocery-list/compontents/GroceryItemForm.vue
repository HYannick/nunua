<script lang="ts" setup="">

import {LucidePlus} from 'lucide-vue-next';
import BaseInput from '@/components/BaseInput.vue';
import {ref} from 'vue';
import type {GroceryItemToCreateDto} from '@/grocery-list/dtos/GroceryItemToCreate.dto.ts';

const emit = defineEmits(['submit'])
const props = defineProps<
    {
      listId: string,
      addedBy: string
    }
>()
const listItem = ref<GroceryItemToCreateDto>({
  text: '',
  checked: false,
  addedBy: props.addedBy,
  listId: props.listId,
});

const submit = () => {
  if (listItem.value.text.trim() === '') {
    return;
  }
  emit('submit', listItem.value);
  listItem.value.text = '';
};
</script>
<template>
  <form class="p-5 w-full flex items-center gap-3 relative" @submit.prevent="submit">
    <BaseInput name="name" placeholder="listDetails.addItemForm.inputNamePlaceholder" class="flex-1" v-model="listItem.text"/>
    <button class="mask mask-squircle btn btn-primary btn-square btn-xl flex items-center justify-center" type="submit">
      <LucidePlus/>
    </button>
  </form>
</template>

<style scoped>

</style>