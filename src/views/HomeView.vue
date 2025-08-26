<script setup lang="ts">
import BaseHeader from '@/components/BaseHeader.vue';
import {useUserStore} from '@/stores/userStore.ts';
import {storeToRefs} from 'pinia';
import {computed, inject, onMounted, ref, watch} from 'vue';
import BottomSheet from '@/components/BottomSheet.vue';
import {useDrawerHistory} from '@/composables/useSidebarHistoryState.ts';
import {triggerHaptics} from '@/utils/haptics.utils.ts';
import GroceryListForm from '@/grocery-list/compontents/GroceryListForm.vue';
import type {GroceryListToCreateDto} from '@/grocery-list/dtos/GroceryListToCreate.dto.ts';
import type {GroceryListService} from '@/grocery-list/infrastructure/GroceryListService.ts';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import ExpandableFAB from '@/components/ExpandableFAB.vue';
import {LucideArrowLeftSquare, LucideDownload, LucidePlus} from 'lucide-vue-next';
import GroceryJoinForm from '@/grocery-list/compontents/GroceryJoinForm.vue';
import {useI18n} from 'vue-i18n';
import GroceryItemList from '@/views/GroceryItemList.vue';
import GroceryItemListEmpty from '@/views/GroceryItemListEmpty.vue';
import {useRoute, useRouter} from 'vue-router';
import { DrawerRoot } from 'vaul-vue';

const groceryListService = inject('groceryListService') as GroceryListService
const userStore = useUserStore();
const {currentUser} = storeToRefs(userStore);
const groceryList = ref<GroceryList[]>([]);
const localGroceryList = ref<GroceryList[]>([]);
const {isOpen, open: openBottomSheet, close: closeBottomSheet} = useDrawerHistory('createList')
type SheetContext = 'create' | 'join';
const sheetContext = ref<SheetContext>('create');
const sharedListLoading = ref(false);
const localListLoading = ref(false);
const buttons = computed(() => [
  {
    icon: LucidePlus,
    label: 'buttons.fabCreateList',
    action: () => openSheet('create')
  },
  {
    icon: LucideArrowLeftSquare,
    label: 'buttons.fabJoinList',
    action: () => openSheet('join')
  }
]);

const route = useRoute()
onMounted(() => {
  if (route.query.createList) {
    closeBottomSheet();
  }
})

const openSheet = (context: SheetContext) => {
  sheetContext.value = context;
  triggerHaptics()
  openBottomSheet();
};
const {t} = useI18n();
const router = useRouter()
const {success, error} = useNotificationStore();
const joinList = async (code: string) => {
  try {
    await groceryListService.joinGroceryListByShareCode(code);
    success(t('notifications.joinList.success'));
    await groceryListService.getMyGroceryLists();
    router.replace({
      name: 'grocery-list',
      params: {shareCode: code}
    });
  } catch (err: any) {
    error(err.message);
    console.error(t('notifications.joinList.error'));
  }
};
const createList = async (list: GroceryListToCreateDto) => {
  try {
    const newList = await groceryListService.saveGroceryList(list);
    success(t('notifications.listCreation.success'));
    if (newList.status === 'local') {
      localGroceryList.value.push(newList);
      router.push({
        name: 'local-grocery-list',
        params: {id: newList.id}
      });
    } else {
      groceryList.value.push(newList);
      router.push({
        name: 'grocery-list',
        params: {shareCode: newList.shareCode}
      });
    }
  } catch (err: any) {
    error(t('notifications.listCreation.error'));
    console.error('Error creating grocery list:', err);
  }
};

enum TabEnum {
  MY_LISTS = 'my_lists',
  SHARED_LISTS = 'shared_lists'
}

const currentTab = ref<TabEnum>(TabEnum.MY_LISTS);
const setCurrentTab = (tab: TabEnum) => {
  currentTab.value = tab;
  triggerHaptics();
};

watch(() => currentTab.value, async (newTab) => {
  if (newTab === TabEnum.MY_LISTS) {
    if (localGroceryList.value.length === 0) {
      localListLoading.value = true;
      localGroceryList.value = await groceryListService.getLocalGroceryLists();
      localListLoading.value = false;
    }
  } else if (newTab === TabEnum.SHARED_LISTS) {
    if (groceryList.value.length === 0) {
      sharedListLoading.value = true;
      groceryList.value = await groceryListService.getMyGroceryLists();
      sharedListLoading.value = false;
    }
  }
}, {immediate: true});

</script>
<template>
  <DrawerRoot :open="isOpen" @close="closeBottomSheet">
    <div class="page">
      <div class="mx-auto">
        <BaseHeader :user="currentUser"/>
      </div>

      <div class="p-5 flex gap-5">
        <a role="tab" :class="`cursor-pointer text-2xl font-bold ${currentTab === TabEnum.MY_LISTS ? 'opacity-100': 'opacity-30'}`"
           @click="setCurrentTab(TabEnum.MY_LISTS)">{{ $t('personalListLabel') }}
        </a>
        <a role="tab" :class="`cursor-pointer text-2xl font-bold ${currentTab === TabEnum.SHARED_LISTS ? 'opacity-100': 'opacity-30'}`"
           @click="setCurrentTab(TabEnum.SHARED_LISTS)">{{ $t('sharedListLabel') }}
        </a>
      </div>
      <div v-if="currentTab === TabEnum.MY_LISTS" class="max-w-md mx-auto px-5">
        <GroceryItemList :grocery-list="localGroceryList" :loading="localListLoading">
          <template #emptyList>
            <GroceryItemListEmpty title="emptyData.noLocalList.title" description="emptyData.noLocalList.description" @click="openSheet('create')"
                                  :actions="[
            { label: 'buttons.createList', icon: LucidePlus, action: () => openSheet('create') },
          ]"/>
          </template>
        </GroceryItemList>
        <p class="text text-center mt-5 text-base-content/50">{{ $t('localListInfo') }}</p>
      </div>
      <div v-if="currentTab === TabEnum.SHARED_LISTS" class="max-w-md mx-auto px-5">
        <GroceryItemList :grocery-list="groceryList" :loading="sharedListLoading">
          <template #emptyList>
            <GroceryItemListEmpty title="emptyData.sharedList.title" description="emptyData.sharedList.description" :actions="[
            { label: 'buttons.createList', icon: LucidePlus, action: () => openSheet('create') },
            { label: 'buttons.joinList', icon: LucideArrowLeftSquare, action: () => openSheet('join') }
          ]"/>
          </template>
        </GroceryItemList>

      </div>
      <ExpandableFAB :buttons="buttons"/>
      <BottomSheet @close="closeBottomSheet">
        <GroceryListForm v-if="sheetContext === 'create'" @submit="createList" @close="closeBottomSheet" :username="currentUser!.username"/>
        <GroceryJoinForm v-if="sheetContext === 'join'" @submit="joinList" @close="closeBottomSheet"/>
      </BottomSheet>
    </div>
  </DrawerRoot>
</template>