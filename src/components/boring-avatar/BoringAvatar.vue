<template>
  <component
      :is="avatarComponent"
      :colors="colors"
      :name="name"
      :title="title"
      :size="size"
      :square="square"
      v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import AvatarBauhaus from './avatar-bauhaus.vue'
import AvatarRing from './avatar-ring.vue'
import AvatarPixel from './avatar-pixel.vue'
import AvatarBeam from './avatar-beam.vue'
import AvatarSunset from './avatar-sunset.vue'
import AvatarMarble from './avatar-marble.vue'

// Define props interface
export interface AvatarProps {
  variant?: 'pixel' | 'bauhaus' | 'ring' | 'beam' | 'sunset' | 'marble' | 'geometric' | 'abstract'
  colors?: string[]
  name?: string
  title?: boolean
  size?: number | string
  square?: boolean
}

// Define props with defaults
const props = withDefaults(defineProps<AvatarProps>(), {
  variant: 'marble',
  colors: () => ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
  name: 'Clara Barton',
  title: false,
  square: false
})

// Avatar variants mapping
const AVATAR_VARIANTS: Record<string, Component> = {
  pixel: AvatarPixel,
  bauhaus: AvatarBauhaus,
  ring: AvatarRing,
  beam: AvatarBeam,
  sunset: AvatarSunset,
  marble: AvatarMarble,
}

// Deprecated variants mapping
const DEPRECATED_VARIANTS: Record<string, string> = {
  geometric: 'beam',
  abstract: 'bauhaus',
}

// Computed property to resolve the correct avatar component
const avatarComponent = computed(() => {
  const resolvedVariant = DEPRECATED_VARIANTS[props.variant] || props.variant
  return AVATAR_VARIANTS[resolvedVariant] || AvatarMarble
})

// Enable attribute inheritance
defineOptions({
  inheritAttrs: false
})
</script>