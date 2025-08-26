<script setup lang="ts">
import {useRouter} from 'vue-router'
import BaseHeroHeading from '@/components/BaseHeroHeading.vue';
import {useSettingsStore} from '@/settings/store/SettingsStore.ts';
import {storeToRefs} from 'pinia';
import InstallPWACard from '@/views/InstallPWACard.vue';

// Inject services
const router = useRouter()

const {preferredCurrency} = storeToRefs(useSettingsStore());

const version = localStorage.getItem('app-version') || '1.0.0';

// Navigation methods
const navigateToLanguageSettings = () => {
  router.push({name: 'language-settings'})
}

const navigateToThemesSettings = () => {
  router.push({name: 'themes-settings'})
}

const navigateToCurrencySettings = () => {
  router.push({name: 'currency-settings'})
}

</script>

<template>
  <div class="min-h-screen page bg-base-100">
    <BaseHeroHeading title="settings.title"/>

    <!-- Settings List -->
    <div class="bg-base-100">
      <div class="max-w-2xl mx-auto">
        <!-- Language Settings -->
        <div
            @click="navigateToLanguageSettings"
            class="flex items-center justify-between p-6 bg-base-100 hover:bg-base-200 cursor-pointer transition-colors duration-200 border-b border-base-300"
        >
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7 text-base-content"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-base-content">{{ $t('settings.languages.title') }}</h3>
              <p class="text-sm text-base-content/60">{{ $t('settings.languages.description') }}</p>
            </div>
          </div>
          <div class="flex-shrink-0">
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
        </div>

        <div
            @click="navigateToCurrencySettings"
            class="flex items-center justify-between p-6 bg-base-100 hover:bg-base-200 cursor-pointer transition-colors duration-200 border-b border-base-300"
        >
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7 text-base-content"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-base-content">{{ $t('settings.currency.title') }}</h3>
              <p class="text-sm text-base-content/60">{{ $t('settings.currency.description') }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span v-if="preferredCurrency" class="text-sm text-base-content/80 font-medium">
              {{ preferredCurrency.code }}
            </span>
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
        </div>

        <!-- Theme Settings (Bonus) -->
        <div class="cursor-pointer flex items-center justify-between p-6 bg-base-100 border-b border-base-300" @click="navigateToThemesSettings">
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7 text-base-content"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-base-content">{{ $t('settings.themes.title') }}</h3>
              <p class="text-sm text-base-content/60">{{ $t('settings.themes.description') }}</p>
            </div>
          </div>
          <div class="flex-shrink-0">
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
        </div>

        <InstallPWACard />

        <!-- App Info Section -->
        <div class="p-6 bg-base-100">
          <div class="text-center text-base-content/60">
            <p class="text-sm">Nunua App</p>
            <p class="text-xs mt-1">Version {{ version }}</p>
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

/* Custom gradient */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-primary {
  --tw-gradient-from: oklch(var(--p));
  --tw-gradient-to: oklch(var(--p) / 0);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.to-secondary {
  --tw-gradient-to: oklch(var(--s));
}
</style>