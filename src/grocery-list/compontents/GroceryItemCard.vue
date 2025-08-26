<script lang="ts" setup="">

import {triggerHaptics} from '@/utils/haptics.utils.ts';
import Squircle from '@/components/Squircle.vue';
import type {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';
import {useCurrency} from '@/composables/useCurrency.ts';

defineProps<
    {
      item: GroceryItem
    }
>()
const emit = defineEmits(['checkItem', 'deleteItem', 'editItem']);
const openEdit = () => {
  triggerHaptics();
  emit('editItem');
}
const {formatCurrency} = useCurrency();
</script>
<template>
  <Squircle
      @click="openEdit"
      :corner-radius="16"
      :corner-smoothing="0.8"
      :class="`
              ${item.checked ? 'bg-secondary/50': 'bg-base-200'}
              text-base-content
              w-full
              active:scale-[0.98]
              duration-75
              `"
  >
    <div class="flex items-center gap-3">
      <div class="flex-1 flex relative">
        <label :for="item.id" class="py-5 pl-5 pr-3" @click.stop>
          <input :id="item.id" type="checkbox" class="checkbox" v-model="item.checked" @change.prevent="$emit('checkItem', item.checked)"
                 @click.stop/>
        </label>
        <div class="grid grid-cols-4 justify-between flex-1 py-5 pr-5">
          <p class="col-span-2 font-bold relative truncate">
            <span class="relative">
              {{ item.text }}
               <span
                   :class="`absolute transition-all origin-left w-full h-[2px] bg-base-content bottom-[7px] left-0 ${item.checked ? 'scale-x-100': 'scale-x-0'}`"></span>
            </span>
          </p>
          <p class="font-bold relative text-end">
            {{ item.quantity ||'1' }}
          </p>
          <p class="opacity-60 text-end">
           {{ formatCurrency(item.price ?? 0) }}
          </p>
        </div>
      </div>
    </div>
  </Squircle>
</template>

<style scoped>

</style>