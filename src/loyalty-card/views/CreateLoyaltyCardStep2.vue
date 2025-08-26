<script lang="ts" setup="">
import {inject, onMounted, ref} from 'vue';
import FloatingActionButton from '@/components/FloatingActionButton.vue';
import {useRoute, useRouter} from 'vue-router';
import BaseInput from '@/components/BaseInput.vue';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import BaseHeading from '@/components/BaseHeading.vue';
import type {LoyaltyCardService} from '@/loyalty-card/LoyaltyCardService.ts';
import type {CreateLoyaltyCardDto} from '@/loyalty-card/dtos/CreateLoyaltyCardDto.ts';

const route = useRoute();
const router = useRouter();
const cardForm = ref<CreateLoyaltyCardDto>({
  name: '',
  code: '',
  styles: {
    bgColor: 'bg-primary/20',
    textColor: 'text-primary',
    bgDecoration: 'bg-primary/20',
  }
})

const loyaltyCardService = inject('loyaltyCardService') as LoyaltyCardService;

const bgColorList = [
  {
    bgColor: 'bg-primary/20',
    textColor: 'text-primary',
    bgDecoration: 'bg-primary/20',
  },
  {
    bgColor: 'bg-pink-200',
    textColor: 'text-pink-800',
    bgDecoration: 'bg-pink-800/20',
  },
  {
    bgColor: 'bg-red-200',
    textColor: 'text-red-800',
    bgDecoration: 'bg-red-800/20',
  },
  {
    bgColor: 'bg-yellow-200',
    textColor: 'text-yellow-800',
    bgDecoration: 'bg-yellow-800/20',
  },
  {
    bgColor: 'bg-green-200',
    textColor: 'text-green-800',
    bgDecoration: 'bg-green-800/20',
  },
  {
    bgColor: 'bg-blue-200',
    textColor: 'text-blue-800',
    bgDecoration: 'bg-blue-800/20',
  },
  {
    bgColor: 'bg-indigo-200',
    textColor: 'text-indigo-800',
    bgDecoration: 'bg-indigo-800/20',
  },
  {
    bgColor: 'bg-purple-200',
    textColor: 'text-purple-800',
    bgDecoration: 'bg-purple-800/20',
  },
  {
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-800',
    bgDecoration: 'bg-gray-800/20',
  },
  {
    bgColor: 'bg-teal-200',
    textColor: 'text-teal-800',
    bgDecoration: 'bg-teal-800/20',
  },
  {
    bgColor: 'bg-cyan-200',
    textColor: 'text-cyan-800',
    bgDecoration: 'bg-cyan-800/20',
  },
  {
    bgColor: 'bg-amber-200',
    textColor: 'text-amber-800',
    bgDecoration: 'bg-amber-800/20',
  },
  {
    bgColor: 'bg-lime-200',
    textColor: 'text-lime-800',
    bgDecoration: 'bg-lime-800/20',
  },
  {
    bgColor: 'bg-emerald-200',
    textColor: 'text-emerald-800',
    bgDecoration: 'bg-emerald-800/20',
  },
  {
    bgColor: 'bg-fuchsia-200',
    textColor: 'text-fuchsia-800',
    bgDecoration: 'bg-fuchsia-800/20',
  },
  {
    bgColor: 'bg-violet-200',
    textColor: 'text-violet-800',
    bgDecoration: 'bg-violet-800/20',
  },
  {
    bgColor: 'bg-rose-200',
    textColor: 'text-rose-800',
    bgDecoration: 'bg-rose-800/20',
  },
  {
    bgColor: 'bg-sky-200',
    textColor: 'text-sky-800',
    bgDecoration: 'bg-sky-800/20',
  },
  {
    bgColor: 'bg-amber-400',
    textColor: 'text-amber-800',
    bgDecoration: 'bg-amber-800/20',
  },
  {
    bgColor: 'bg-orange-200',
    textColor: 'text-orange-800',
    bgDecoration: 'bg-orange-800/20',
  },
];

onMounted(() => {
  if (route.query.loyaltyCode) {
    cardForm.value.code = route.query.loyaltyCode as string;
  }
});
const {error, success} = useNotificationStore()
const createCard = () => {
  if (!cardForm.value.name.trim() || !cardForm.value.code.trim()) {
    error('Please fill in all required fields.');
    return;
  }
  loyaltyCardService.saveLoyaltyCard(cardForm.value)

  cardForm.value.name = '';
  cardForm.value.code = '';
  router.replace({ name: 'loyalty-cards' });
  success('Loyalty card created successfully!');
};
</script>
<template>
  <div class="page">
    <BaseHeading title="loyaltyCards.step2.title"/>
    <form class="px-5 space-y-4" @submit.prevent="createCard">
      <p>{{$t('loyaltyCards.step2.description')}}</p>
      <BaseInput name="cardName" v-model="cardForm.name" placeholder="loyaltyCards.step2.cardNameLabel" required/>
      <BaseInput v-if="!route.query.loyaltyCode" name="cardCode" v-model="cardForm.code" placeholder="loyaltyCards.step2.cardNumberLabel" required />

      <div class="max-w-96 w-full h-44 rounded-3xl" :class="cardForm.styles.bgColor">
        <div class="pt-8">
          <div class="w-full h-5 bg-base-content"></div>
        </div>
        <div class="p-5">
          <p class="font-bold">{{cardForm.name || $t('loyaltyCards.step2.cardNamePlaceholder')}}</p>
          <p>N° {{cardForm.code}}</p>
        </div>
        <div class="flex items-end justify-end gap-2 px-5">
          <div class="rounded-2xl w-10 h-5" :class="cardForm.styles.bgDecoration"></div>
          <div class="rounded-2xl w-20 h-5" :class="cardForm.styles.bgDecoration"></div>
        </div>
      </div>

      <p>{{$t('loyaltyCards.step2.backgroundSelection')}}</p>
      <div class="carousel carousel-center bg-transparent rounded-box w-full space-x-4 p-4">
        <div class="carousel-item" v-for="(color, index) in bgColorList" :key="index" @click="cardForm.styles = color">
          <div class="w-10 h-10 rounded-full flex transition-transform" :class="{
            [color.bgColor]: true,
            'border-2 border-base-content scale-[0.90]': cardForm.styles.bgColor === color.bgColor
          }"></div>
        </div>
      </div>
      <FloatingActionButton label="loyaltyCards.step2.saveButton" type="submit"  :disabled="!cardForm.code || !cardForm.name" class="mt-5"/>
    </form>
  </div>
</template>