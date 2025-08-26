import {storeToRefs} from 'pinia';
import {useSettingsStore} from '@/settings/store/SettingsStore.ts';

export const useCurrency = () => {
  const settingsStore = useSettingsStore();
  const {currentLanguage, preferredCurrency} = storeToRefs(settingsStore)

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat(currentLanguage.value, {
      style: 'currency',
      currency: preferredCurrency.value?.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(+amount)
  }

  return {
    formatCurrency
  }
}