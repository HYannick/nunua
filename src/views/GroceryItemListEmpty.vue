<script lang="ts" setup="">

import {triggerHaptics} from '@/utils/haptics.utils.ts';
import Squircle from '@/components/Squircle.vue';
defineProps<{
  title: string;
  description: string;
  actions: {
    label: string;
    icon: any;
    action: () => void;
  }[];
}>()

</script>
<template>
  <Squircle
      :corner-radius="16"
      :corner-smoothing="0.8"
      class="bg-base-200 h-20 flex items-center justify-center relative"
      @click="triggerHaptics"
  >
    <div class="p-5 flex items-center justify-between w-full">
      <div>
        <p class="font-bold">{{$t(title)}}</p>
        <p class="text-sm">{{$t(description)}}</p>
      </div>
      <div class="flex items-center justify-center relative">
        <button  v-for="action in actions" :key="action.label" class="btn btn-primary mask mask-squircle btn-sm flex items-center justify-center" @click="action.action">
          <component :is="action.icon" />
        </button>
      </div>
    </div>
  </Squircle>
</template>

<style scoped>

</style>