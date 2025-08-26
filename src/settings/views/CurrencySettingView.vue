<script setup lang="ts">
import CurrencyListView from '@/currency/CurrencyListView.vue';
import type {Currency} from '@/currency/Currency.ts';
import {useRouter} from 'vue-router';
import BaseHeroHeading from '@/components/BaseHeroHeading.vue';
import {useSettingsStore} from '@/settings/store/SettingsStore.ts';

const settingsStore = useSettingsStore()
const router = useRouter()
const handleSelect = (currency: Currency) => {
  settingsStore.setDefaultCurrency(currency);
  router.back()
}
</script>
<template>
  <div class="page">
    <BaseHeroHeading title="settings.currency.title" />
    <CurrencyListView
        @select="handleSelect($event)"
    />
  </div>

</template>

<style scoped>

</style>