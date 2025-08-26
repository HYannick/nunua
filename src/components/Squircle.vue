<template>
  <component
      :is="as"
      ref="elementRef"
      :class="[borderClass, { [backgroundClass || '']: !borderWidth }]"
      :style="{
      clipPath: `path('${outerPath}')`,
      borderRadius: `${cornerRadius}px`,
      width: width ? `${width}px` : defaultWidth ? `${defaultWidth}px` : undefined,
      height: height ? `${height}px` : defaultHeight ? `${defaultHeight}px` : undefined,
      backgroundColor: borderWidth && !borderClass ? borderColor : undefined,
      padding: borderWidth ? `${borderWidth}px` : '0',
      ...style
    }"
      :data-squircle="cornerRadius"
      v-bind="$attrs"
  >
    <div
        v-if="borderWidth"
        :class="backgroundClass"
        :style="{
        clipPath: `path('${innerPath}')`,
        width: '100%',
        height: '100%',
        backgroundColor: !backgroundClass ? backgroundColor : undefined
      }"
    >
      <slot />
    </div>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getSvgPath } from 'figma-squircle'
import { useElementSize } from '@vueuse/core'

interface Props {
  as?: string
  cornerSmoothing?: number
  cornerRadius?: number
  width?: number
  height?: number
  defaultWidth?: number
  defaultHeight?: number
  borderWidth?: number
  borderColor?: string
  backgroundColor?: string
  borderClass?: string
  backgroundClass?: string
  style?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  cornerSmoothing: 0.6,
  borderWidth: 0,
  borderColor: '#000000',
  backgroundColor: 'white'
})

const elementRef = ref<HTMLElement>()
const { width: observedWidth, height: observedHeight } = useElementSize(elementRef)

const actualWidth = computed(() => props.width ?? observedWidth.value)
const actualHeight = computed(() => props.height ?? observedHeight.value)

const outerPath = computed(() => {
  if (actualWidth.value === 0 || actualHeight.value === 0) return ''

  return getSvgPath({
    width: actualWidth.value,
    height: actualHeight.value,
    cornerRadius: props.cornerRadius,
    cornerSmoothing: props.cornerSmoothing,
  })
})

const innerPath = computed(() => {
  if (!props.borderWidth || actualWidth.value === 0 || actualHeight.value === 0) return ''

  const innerWidth = actualWidth.value - (props.borderWidth * 2)
  const innerHeight = actualHeight.value - (props.borderWidth * 2)
  const innerCornerRadius = Math.max(0, (props.cornerRadius || 0) - props.borderWidth)

  return getSvgPath({
    width: innerWidth,
    height: innerHeight,
    cornerRadius: innerCornerRadius,
    cornerSmoothing: props.cornerSmoothing,
  })
})
</script>