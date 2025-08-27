<script lang="ts" setup="">
import type {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';
import {computed} from 'vue';
import {LucideCoins, LucideShoppingCart} from 'lucide-vue-next';
import Squircle from '@/components/Squircle.vue';
import {useCurrency} from '@/composables/useCurrency.ts';

const props = defineProps<{
  groceryItems: GroceryItem[];
  budget?: number;
}>()
defineEmits<
    {
      (e: 'expand'): void;
      (e: 'editBudget'): void;
      (e: 'openBudgetModal'): void;
    }>()

const {formatCurrency} = useCurrency();
const totalItems = computed(() => {
  return props.groceryItems.length;
});

const totalCheckedItems = computed(() => {
  return props.groceryItems.filter(item => item.checked).length;
});

const checkedItems = computed(() => props.groceryItems.filter(item => item.checked))

const totalCost = computed(() => {
  return checkedItems.value.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);
});

const sortedCheckedItems = computed(() => {
  return checkedItems.value.sort((a, b) => b.price! - a.price!);
});

</script>
<template>
  <div>
    <div class="h-full">
      <div @click="$emit('expand')" class="h-28 px-5">
        <p class="text-sm text-base-content/50 text-center">{{ $t('budgetInfos.totalItems', {count: totalCheckedItems, total: totalItems}) }}</p>
        <Squircle
            :corner-radius="12"
            :corner-smoothing="0.8"
            class="w-full"
        >
          <div class="p-2 flex justify-between items-center mt-2">
            <div>
              <button class="btn btn-ghost bg-primary/15 border-primary/50 border-2 text-primary rounded-full flex items-center gap-2" v-if="budget" @click.stop="$emit('editBudget')">
                <LucideCoins :size="16" class="opacity-50"/>
                <p>{{ $t('budgetInfos.budgetLabel') }}</p>
                <p class="font-bold">{{ formatCurrency(budget) }}</p>
              </button>
              <button class="btn btn-ghost bg-primary/15 border-primary/50 border-2 text-primary rounded-full flex items-center gap-2"
                      @click.stop="$emit('openBudgetModal')" v-else size="sm">
                <LucideCoins :size="16" class="opacity-50"/>
                {{$t('budgetInfos.setBudget')}}
              </button>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <LucideShoppingCart :size="16" class="opacity-50"/>
                <p class="text-base-content">{{ $t('budgetInfos.totalCost') }}</p>
                <p class="font-bold" :class="{
                  'text-error': budget && totalCost > budget,
                  'text-success': budget && totalCost <= budget,
                  'text-warning': budget && (totalCost === budget || totalCost > budget * 0.9 && totalCost < budget),
                  'text-base-content': !budget
                }">{{ formatCurrency(totalCost) }}</p>
              </div>
            </div>
          </div>
        </Squircle>
      </div>
      <div class="rounded-2xl py-2 px-5 mt-2">
        <ul>
          <li class="opacity-50">
            <div class="px-5 py-2 border-b border-base-content border-dashed last:border-0 grid grid-cols-3 font-bold">
              <p>{{ $t('budgetInfos.table.header.name') }}</p>
              <p class="text-end">{{ $t('budgetInfos.table.header.quantity') }}</p>
              <p class="text-end">{{ $t('budgetInfos.table.header.price') }}</p>
            </div>
          </li>
          <li v-for="item in sortedCheckedItems" :key="item.id"
              class="px-5 py-2 border-b border-base-content border-dashed last:border-0 grid grid-cols-3">
            <p class="truncate">{{ item.text }}</p>
            <p class="text-end">{{ item.quantity }}</p>
            <p class="text-end font-bold">{{ formatCurrency(((item.price || 0) * (item.quantity || 1))) }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>