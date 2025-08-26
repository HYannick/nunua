<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    name: string;
    label: string;
    placeholder?: string;
    options: Array<{ value: string; label: string }>;
  }>(), {
    placeholder: 'Enter value here'
  }
)

defineEmits([
  'update:modelValue'
])
</script>
<template>
  <div>
    <label :for="name" class="font-semibold  mb-2 block">{{ $t(label) }}</label>
    <select
      :id="name"
      :name="name"
      :value="modelValue"
      class="select border border-base-content/50 w-full input-xl text-lg rounded-xl px-3"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ $t(option.label) }}
      </option>
    </select>
  </div>
</template>