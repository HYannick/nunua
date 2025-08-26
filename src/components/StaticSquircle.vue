<template>
  <component
      :is="as"
      :style="{
      clipPath: `path('${path}')`,
      ...style
    }"
      v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getSvgPath } from 'figma-squircle'

interface Props {
  as?: string
  width: number
  height: number
  cornerRadius: number
  cornerSmoothing: number
  style?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div'
})

const path = computed(() => {
  return getSvgPath({
    width: props.width,
    height: props.height,
    cornerRadius: props.cornerRadius,
    cornerSmoothing: props.cornerSmoothing,
  })
})
</script>