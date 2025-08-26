<script setup lang="ts">

import Squircle from '@/components/Squircle.vue';

withDefaults(
    defineProps<{
      label: string;
      type?: 'button' | 'submit' | 'reset';
      btnStyle?: 'outline' | 'ghost' | 'other'
      btnColorClass?: string;
      size?: 'sm' | 'md' | 'lg' | 'xl';
    }>(), {
      type: 'button',
      classes: '',
      btnStyle: 'other',
      btnColorClass: 'btn-primary',
      size: 'lg'
    }
)
</script>
<template>
  <Squircle
      :corner-radius="15"
      :corner-smoothing="0.8"
      :border-width="btnStyle === 'outline' ? 1.5 : 0"
      :border-class="btnStyle === 'ghost' ? 'bg-base-100' : 'bg-base-content'"
      :background-class="btnStyle !== 'other' ? 'bg-base-100' : 'bg-base-content'"
  >
    <button
        :type="type"
        class="btn btn-lg w-full"
        :class="{
          'btn-ghost bg-transparent': btnStyle === 'ghost',
          'bg-transparent': btnStyle === 'outline',
           [btnColorClass]: btnStyle === 'other',
           [`btn-${size}`]: true
        }"
    >
      <span :class="{'-mt-1': btnStyle === 'outline'}">{{ $t(label) }}</span>
    </button>
  </Squircle>
</template>

<style scoped>

</style>