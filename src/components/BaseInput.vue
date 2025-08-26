<script setup lang="ts">
import Squircle from '@/components/Squircle.vue';

withDefaults(
  defineProps<{
    modelValue?: string | number;
    name: string;
    label?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'month' | 'week' | 'datetime-local' | 'color' | 'file' | 'hidden' | 'range' | 'checkbox' | 'radio';
    placeholder?: string;
    icon?: string;
  }>(), {
    modelValue: '',
    type: 'text',
    placeholder: 'Enter value here'
  }
)

defineEmits([
  'update:modelValue'
])
</script>
<template>
  <div>
    <label v-if="label" :for="name" class="font-semibold mb-2 block">{{ $t(label) }}</label>
    <Squircle
        :corner-radius="15"
        :corner-smoothing="0.8"
        :border-width="2"
        border-class="bg-base-content/50"
        background-class="bg-base-100"
    >
    <label class="input input-ghost w-full -mt-1.5 input-xl text-lg px-3 bg-transparent">
      <slot name="icon"></slot>
      <input :id="name" :name="name" :type="type"  v-bind="$attrs" :value="modelValue" :placeholder="$t(placeholder)"
             @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </label>
    </Squircle>
  </div>
</template>