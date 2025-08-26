import {createApp} from 'vue'
import {App as CapacitorApp} from '@capacitor/app';
import './style.css'
import App from './App.vue'
import {router} from './router.ts';
import {UserService} from '@/user/services/UserService.ts';
import {createPinia} from 'pinia';
import {createI18n} from 'vue-i18n';
import frFR from '@/locales/fr-FR.ts';
import enGB from '@/locales/en-GB.ts';
import deDE from '@/locales/de-DE.ts';
import {SettingsService} from '@/settings/services/SettingsService.ts';
import {useSettingsStore} from '@/settings/store/SettingsStore.ts';
import {GroceryListService} from '@/grocery-list/infrastructure/GroceryListService.ts';
import {databases} from '@/appwriteService.ts';
import {initializeDatabase} from '@/databaseService.ts';
import {LoyaltyCardService} from '@/loyalty-card/LoyaltyCardService.ts';
import {CurrencyService} from '@/currency/CurrencyService.ts';

const pinia = createPinia();

const databaseService = await initializeDatabase();
const groceryListService = new GroceryListService(databaseService, databases);
const userService = new UserService();
const currencyService = new CurrencyService();
const settingsService = new SettingsService();
const loyaltyCardService = new LoyaltyCardService(databaseService);

const i18n = createI18n({
  allowComposition: true,
  langDir: './locales',
  locale: localStorage.getItem('language') || 'en-GB',
  fallbackLocale: 'en',
  messages: {
    en: enGB,
    fr: frFR,
    de: deDE
  }
})

const CURRENT_VERSION = '1.0.1'
const STORED_VERSION = localStorage.getItem('app-version')

if (STORED_VERSION !== CURRENT_VERSION) {
  console.log('App version changed, cleaning service workers...')

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister()
        console.log('Unregistered old SW:', registration.scope)
      })
    })

    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName)
          console.log('Deleted old cache:', cacheName)
        })
      })
    }
  }

  localStorage.setItem('app-version', CURRENT_VERSION)
}

let backButtonListener: any = null

const setupBackButtonHandler = async () => {
  try {
    backButtonListener = await CapacitorApp.addListener('backButton', (event) => {
      const currentRoute = router.currentRoute.value.path
      const rootRoutes = ['/']

      if (event.canGoBack && !rootRoutes.includes(currentRoute)) {
        router.go(-1)
      } else {
        const shouldExit = confirm('Exit app?')
        if (shouldExit) {
          CapacitorApp.exitApp()
        }
      }
    })

    console.log('✅ Global back button handler registered')
  } catch (error) {
    console.error('❌ Failed to register back button handler:', error)
  }
}

createApp(App)
  .use(i18n)
  .use(pinia)
  .use(router)
  .provide('databaseService', databaseService)
  .provide('currencyService', currencyService)
  .provide('loyaltyCardService', loyaltyCardService)
  .provide('groceryListService', groceryListService)
  .provide('userService', userService)
  .provide('settingsService', settingsService)
  .mount('#app');

const settingsStore = useSettingsStore();
settingsStore.getTheme();

setupBackButtonHandler()

window.addEventListener('beforeunload', async () => {
  if (backButtonListener) {
    await backButtonListener.remove()
  }
})