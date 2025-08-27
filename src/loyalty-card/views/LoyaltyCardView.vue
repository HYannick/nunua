<script setup lang="ts">
import BaseFAB from '@/components/BaseFAB.vue';
import {useRouter} from 'vue-router';
import BaseHeading from '@/components/BaseHeading.vue';
import type {LoyaltyCardService} from '@/loyalty-card/LoyaltyCardService.ts';
import {inject, onMounted, ref} from 'vue';
import type {LoyaltyCard} from '@/loyalty-card/domain/LoyaltyCard.ts';
import {DrawerRoot} from 'vaul-vue';
import BottomSheet from '@/components/BottomSheet.vue';
import VueBarcode from '@chenfengyuan/vue-barcode';
import {useDrawerHistory} from '@/composables/useSidebarHistoryState.ts';
import {triggerHaptics} from '@/utils/haptics.utils.ts';
import {LucideTrash2} from 'lucide-vue-next';
import {EmptyCardsIllustration} from '@/illustrations.ts';
import BaseButton from '@/components/BaseButton.vue';
import EmptyContainerIllustration from '@/views/EmptyContainerIllustration.vue';

const router = useRouter();
const loyaltyCardService = inject('loyaltyCardService') as LoyaltyCardService;
const {isOpen, open: openBottomSheet, close: closeBottomSheet} = useDrawerHistory('viewLoyaltyCard');
const navigateToAddCard = () => {
  router.push({name: 'create-loyalty-card-step1'});
};
const cards = ref<LoyaltyCard[]>([]);
onMounted(async () => {
  cards.value = await loyaltyCardService.getAllLoyaltyCards();
})

const currentCard = ref<LoyaltyCard | null>(null);
const selectCard = (card: LoyaltyCard) => {
  triggerHaptics();
  currentCard.value = card;
  openBottomSheet();
};

const closeCardBottomSheet = () => {
  currentCard.value = null;
  closeBottomSheet();
};

const deleteCard = async (cardId: string) => {
  triggerHaptics();
  await loyaltyCardService.deleteLoyaltyCard(cardId);
  cards.value = cards.value.filter(card => card.id !== cardId);
};

</script>
<template>
  <DrawerRoot :open="isOpen" @close="closeCardBottomSheet">
    <div class="page">
      <BaseHeading title="loyaltyCards.list.title"/>
      <div class="flex flex-col items-center justify-center h-full p-5">
        <p>{{ $t('loyaltyCards.list.description') }}</p>
      </div>
      <div>
        <div v-if="cards.length === 0" class="p-5">
          <EmptyContainerIllustration title="loyaltyCards.noCards.title"
                                      description="loyaltyCards.noCards.description"
                                      :illustration="EmptyCardsIllustration">
            <template #actions>
              <BaseButton label="loyaltyCards.noCards.addCardButton" class="mt-5" btnColorClass="btn-secondary text-base-100"
                          @click="navigateToAddCard"/>
            </template>
          </EmptyContainerIllustration>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
          <div v-for="card in cards" :key="card.id" class="max-w-96 w-full h-32 rounded-3xl relative" :class="card.styles.bgColor"
               @click="selectCard(card)">
            <button @click.stop="deleteCard(card.id)" class="btn btn-ghost btn-circle absolute right-2 top-2">
              <LucideTrash2 class="w-6 h-6 text-base-content/70 hover:text-base-content"/>
            </button>
            <div class="p-5">
              <p class="font-bold">{{ card.name || $t('loyaltyCards.step2.cardNamePlaceholder') }}</p>
              <p>N° {{ card.code }}</p>
            </div>
            <div class="flex items-end justify-end gap-2 px-5">
              <div class="rounded-2xl w-10 h-5" :class="card.styles.bgDecoration"></div>
              <div class="rounded-2xl w-20 h-5" :class="card.styles.bgDecoration"></div>
            </div>
          </div>
        </div>
      </div>
      <BaseFAB @click="navigateToAddCard"/>
      <BottomSheet @close="closeCardBottomSheet">
        <div v-if="currentCard" class="p-5 text-center">
          <p>{{ currentCard.name }}</p>
          <VueBarcode v-if='currentCard.code' :value="currentCard.code" class="mx-auto"/>
        </div>
      </BottomSheet>
    </div>
  </DrawerRoot>
</template>

<style scoped>

</style>