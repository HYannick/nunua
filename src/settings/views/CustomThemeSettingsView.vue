<script lang="ts" setup="">
import {computed} from 'vue';
import themes from 'daisyui/theme/object';
import ThemeCard from '@/settings/components/ThemeCard.vue';
import BaseHeroHeading from '@/components/BaseHeroHeading.vue';
import {useSettingsStore} from '@/settings/store/SettingsStore.ts';

const settingsStore = useSettingsStore()

const setTheme = async (theme: string) => {
  try {
    await settingsStore.setTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
    settingsStore.updateThemeColor('--color-base-200');
    window.location.reload()
  } catch (error) {
    console.error('Error setting theme:', error)
  }
}

const darkThemeList = computed(() => {
  return Object.keys(themes).filter(key => themes[key]['color-scheme'] === 'dark')
})

const lightThemeList = computed(() => {
  return Object.keys(themes).filter(key => themes[key]['color-scheme'] === 'light')
})
</script>
<template>
  <div class="page">
    <BaseHeroHeading title="settings.themes.title"/>
    <div class="flex flex-col">
      <div class="overflow-y-scroll h-full relative">
        <div class="p-5">
          <p class="text-lg font-bold mb-5">Light themes</p>
          <div class="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <ThemeCard v-for="(theme) in lightThemeList" :theme="theme" @click="setTheme(theme)"/>
          </div>
        </div>
        <div class="p-5">
          <p class="text-lg font-bold my-5">Dark themes</p>
          <div class="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <ThemeCard v-for="(theme) in darkThemeList" :theme="theme" @click="setTheme(theme)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>