import {useDrawerHistory} from '@/composables/useSidebarHistoryState.ts';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useFABAction = () => {

  const { isOpen: controlsOpen, open, close } = useDrawerHistory('controls')

  const toggleControls = () => {
    Haptics.impact({ style: ImpactStyle.Light })
    if (controlsOpen.value) {
      close()
    } else {
      open()
    }
  }

  const closeControls = (options?: {goBack?: boolean}) => {
    Haptics.impact({ style: ImpactStyle.Light })
    close(options?.goBack)
  }

  return {
    controlsOpen,
    toggleControls,
    closeControls
  }
}