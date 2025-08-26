<template>
  <div v-if="loading" class="p-5 text-center">
    <span class="loading loading-ball loading-xl"></span>
  </div>
  <div v-else-if="!groceryListDetails" class="p-5">
    <OnboardingSlide
        title="joinOnboarding.notFound.title"
        description="joinOnboarding.notFound.description"
        :illustration="WelcomeIllustration" />
  </div>
  <div v-else-if="userAlreadyJoinedList" class="p-5 text-center">
    <OnboardingSlide
        title="joinOnboarding.alreadyJoined.title"
        description="joinOnboarding.alreadyJoined.description"
        :illustration="WelcomeIllustration" />
  </div>
  <div v-else class="text-center p-5">
    <OnboardingSlide
        title="joinOnboarding.confirm.title"
        description="joinOnboarding.confirm.description"
        :illustration="WelcomeIllustration" />
  </div>
</template>
<script setup lang="ts">
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import {WelcomeIllustration} from '@/illustrations.ts';
import {inject, onMounted, ref} from 'vue';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import type {GroceryListService} from '@/grocery-list/infrastructure/GroceryListService.ts';

const props = defineProps<{
  shareCode: string;
}>();
const groceryListDetails = ref<GroceryList | null>(null)
const groceryListService = inject('groceryListService') as GroceryListService
const loading = ref(true)
const userAlreadyJoinedList = ref(false)
const emit = defineEmits<{
  (e: 'result', status: JoinStatusEnum): void;
}>()
enum JoinStatusEnum {
  AlreadyJoined = 'alreadyJoined',
  Error = 'error',
  ListFound = 'listFound',
  Idle = 'idle'
}
onMounted(async () => {
  if (!props.shareCode) {
    loading.value = false;
    return;
  }
  try {
    groceryListDetails.value = await groceryListService.getGroceryListByShareCode(props.shareCode);
    emit('result', groceryListDetails.value ? JoinStatusEnum.ListFound : JoinStatusEnum.Error);
    if (!groceryListDetails.value) {
      loading.value = false
      return
    }
    userAlreadyJoinedList.value = await groceryListService.hasSavedList(groceryListDetails.value.id);
    if(userAlreadyJoinedList.value) {
      emit('result', JoinStatusEnum.AlreadyJoined)
    }
    loading.value = false
  } catch (e) {
    loading.value = false
    emit('result', JoinStatusEnum.Error)
  }
})
</script>