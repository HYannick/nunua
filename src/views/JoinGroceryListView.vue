<script lang="ts" setup="">

import FloatingActionButton from '@/components/FloatingActionButton.vue';
import {inject, onMounted, ref} from 'vue';
import type {GroceryListService} from '@/grocery-list/infrastructure/GroceryListService.ts';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import {useRouter} from 'vue-router';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import {useI18n} from 'vue-i18n';
import {WelcomeIllustration} from '@/illustrations.ts';
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import BaseHeading from '@/components/BaseHeading.vue';

const props = defineProps<
    {
      shareCode: string
    }>()
const groceryListService = inject('groceryListService') as GroceryListService
const groceryListDetails = ref<GroceryList | null>(null)
const loading = ref(true)
const userAlreadyJoinedList = ref(false)
onMounted(async () => {
  console.log('Share Code:', props.shareCode);
  try {
    groceryListDetails.value = await groceryListService.getGroceryListByShareCode(props.shareCode);
    if (!groceryListDetails.value) {
      loading.value = false
      return
    }
    userAlreadyJoinedList.value = await groceryListService.hasSavedList(groceryListDetails.value.id);
    loading.value = false
  } catch (e) {
    loading.value = false
  }
})

const router = useRouter()
const {t} = useI18n()
const {success, error} = useNotificationStore()

const joinList = async () => {
  if (!groceryListDetails.value) {
    return
  }
  if(userAlreadyJoinedList.value) {
    router.replace({
      name: 'grocery-list',
      params: {shareCode: groceryListDetails.value.shareCode}
    });
    return;
  }
  try {
    await groceryListService.joinGroceryListByShareCode(groceryListDetails.value.shareCode);
    success(t('notifications.joinList.success'));
    await groceryListService.getMyGroceryLists();
    router.replace({
      name: 'grocery-list',
      params: {shareCode: groceryListDetails.value.shareCode}
    });
  } catch (err: any) {
    error(err.message);
    console.error(t('notifications.joinList.error'));
  }
}
</script>
<template>
  <div class="page">
    <BaseHeading title="externalJoinList.title" back-url="/" replace/>
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
          title="externalJoinList.title"
          :description="$t('externalJoinList.description', {
            listName: groceryListDetails.name,
            inviterName: groceryListDetails.createdBy
          })"
          :illustration="WelcomeIllustration" />
    </div>
    <FloatingActionButton v-if="!userAlreadyJoinedList" label="buttons.join" type="button" @click="joinList"/>
    <FloatingActionButton v-else label="buttons.viewList" type="button" @click="joinList"/>
  </div>
</template>