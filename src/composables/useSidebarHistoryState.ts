import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export function useDrawerHistory(drawerName: string) {
  const router = useRouter()
  const route = useRoute()
  const isOpen = ref(false)

  let popstateHandler: (() => void) | null = null
  let navigationFromDrawer = false // Track if navigation happened from drawer

  // Watch for route changes and auto-close drawer
  watch(() => route.path, (newPath, oldPath) => {
    if (newPath !== oldPath && isOpen.value) {
      console.log(`Route changed from ${oldPath} to ${newPath}, closing drawer: ${drawerName}`)

      // Mark that navigation happened from drawer
      navigationFromDrawer = true

      // Route changed, close drawer immediately
      isOpen.value = false

      // Remove listener
      if (popstateHandler) {
        window.removeEventListener('popstate', popstateHandler)
        popstateHandler = null
      }
    }
  })

  const open = async () => {
    if (isOpen.value) return

    console.log(`Opening drawer: ${drawerName}`)
    isOpen.value = true
    navigationFromDrawer = false // Reset flag

    // Push drawer state to history
    const newQuery = { ...route.query, [drawerName]: 'open' }
    await router.push({ path: route.path, query: newQuery })

    // Add popstate listener
    popstateHandler = () => handlePopstate()
    window.addEventListener('popstate', popstateHandler)
  }

  const close = (goBack: boolean = true) => {
    if (!isOpen.value) return

    console.log(`Closing drawer: ${drawerName}`)
    isOpen.value = false
    navigationFromDrawer = false

    // Remove popstate listener
    if (popstateHandler) {
      window.removeEventListener('popstate', popstateHandler)
      popstateHandler = null
    }

    // Go back in history
    if(goBack) {
      window.history.back()
    }
  }

  const handlePopstate = () => {
    // Check if drawer query param is still present
    const currentUrl = new URL(window.location.href)
    const drawerQuery = currentUrl.searchParams.get(drawerName)

    console.log(`Popstate event - drawer query: ${drawerQuery}, isOpen: ${isOpen.value}, navigationFromDrawer: ${navigationFromDrawer}`)

    if (drawerQuery === 'open') {
      // We're back to a URL with drawer=open
      if (navigationFromDrawer) {
        // This is a back navigation after navigating from drawer
        // Don't reopen the drawer, instead clean the URL
        console.log(`Cleaning drawer query param after navigation from drawer`)

        const newQuery = { ...route.query }
        delete newQuery[drawerName]

        router.replace({ path: route.path, query: newQuery })
        return
      } else {
        // Normal back navigation - reopen drawer
        console.log(`Reopening drawer ${drawerName} via back navigation`)
        isOpen.value = true
        return
      }
    }

    if (!drawerQuery && isOpen.value) {
      // Drawer was closed via back button
      console.log(`Drawer ${drawerName} closed via back button`)
      isOpen.value = false

      // Remove listener since drawer is closed
      if (popstateHandler) {
        window.removeEventListener('popstate', popstateHandler)
        popstateHandler = null
      }
    }
  }

  // Initialize state from URL on mount
  onMounted(() => {
    const drawerQuery = route.query[drawerName]

    // Only open drawer if query param is present AND we haven't navigated from drawer
    if (drawerQuery === 'open' && !navigationFromDrawer) {
      console.log(`Initializing drawer ${drawerName} as open from URL`)
      isOpen.value = true
      popstateHandler = () => handlePopstate()
      window.addEventListener('popstate', popstateHandler)
    } else if (drawerQuery === 'open' && navigationFromDrawer) {
      // Clean up the URL if we have the query param but navigated from drawer
      console.log(`Cleaning up drawer query param on mount`)
      const newQuery = { ...route.query }
      delete newQuery[drawerName]
      router.replace({ path: route.path, query: newQuery })
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (popstateHandler) {
      window.removeEventListener('popstate', popstateHandler)
    }
  })

  return {
    isOpen,
    open,
    close
  }
}