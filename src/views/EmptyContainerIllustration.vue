<script lang="ts" setup="">

import Squircle from '@/components/Squircle.vue';

defineProps<{
  title: string;
  description: string;
  illustration: string;
}>()
</script>
<template>
  <Squircle :corner-radius="50"
            :corner-smoothing="0.8"
            background-class="bg-secondary/5">
    <div class="p-10">
      <component :is="illustration" class="w-2/3 mx-auto"/>
      <p class="text-center mt-5 font-bold">{{ $t(title) }}</p>
      <p class="text-center mt-2 text-sm">{{$t(description)}}</p>
      <slot name="actions"></slot>
    </div>
  </Squircle>
</template>

<style scoped>

</style>