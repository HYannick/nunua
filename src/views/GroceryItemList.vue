<script setup lang="ts">
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import GroceryListCard from '@/views/GroceryListCard.vue';

defineProps<
    {
      groceryList: GroceryList[],
      loading: boolean
    }
>()

defineEmits(['openSheet'])

</script>
<template>
  <div>
    <div v-if="loading" class="flex flex-col items-center justify-center w-full">
      <div class="loading loading-dots w-16"></div>
      <p class="text-base-content/40"> {{ $t('loadingMessages.lists') }}</p>
    </div>
    <div v-else-if="groceryList.length === 0">
      <slot name="emptyList"/>
    </div>
    <div v-else class="space-y-3">
      <GroceryListCard v-for="(item, index) in groceryList" :key="index" :grocery-list="item" :status="item.status" :style="{ '--i': index }"/>
    </div>
  </div>
</template>

<style scoped>

</style>

