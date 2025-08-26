import {createWebHistory, createRouter} from 'vue-router'
import HomeView from './views/HomeView.vue'
import OnboardingView from '@/views/OnboardingView.vue';
import SettingsView from '@/settings/views/SettingsView.vue';
import LanguageSettingView from '@/settings/views/LanguageSettingView.vue';
import ThemeSettingsView from '@/settings/views/ThemeSettingsView.vue';
import {useSettingsStore} from '@/settings/store/SettingsStore.ts';
import CustomThemeSettingsView from '@/settings/views/CustomThemeSettingsView.vue';
import GroceryListView from '@/views/GroceryListView.vue';
import {initializeDatabase} from '@/databaseService.ts';
import LoyaltyCardView from '@/loyalty-card/views/LoyaltyCardView.vue';
import CreateLoyaltyCardStep1 from '@/loyalty-card/views/CreateLoyaltyCardStep1.vue';
import CreateLoyaltyCardStep2 from '@/loyalty-card/views/CreateLoyaltyCardStep2.vue';
import CurrencySettingView from '@/settings/views/CurrencySettingView.vue';
import JoinGroceryListView from '@/views/JoinGroceryListView.vue';
import OnboardingJoinListView from '@/views/OnboardingJoinListView.vue';

const databaseService = await initializeDatabase();
function isUserAuthenticated(): boolean {
  try {
    const user = localStorage.getItem('user')
    if (!user) return false

    const userData = JSON.parse(user)
    return !!(userData?.username && userData?.id)
  } catch {
    return false
  }
}

function getCurrentUser() {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const routes = [
  {
    path: '/onboarding',
    name: 'onboarding',
    component: OnboardingView,
    meta: {requiresAuth: false, isPublic: true}
  },
  {
    path: '/join-onboarding',
    name: 'join-onboarding',
    component: OnboardingJoinListView,
    meta: {requiresAuth: false, isPublic: true}
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {requiresAuth: true, isPublic: false}

  },
  {
    path: '/loyalty-cards/',
    name: 'loyalty-cards',
    component: LoyaltyCardView,
    meta: {requiresAuth: true, isPublic: false}
  },
  {
    path: '/loyalty-cards/create/step1',
    name: 'create-loyalty-card-step1',
    component: CreateLoyaltyCardStep1,
    meta: {requiresAuth: true, isPublic: false}
  },
  {
    path: '/loyalty-cards/create/step2',
    name: 'create-loyalty-card-step2',
    component: CreateLoyaltyCardStep2,
    meta: {requiresAuth: true, isPublic: false},
    props: true
  },
  {
    path: '/grocery-list/:shareCode',
    name: 'grocery-list',
    component: GroceryListView,
    meta: {requiresAuth: true, isPublic: false, requireAuthorization: true},
    props: () => {
      return {
        isOnline: true
      }
    }
  },
  {
    path: '/grocery-list/local/:id',
    name: 'local-grocery-list',
    component: GroceryListView,
    meta: {requiresAuth: true, isPublic: false},
    props: () => {
      return {
        isOnline: false
      }
    }
  },
  {
    path: '/settings/home',
    name: 'settings',
    component: SettingsView,
    meta: {requiresAuth: true}

  },
  {
    path: '/join/:shareCode',
    name: 'join',
    component: JoinGroceryListView,
    props: true,
    meta: {requiresAuth: true, isPublic: false}
  },
  {
    path: '/settings/home/language',
    name: 'language-settings',
    component: LanguageSettingView,
    meta: {requiresAuth: true}

  },
  {
    path: '/settings/home/settings',
    name: 'currency-settings',
    component: CurrencySettingView,
    meta: {requiresAuth: true}
  },
  {
    path: '/settings/home/themes',
    name: 'themes-settings',
    component: ThemeSettingsView,
    meta: {requiresAuth: true}

  },
  {
    path: '/settings/home/themes/custom',
    name: 'custom-theme-settings',
    component: CustomThemeSettingsView,
    meta: {requiresAuth: true}
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => {
    return {top: 0}
  },
  routes,
})

router.beforeEach(async (to, _, next) => {
  const isAuthenticated = isUserAuthenticated()
  const requireAuthorization = to.meta.requireAuthorization
  const requiresAuth = to.meta.requiresAuth
  const isPublicRoute = to.meta.isPublic

  if (isPublicRoute) {
    console.log('public')
    next()
    return
  }

  if(isAuthenticated && requireAuthorization) {
    const listExist = await databaseService.db.savedLists.where('shareCode').equals(to.params.shareCode as string).count() > 0
    if(!listExist) {
      next('/')
      return
    }
    next()
  }


  if(requiresAuth && !isAuthenticated && to.name === 'join') {
    next('/join-onboarding?shareCode=' + to.params.shareCode)
  }

  if (requiresAuth && !isAuthenticated) {
    console.log('Redirecting to onboarding - user not authenticated')
    next('/onboarding')
    return
  }

  if (isAuthenticated && to.name === 'onboarding') {
    console.log('Redirecting to home - user already authenticated')
    next('/')
    return
  }


  next()
})

router.beforeResolve((to, _, next) => {
  if (isUserAuthenticated()) {
    to.meta.user = getCurrentUser()
  }
  next()
})

router.beforeEach((to, _, next) => {
  const settingsStore = useSettingsStore()
  const isColorBase100Page = [
    'onboarding',
    'home',
    'grocery-list',
    'local-grocery-list',
    'welcome-pro'
    ]
    .includes(to.name as string)

  const isColorBase200Page = ['settings', 'language-settings', 'currency-settings', 'themes-settings', 'backup-settings'].includes(to.name as string)

  if(isColorBase100Page) {
    settingsStore.updateThemeColor('--color-base-100');
  } else if(isColorBase200Page) {
    settingsStore.updateThemeColor('--color-base-200');
  }
  next();
})