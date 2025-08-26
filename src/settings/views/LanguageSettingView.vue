<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseHeroHeading from '@/components/BaseHeroHeading.vue';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useSettingsStore} from '@/settings/store/SettingsStore.ts';

interface Language {
  locale: string
  subLocale: string
  fullLocale: string
  name: string
  nativeName: string
  flag: string
}

// Inject services
const settingsStore = useSettingsStore()
const i18n = useI18n();
const {currentLanguage} = storeToRefs(settingsStore)
const router = useRouter()

const isLoading = ref(false)

// Available languages
const languages: Language[] = [
  {
    locale: 'en',
    subLocale: 'GB',
    fullLocale: 'en_GB',
    name: 'settings.languages.english_uk',
    nativeName: 'English',
    flag: '🇬🇧'
  },
  {
    locale: 'fr',
    subLocale: 'FR',
    fullLocale: 'fr_FR',
    name: 'settings.languages.french',
    nativeName: 'Français',
    flag: '🇫🇷'
  },
  {
    locale: 'de',
    subLocale: 'DE',
    fullLocale: 'de_DE',
    name: 'settings.languages.german',
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  },
]

// Select language
const selectLanguage = async (language: Language) => {
  if (currentLanguage.value === language.locale) {
    return // Already selected
  }

  isLoading.value = true

  try {
    // Save language preference
    await settingsStore.setLanguage(language.locale)
    i18n.locale.value = language.locale
    router.go(-1)
  } catch (error) {
    console.error('Error changing language:', error)
    isLoading.value = false

    // Handle error - you might want to show an error toast here
    alert('Failed to change language. Please try again.')
  }
}
</script>

<template>
  <div class="page">
    <!-- Header -->
    <BaseHeroHeading title="settings.languages.title" />

    <!-- Language List -->
    <div class="p-4">
      <div class="space-y-2">
        <div
            v-for="language in languages"
            :key="language.fullLocale"
            @click="selectLanguage(language)"
            class="flex items-center justify-between p-4 bg-base-100 hover:bg-base-200 rounded-lg cursor-pointer transition-colors duration-200 border border-base-300"
            :class="{ 'ring-2 ring-primary bg-primary/5': currentLanguage === language.locale }"
        >
          <div class="flex items-center space-x-6">
            <!-- Flag Icon -->
            <div class="text-2xl">
              {{ language.flag }}
            </div>

            <!-- Language Name -->
            <div>
              <h3 class="text-base font-semibold text-base-content">
                {{ $t(language.name) }}
              </h3>
              <p class="text-sm text-base-content/60">
                {{ language.nativeName }}
              </p>
            </div>
          </div>

          <!-- Check Icon -->
          <div v-if="currentLanguage === language.locale" class="flex-shrink-0">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="mt-8 p-4 bg-base-200 rounded-lg">
        <div class="flex items-start space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-base-content/70">
            <p class="font-medium mb-1">Language Settings</p>
            <p>The app will restart to apply the new language. Your selected language will be saved and applied across the entire app.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Custom transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects */
.hover\:bg-base-200:hover {
  background-color: oklch(var(--b2));
}

/* Selected state */
.ring-2 {
  box-shadow: 0 0 0 2px oklch(var(--p));
}

.bg-primary\/5 {
  background-color: oklch(var(--p) / 0.05);
}
</style>