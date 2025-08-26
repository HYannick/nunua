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
      <rect :width="SIZE" :height="SIZE" :fill="properties[0].color" />
      <rect
          :x="(SIZE - 60) / 2"
          :y="(SIZE - 20) / 2"
          :width="SIZE"
          :height="properties[1].isSquare ? SIZE : SIZE / 8"
          :fill="properties[1].color"
          :transform="`translate(${properties[1].translateX} ${properties[1].translateY}) rotate(${properties[1].rotate} ${SIZE / 2} ${SIZE / 2})`"
      />
      <circle
          :cx="SIZE / 2"
          :cy="SIZE / 2"
          :fill="properties[2].color"
          :r="SIZE / 5"
          :transform="`translate(${properties[2].translateX} ${properties[2].translateY})`"
      />
      <line
          x1="0"
          :y1="SIZE / 2"
          :x2="SIZE"
          :y2="SIZE / 2"
          stroke-width="2"
          :stroke="properties[3].color"
          :transform="`translate(${properties[3].translateX} ${properties[3].translateY}) rotate(${properties[3].rotate} ${SIZE / 2} ${SIZE / 2})`"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hashCode, getUnit, getRandomColor, getBoolean } from './utilities'

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

interface ElementProperty {
  color: string
  translateX: number
  translateY: number
  rotate: number
  isSquare: boolean
}

const generateColors = (name: string, colors: string[]): ElementProperty[] => {
  const numFromName = hashCode(name)
  const range = colors.length

  return Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 2 - (i + 17), 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 2 - (i + 17), 2),
    rotate: getUnit(numFromName * (i + 1), 360),
    isSquare: getBoolean(numFromName, 2),
  }))
}

const properties = computed(() => generateColors(props.name, props.colors))

// Generate a unique ID for this component instance
const maskID = `mask-${Math.random().toString(36).substr(2, 9)}`

defineOptions({
  inheritAttrs: false
})
</script>
