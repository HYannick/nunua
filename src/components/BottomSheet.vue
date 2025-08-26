<script setup lang="ts">
import {DrawerContent, DrawerOverlay, DrawerPortal} from 'vaul-vue';

defineEmits(['close']);
withDefaults(
    defineProps<{
      snap?: number | string
      withSnapPoints?: boolean
      bgColor?: string
    }>(),
    {
      snap: 1,
      withSnapPoints: false,
      bgColor: 'bg-base-100'
    }
)
</script>
<template>
  <DrawerPortal>
    <DrawerOverlay class="fixed inset-0 bg-base-content/70 z-50" @click="$emit('close')"/>
    <DrawerContent class="fixed bottom-0 left-0 right-0 bg-base-100 rounded-t-3xl z-50 max-h-[97%]" :class="{'h-full': withSnapPoints, [bgColor]: bgColor }">
      <div class="w-20 h-1 bg-base-content/30 mt-3 mb-2 rounded-full mx-auto"></div>
      <div :class=" {'overflow-y-auto': snap === 0.9,
              'overflow-hidden': snap !== 0.9}">
        <slot/>
      </div>
    </DrawerContent>
  </DrawerPortal>
</template>