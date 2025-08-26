<script setup lang="ts">

import {triggerHaptics} from '@/utils/haptics.utils.ts';
import Squircle from '@/components/Squircle.vue';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import {computed} from 'vue';

const props = defineProps<
    {
      groceryList: GroceryList,
      status: 'local' | 'active' | 'archived' | 'deleted'
    }
>()

const routerLinkTo = computed(() => {
  if(props.status === 'local') {
    return {name: 'local-grocery-list', params: {id: props.groceryList.id}};
  }
  return {
    name: 'grocery-list',
    params: {shareCode: props.groceryList.shareCode}
  }
})
</script>
<template>
  <RouterLink :to="routerLinkTo" class="block">
    <Squircle
        :corner-radius="16"
        :corner-smoothing="0.8"
        class="bg-secondary/40 h-30 relative"
        @click="triggerHaptics"
    >
    <span class="text-lg font-semibold p-5 flex w-full">
      {{ groceryList.name }}
    </span>
      <img v-if='groceryList.background' :src="groceryList.background" alt="Background Image"
           class="absolute opacity-40 top-0 left-0 w-full h-full object-cover -z-10"/>
    </Squircle>
  </RouterLink>
</template>

<style scoped>

</style>