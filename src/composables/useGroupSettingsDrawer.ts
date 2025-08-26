// useGroupSettingsDrawer.ts
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import {useDrawerHistory} from '@/composables/useSidebarHistoryState.ts';

export const useGroupSettingsDrawer = () => {
  const { isOpen: groupSettingsOpen, open, close } = useDrawerHistory('groupSettings')

  const toggleGroupSettings = () => {
    Haptics.impact({ style: ImpactStyle.Light })
    if (groupSettingsOpen.value) {
      close()
    } else {
      open()
    }
  }

  const closeGroupSettings = () => {
    Haptics.impact({ style: ImpactStyle.Light })
    close()
  }

  return {
    groupSettingsOpen,
    toggleGroupSettings,
    closeGroupSettings
  }
}