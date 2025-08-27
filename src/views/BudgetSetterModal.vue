<script lang="ts" setup="">

import BaseInput from '@/components/BaseInput.vue';
import {ref} from 'vue';
const props = defineProps<
    {initialBudget?: number}
>()
const budgetValue = ref(props.initialBudget ?? 0);

defineEmits(['save-budget'])
</script>
<template>
  <dialog class="modal">
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{{ $t('budgetInfos.setBudget') }}</h3>
      <form @submit.prevent="$emit('save-budget', budgetValue)">
        <BaseInput name="budget" type="number" v-model="budgetValue" label="budgetInfos.budgetLabel" placeholder="0.00" step="0.01" min="0"/>
      </form>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-ghost">
            {{ $t('buttons.cancel') }}
          </button>
        </form>
        <button class="btn btn-primary" type="submit" @click="$emit('save-budget', budgetValue)">
          {{ $t('buttons.save') }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>