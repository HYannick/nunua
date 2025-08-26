<script lang="ts" setup="">

import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import {ref} from 'vue';
import type {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';
import BaseTextarea from '@/components/BaseTextarea.vue';

const props = defineProps<{
  item: GroceryItem
}>();

defineEmits<{
  (e: 'saveItem', updatedItem: {quantity: number; price: number; notes: string}): void
}>();

const editItemForm = ref({
  quantity: props.item.quantity ?? 1,
  price: props.item.price ?? 0,
  notes: props.item?.notes ?? ''
});
</script>
<template>
  <form class="space-y-3" @submit.prevent="$emit('saveItem', editItemForm)">
    <h2 class="text-xl font-bold font-serif">{{$t('groceryItem.editTitle')}}</h2>
    <div class="divider"></div>
    <div class="flex gap-5">
      <BaseInput v-model="editItemForm.quantity" type="number" label="groceryItem.inputQuantityLabel" name="quantity" placeholder="groceryItem.inputPricePlaceholder"/>
      <BaseInput v-model="editItemForm.price" type="number" name="price" label="groceryItem.inputPriceLabel" step="0.01" placeholder="groceryItem.inputPricePlaceholder"/>
    </div>
    <div class="divider"></div>
    <BaseTextarea v-model="editItemForm.notes" name="notes" rows="3" placeholder="groceryItem.inputNotesPlaceholder" />
    <BaseButton type="submit" label="buttons.save" class="w-full"/>
  </form>
</template>

<style scoped>

</style>