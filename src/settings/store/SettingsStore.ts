import {defineStore} from 'pinia';
import {computed, inject, ref} from 'vue';
import themes from 'daisyui/theme/object';
import type {CurrencyService} from '@/currency/CurrencyService.ts';
import type {Currency} from '@/currency/Currency.ts';

export const DARK_THEME = 'dark'

export const useSettingsStore = defineStore('settings', () => {
  const currentLanguage = ref(localStorage.getItem('language') || 'en-GB');
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
  const currentTheme = ref(localStorage.getItem('theme') || DARK_THEME);
  const currencyService = inject('currencyService') as CurrencyService;
  const currency = ref(localStorage.getItem('preferredCurrency') || 'EUR');
  const STORAGE_KEYS = {
    DEFAULT_CURRENCY: 'defaultCurrency',
    THEME: 'theme',
    LANGUAGE: 'language'
  } as const

  const preferredCurrency = computed(() => currencyService.findByCode(currency.value))

  async function setDefaultCurrency(currencyToSet: Currency): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.DEFAULT_CURRENCY, currencyToSet.code)
      currency.value = currencyToSet.code
    } catch (error) {
      throw new Error('Failed to save default currency')
    }
  }


  async function getTheme(): Promise<string> {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light'
      isDarkMode.value = theme === DARK_THEME
      document.documentElement.setAttribute('data-theme', theme)
      return theme;
    } catch (error) {
      console.error('Error getting theme:', error)
      return 'light'
    }
  }

  const updateThemeColor = (base: '--color-base-100' | '--color-base-200') => {
    let metaThemeColor: any = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    if(currentTheme.value === 'light') {
      metaThemeColor.content = base === '--color-base-100' ? 'oklch(98% 0.01 120)' : 'oklch(96% 0.02 120)'
    } else  if(currentTheme.value === 'dark') {
      metaThemeColor.content = base === '--color-base-100' ? 'oklch(15% 0.02 120)' : 'oklch(18% 0.03 120)'
    } else {
      metaThemeColor.content = themes[currentTheme.value][base];
    }
  }

  async function setTheme(theme: string): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme)
      isDarkMode.value = theme === DARK_THEME
    } catch (error) {
      console.error('Error setting theme:', error)
      throw new Error('Failed to save theme preference')
    }
  }

  async function setLanguage(language: string): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
      currentLanguage.value = language
    } catch (error) {
      console.error('Error setting language:', error)
      throw new Error('Failed to save language preference')
    }
  }

  return {
    currentLanguage,
    preferredCurrency,
    currentTheme,
    isDarkMode,
    setTheme,
    setLanguage,
    getTheme,
    updateThemeColor,
    setDefaultCurrency,
  }
});