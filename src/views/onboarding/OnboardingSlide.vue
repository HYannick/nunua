<script setup lang="ts">

defineProps<
    {
      title: string;
      description: string;
      illustration: string;
    }
>()

</script>
<template>
  <div
      class="text-center space-y-8 animate-fade-in"
  >
    <!-- Illustration -->
    <div class="flex justify-center">
      <component :is="illustration"
                 class="w-64 h-64 object-contain" />
    </div>

    <!-- Title -->
    <h1 class="text-3xl font-bold font-serif text-gray-800">
      {{ $t(title) }}
    </h1>

    <!-- Description -->
    <p class="text-gray-600 text-lg leading-relaxed">
      {{ $t(description) }}
    </p>
  </div>
</template>

<style scoped>

</style>