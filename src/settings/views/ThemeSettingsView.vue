<script lang="ts" setup="">
import {storeToRefs} from 'pinia';
import {DARK_THEME, useSettingsStore} from '../store/SettingsStore.ts';
import BaseHeroHeading from '@/components/BaseHeroHeading.vue';
import {LucidePalette, LucideSunMoon} from 'lucide-vue-next';

const settingsStore = useSettingsStore()
const {isDarkMode} = storeToRefs(settingsStore)

const toggleTheme = async () => {
  try {
    const newTheme = isDarkMode.value ? DARK_THEME : 'light'
    await settingsStore.setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    settingsStore.updateThemeColor('--color-base-200');
    window.location.reload();
  } catch (error) {
    console.error('Error changing theme:', error)
    isDarkMode.value = !isDarkMode.value
  }
}
</script>
<template>
  <div class="page">
    <BaseHeroHeading title="settings.themes.title"/>
    <div class="flex flex-col">
      <div class="flex items-center justify-between p-6 bg-base-100 border-b border-base-300">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
           <LucideSunMoon />
          </div>
          <div>
            <h3 class="text-base font-semibold text-base-content">{{ $t('settings.themes.title') }}</h3>
            <p class="text-sm text-base-content/60">{{ $t('settings.themes.lightOrDark') }}</p>
          </div>
        </div>
        <div class="flex-shrink-0">
          <input
              v-model="isDarkMode"
              @change="toggleTheme"
              type="checkbox"
              class="toggle toggle-primary"
          />
        </div>
      </div>
      <div class="flex items-center justify-between p-6 bg-base-100 border-b border-base-300">
        <RouterLink :to="{name: 'custom-theme-settings'}" class="w-full flex items-center justify-between space-x-6">
          <div class="">
            <LucidePalette />
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-base-content">{{ $t('settings.customThemes.title') }}</h3>
            <p class="text-sm text-base-content/60">{{ $t('settings.customThemes.description') }}</p>
          </div>
          <div class="">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-base-content/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>