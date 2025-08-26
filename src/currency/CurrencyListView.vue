<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Currency } from './Currency.ts'
import {CurrencyService} from '@/currency/CurrencyService.ts';
import BaseInput from '@/components/BaseInput.vue';

interface CurrencyTheme {
  titleClass?: string
  subtitleClass?: string
  symbolClass?: string
  flagSize?: string
  inputClass?: string
}

interface Props {
  favorites?: string[]
  currencyFilter?: string[]
  showFlag?: boolean
  showCurrencyName?: boolean
  showCurrencyCode?: boolean
  showSearchField?: boolean
  searchHint?: string
  theme?: CurrencyTheme
}

const props = withDefaults(defineProps<Props>(), {
  favorites: () => [],
  currencyFilter: () => [],
  showFlag: true,
  showCurrencyName: true,
  showCurrencyCode: true,
  showSearchField: true,
  searchHint: 'Search currencies...',
  theme: () => ({})
})

const emit = defineEmits<{
  select: [currency: Currency]
}>()

const currencyService = new CurrencyService()
const searchQuery = ref('')

const validateProps = () => {
  if (!props.showCurrencyName && !props.showCurrencyCode) {
    console.warn('CurrencyListView: Both showCurrencyName and showCurrencyCode cannot be false')
  }
}

const allCurrencies = computed(() => {
  let currencies = currencyService.getAll()

  if (props.currencyFilter.length > 0) {
    const filterSet = new Set(props.currencyFilter.map(code => code.toUpperCase()))
    currencies = currencies.filter(currency => filterSet.has(currency.code))
  }

  return currencies
})

const favoriteCurrencies = computed(() => {
  if (props.favorites.length === 0) return []
  return currencyService.findCurrenciesByCode(props.favorites)
})

const filteredCurrencies = computed(() => {
  if (!searchQuery.value.trim()) {
    return allCurrencies.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return allCurrencies.value.filter(currency =>
      currency.name.toLowerCase().includes(query) ||
      currency.code.toLowerCase().includes(query) ||
      currency.namePlural.toLowerCase().includes(query)
  )
})

const handleCurrencySelect = (currency: Currency) => {
  emit('select', currency)
}

const getFlagContent = (currency: Currency) => {
  if (!currency.flag) {
    return { type: 'image' as const, content: '/flags/no-flag.png' }
  }

  if (currency.isFlagImage) {
    return { type: 'image' as const, content: `/flags/${currency.flag}` }
  }

  return { type: 'emoji' as const, content: currencyToEmoji(currency) }
}

const currencyToEmoji = (currency: Currency): string => {
  if (!currency.flag || currency.isFlagImage) return '🏳️'

  const flagCode = currency.flag.toUpperCase()
  return flagCode.replace(/./g, char =>
      String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65)
  )
}

const themeClasses = computed(() => ({
  title: props.theme.titleClass || 'text-base font-medium text-base-content',
  subtitle: props.theme.subtitleClass || 'text-sm text-base-content/70',
  symbol: props.theme.symbolClass || 'text-lg font-semibold text-primary',
  input: props.theme.inputClass || 'input input-bordered w-full',
  flagSize: props.theme.flagSize || 'text-2xl'
}))

onMounted(() => {
  validateProps()
})

watch(() => [props.showCurrencyName, props.showCurrencyCode], () => {
  validateProps()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div v-if="showSearchField" class="p-4">
      <div class="form-control">
        <div class="input-group">
          <BaseInput
              v-model="searchQuery"
              type="text"
              :placeholder="searchHint"
              name="currency-search"
          >
            <template #icon>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </template>
          </BaseInput>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="favoriteCurrencies.length > 0">
        <div class="px-4 py-2">
          <h3 class="text-sm font-medium text-base-content/60 uppercase tracking-wide">
            Favorites
          </h3>
        </div>

        <div
            v-for="currency in favoriteCurrencies"
            :key="`fav-${currency.code}`"
            @click="handleCurrencySelect(currency)"
            class="flex items-center justify-between px-4 py-3 hover:bg-base-200 cursor-pointer transition-colors"
        >
          <div class="flex items-center gap-3">
            <div v-if="showFlag" class="flex-shrink-0">
              <img
                  v-if="getFlagContent(currency).type === 'image'"
                  :src="getFlagContent(currency).content"
                  :alt="currency.code"
                  class="w-7 h-5 object-cover rounded-sm"
              />
              <span
                  v-else
                  :class="themeClasses.flagSize"
                  v-text="getFlagContent(currency).content"
              />
            </div>

            <div class="flex flex-col">
              <span
                  v-if="showCurrencyCode"
                  :class="themeClasses.title"
                  v-text="currency.code"
              />
              <span
                  v-if="showCurrencyName"
                  :class="showCurrencyCode ? themeClasses.subtitle : themeClasses.title"
                  v-text="currency.name"
              />
            </div>
          </div>

          <span
              :class="themeClasses.symbol"
              v-text="currency.symbol"
          />
        </div>

        <div class="divider mx-4"></div>
      </div>

      <div>
        <div
            v-for="currency in filteredCurrencies"
            :key="currency.code"
            @click="handleCurrencySelect(currency)"
            class="flex items-center justify-between px-4 py-3 hover:bg-base-200 cursor-pointer transition-colors"
        >
          <div class="flex items-center gap-3">
            <div v-if="showFlag" class="flex-shrink-0">
              <img
                  v-if="getFlagContent(currency).type === 'image'"
                  :src="getFlagContent(currency).content"
                  :alt="currency.code"
                  class="w-7 h-5 object-cover rounded-sm"
              />
              <span
                  v-else
                  :class="themeClasses.flagSize"
                  v-text="getFlagContent(currency).content"
              />
            </div>

            <div class="flex flex-col">
              <span
                  v-if="showCurrencyCode"
                  :class="themeClasses.title"
                  v-text="currency.code"
              />
              <span
                  v-if="showCurrencyName"
                  :class="showCurrencyCode ? themeClasses.subtitle : themeClasses.title"
                  v-text="currency.name"
              />
            </div>
          </div>

          <span
              :class="themeClasses.symbol"
              v-text="currency.symbol"
          />
        </div>
      </div>

      <div
          v-if="filteredCurrencies.length === 0"
          class="flex flex-col items-center justify-center py-12 text-base-content/50"
      >
        <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.091-2.333m12.182 0A7.962 7.962 0 0112 15c2.34 0 4.467-.881 6.091-2.333M6 12a6 6 0 1112 0v.01M6 12C6 8.686 8.686 6 12 6s6 2.686 6 6v.01" />
        </svg>
        <p class="text-center">No currencies found</p>
        <p class="text-sm text-center mt-1">Try adjusting your search</p>
      </div>
    </div>
  </div>
</template>