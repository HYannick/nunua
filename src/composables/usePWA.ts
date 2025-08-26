import { registerSW } from 'virtual:pwa-register'
import { ref } from 'vue'

export function usePWA() {
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const updateAvailable = ref(false)

  const updateSW = registerSW({
    onNeedRefresh() {
      needRefresh.value = true
      updateAvailable.value = true
    },
    onOfflineReady() {
      offlineReady.value = true
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  const closePrompt = () => {
    updateAvailable.value = false
    needRefresh.value = false
  }

  const updateApp = async () => {
    await updateSW(true)
  }

  return {
    needRefresh,
    offlineReady,
    updateAvailable,
    updateApp,
    closePrompt
  }
}