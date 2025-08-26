<template>
  <svg
      :viewBox="`0 0 ${SIZE} ${SIZE}`"
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      v-bind="$attrs"
  >
    <title v-if="title">{{ name }}</title>
    <mask
        :id="maskID"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        :width="SIZE"
        :height="SIZE"
    >
      <rect :width="SIZE" :height="SIZE" :rx="square ? undefined : SIZE * 2" fill="#FFFFFF" />
    </mask>
    <g :mask="`url(#${maskID})`">
      <!-- Generate 8x8 grid of rectangles -->
      <rect
          v-for="(color, index) in pixelColors"
          :key="index"
          :x="(index % 8) * 10"
          :y="Math.floor(index / 8) * 10"
          width="10"
          height="10"
          :fill="color"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hashCode, getRandomColor } from './utilities'

interface Props {
  name: string
  colors: string[]
  title?: boolean
  square?: boolean
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  title: false,
  square: false
})

const ELEMENTS = 64
const SIZE = 80

const generateColors = (name: string, colors: string[]): string[] => {
  const numFromName = hashCode(name)
  const range = colors.length

  return Array.from({ length: ELEMENTS }, (_, i) =>
      getRandomColor(numFromName % (i + 1), colors, range)
  )
}

const pixelColors = computed(() => generateColors(props.name, props.colors))

// Generate a unique ID for this component instance
const maskID = `mask-${Math.random().toString(36).substr(2, 9)}`

defineOptions({
  inheritAttrs: false
})
</script>
