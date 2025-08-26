<script setup lang="ts">

import {triggerHaptics} from '@/utils/haptics.utils.ts';
import {LucidePlus} from 'lucide-vue-next';
import {useFABAction} from '@/composables/useFABAction.ts';
import {onMounted, watch} from 'vue';
import {useRoute} from 'vue-router';

const {toggleControls, controlsOpen, closeControls} = useFABAction();
defineProps<{
  buttons: {
    to?: string;
    icon: any;
    label: string;
    action?: () => void;
  }[]
}>();

const route = useRoute()
onMounted(() => {
  if (route.query.controls) {
    closeControls();
  }
})

watch(() => route.query.createList, (query) => {
  if(query) {
    closeControls({goBack: false});
  }
});

const triggerAction = (action?: () => void) => {
  triggerHaptics();
  if (action) {
    action();
  }
};

</script>
<template>
  <div class="fixed bottom-0 left-0 right-0 p-5 flex justify-between items-end bg-gradient-to-t from-base-100 from-5%">
    <div>
      <slot name="details"></slot>
    </div>
    <button @click="toggleControls" class="mask mask-squircle flex items-center justify-center btn btn-primary w-16 h-16 btn-square">
      <LucidePlus/>
    </button>
  </div>
  <div class="h-20"></div>
  <div class="fixed right-5 bottom-20 z-50 flex flex-col items-end">
    <Transition name="slide">
      <div class="flex flex-col gap-5 mb-5 items-end" v-if="controlsOpen">
        <div v-for="button in buttons" :key="button.label">
          <RouterLink v-if="button.to" :to="{name: button.to}" @click="triggerHaptics" class="flex gap-5 items-center cursor-pointer">
            <span>{{ $t(button.label) }}</span>
            <div class="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <component :is="button.icon" class="w-6 stroke-2 text-primary-content"/>
            </div>
          </RouterLink>
          <button v-else @click="triggerAction(button.action)" class="flex gap-5 items-center cursor-pointer">
            <span>{{ $t(button.label) }}</span>
            <span class="mask mask-squircle flex w-16 h-16 rounded-2xl bg-primary items-center justify-center">
              <component :is="button.icon" class="w-6 stroke-2 text-primary-content"/>
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
  <Transition name="fade">
    <div v-if="controlsOpen" class="fixed inset-0 bg-base-100 opacity-90 z-10" @click="closeControls()"></div>
  </Transition>
</template>