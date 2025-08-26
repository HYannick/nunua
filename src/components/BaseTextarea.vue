<script setup lang="ts">
import Squircle from '@/components/Squircle.vue';

withDefaults(
    defineProps<{
      modelValue?: string | number;
      name: string;
      label?: string;
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
        background-class="bg-base-100 w-full"
    >
      <textarea class="w-full textarea textarea-ghost" :id="name" :name="name" v-bind="$attrs" :value="modelValue" :placeholder="$t(placeholder)"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </Squircle>
  </div>
</template>