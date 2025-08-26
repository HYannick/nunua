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
    <mask :id="maskID" maskUnits="userSpaceOnUse" x="0" y="0" :width="SIZE" :height="SIZE">
      <rect :width="SIZE" :height="SIZE" :rx="square ? undefined : SIZE * 2" fill="#FFFFFF" />
    </mask>
    <g :mask="`url(#${maskID})`">
      <path :fill="`url(#gradient_paint0_linear_${nameWithoutSpace})`" d="M0 0h80v40H0z" />
      <path :fill="`url(#gradient_paint1_linear_${nameWithoutSpace})`" d="M0 40h80v40H0z" />
    </g>
    <defs>
      <linearGradient
          :id="`gradient_paint0_linear_${nameWithoutSpace}`"
          :x1="SIZE / 2"
          y1="0"
          :x2="SIZE / 2"
          :y2="SIZE / 2"
          gradientUnits="userSpaceOnUse"
      >
        <stop :stop-color="sunsetColors[0]" />
        <stop offset="1" :stop-color="sunsetColors[1]" />
      </linearGradient>
      <linearGradient
          :id="`gradient_paint1_linear_${nameWithoutSpace}`"
          :x1="SIZE / 2"
          :y1="SIZE / 2"
          :x2="SIZE / 2"
          :y2="SIZE"
          gradientUnits="userSpaceOnUse"
      >
        <stop :stop-color="sunsetColors[2]" />
        <stop offset="1" :stop-color="sunsetColors[3]" />
      </linearGradient>
    </defs>
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

const ELEMENTS = 4
const SIZE = 80

const generateColors = (name: string, colors: string[]): string[] => {
  const numFromName = hashCode(name)
  const range = colors.length

  return Array.from({ length: ELEMENTS }, (_, i) =>
      getRandomColor(numFromName + i, colors, range)
  )
}

const sunsetColors = computed(() => generateColors(props.name, props.colors))
const nameWithoutSpace = computed(() => props.name.replace(/\s/g, ''))

// Generate a unique ID for this component instance
const maskID = `mask-${Math.random().toString(36).substr(2, 9)}`

defineOptions({
  inheritAttrs: false
})
</script>
