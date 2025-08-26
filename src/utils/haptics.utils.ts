import {Haptics, ImpactStyle} from '@capacitor/haptics';

export const triggerHaptics = () => Haptics.impact({ style: ImpactStyle.Light })

