<script setup lang="ts">

import {inject, onMounted, onUnmounted, ref} from 'vue';
import {LucideEllipsisVertical} from 'lucide-vue-next';
import BaseHeading from '@/components/BaseHeading.vue';
import type {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';
import type {GroceryListService} from '@/grocery-list/infrastructure/GroceryListService.ts';
import {useRoute} from 'vue-router';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import {useUserStore} from '@/stores/userStore.ts';
import {storeToRefs} from 'pinia';
import {client} from '@/appwriteService.ts';
import {appwriteDatabaseId, appwriteGroceryItemCollectionId} from '@/appwrite.constants.ts';
import GroceryListDrawer from '@/views/GroceryListDrawer.vue';
import {useGroupSettingsDrawer} from '@/composables/useGroupSettingsDrawer.ts';
import type {GroceryItemToCreateDto} from '@/grocery-list/dtos/GroceryItemToCreate.dto.ts';
import GroceryItemForm from '@/grocery-list/compontents/GroceryItemForm.vue';
import GroceryItemCard from '@/grocery-list/compontents/GroceryItemCard.vue';
import {useDrawerHistory} from '@/composables/useSidebarHistoryState.ts';
import {triggerHaptics} from '@/utils/haptics.utils.ts';
import BottomSheet from '@/components/BottomSheet.vue';
import {DrawerRoot} from 'vaul-vue';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import EditGroceryItemForm from '@/views/EditGroceryItemForm.vue';
import BudgetInfo from '@/views/BudgetInfo.vue';
import BudgetSetterModal from '@/views/BudgetSetterModal.vue';

const props = defineProps<{
  isOnline: boolean
}>()

const {success, error} = useNotificationStore()
const listItems = ref<GroceryItem[]>([]);
const groceryList = ref<GroceryList | null>();
const route = useRoute()
const userStore = useUserStore()
const {currentUser} = storeToRefs(userStore);
const groceryListService = inject('groceryListService') as GroceryListService;
const unsubscribe = ref<any>();
const loading = ref(false);

const snapPoints = ['150px', 0.9]
const snap = ref<number | string>(snapPoints[0])


const {toggleGroupSettings, groupSettingsOpen, closeGroupSettings} = useGroupSettingsDrawer();
const {isOpen, open: openBottomSheet, close: closeBottomSheet} = useDrawerHistory('editGroceryItem');

const currentItem = ref<GroceryItem | null>(null);

const headingActions = [{
  icon: LucideEllipsisVertical,
  onClick: toggleGroupSettings
}]

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
})

const refreshListDetails = async () => {
  loading.value = true;
  try {
    if (props.isOnline) {
      groceryList.value = await groceryListService.getGroceryListByShareCode(route.params.shareCode as string);
    } else {
      groceryList.value = await groceryListService.getLocalGroceryListById(route.params.id as string);
      listItems.value = groceryList.value?.items || [];
    }
  } catch (error) {
    console.error('Error refreshing list details:', error);
  } finally {
    loading.value = false;
  }
}


onMounted(async () => {
  if (props.isOnline) {
    loading.value = true;
    groceryList.value = await groceryListService.getGroceryListByShareCode(route.params.shareCode as string);
    if (groceryList.value) {
      listItems.value = groceryList.value.items || [];
    } else {
      console.error('Grocery list not found');
      return;
    }

    unsubscribe.value = client.subscribe(
        `databases.${appwriteDatabaseId}.collections.${appwriteGroceryItemCollectionId}.documents`,
        (response) => {
          if (!groceryList.value) return;
          if ((response.payload as any).listId === groceryList.value.id) {
            const isUpdate = response.events.includes('databases.*.collections.*.documents.*.update')
            if (isUpdate) {
              const updatedItem = response.payload as GroceryItem;
              const index = listItems.value.findIndex(item => item.id === updatedItem.id);
              if (index !== -1) {
                listItems.value[index] = updatedItem;
              }
            } else if (response.events.includes('databases.*.collections.*.documents.*.create')) {
              const newItem = response.payload as GroceryItem;
              listItems.value.push(newItem);
            } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
              const deletedItemId = (response.payload as any).$id;
              listItems.value = listItems.value.filter(item => item.id !== deletedItemId);
            }
          }
        }
    );
    loading.value = false;
  } else {
    loading.value = true;
    groceryList.value = await groceryListService.getLocalGroceryListById(route.params.id as string);
    if (groceryList.value) {
      listItems.value = groceryList.value.items || [];
    } else {
      console.error('Local grocery list not found');
      return;
    }
    loading.value = false;
  }
});

const addItem = async (listItem: GroceryItemToCreateDto) => {
  const newItem = await groceryListService.createGroceryItem(listItem, props.isOnline);
  if (!props.isOnline) {
    listItems.value.push(newItem)
  }
};

const checkItem = async (checked: boolean, id: string) => {
  if (!groceryList.value) return;
  await groceryListService.checkGroceryItem(
      id,
      checked,
      props.isOnline,
  );
}

const deleteItem = async (id: string) => {
  await groceryListService.deleteGroceryItem(id, props.isOnline)
  if (!props.isOnline) {
    listItems.value = listItems.value.filter(item => item.id !== id);
  }
}
const selectItem = (item: GroceryItem) => {
  triggerHaptics();
  currentItem.value = item;
  openBottomSheet();
};

const closeCardBottomSheet = () => {
  currentItem.value = null;
  closeBottomSheet();
};


const saveItem = async (data: {
  quantity: number,
  price: number,
  notes: string
}) => {
  if (!currentItem.value) return;
  try {
    await groceryListService.editGroceryItem(
        currentItem.value.id,
        {
          quantity: data.quantity,
          price: data.price,
          notes: data.notes
        },
        props.isOnline
    )
    await refreshListDetails();
    success('Item updated successfully!');
  } catch (err: any) {
    error(err.message);
    console.error('Error updating item:', err);
  } finally {
    closeCardBottomSheet();
  }
}

const openBudgetSetModal = () => {
  const modal = document.getElementById('modal_budget') as HTMLDialogElement;
  if (modal) {
    modal.showModal();
  }
}

const closeBudgetSetModal = () => {
  const modal = document.getElementById('modal_budget') as HTMLDialogElement;
  if (modal) {
    modal.close();
  }
}

const saveBudget = async (budgetValue: string) => {
  if (!groceryList.value) return;
  try {
    await groceryListService.saveBudget(groceryList.value?.id, +budgetValue, props.isOnline);
    closeBudgetSetModal();
    success('Budget saved successfully!');
    await refreshListDetails();
  } catch (e) {
    error('Error saving budget');
    console.error('Error saving budget:', e);
  }
}

</script>
<template>
  <DrawerRoot :open="isOpen" @close="closeCardBottomSheet">
    <DrawerRoot :open="true" :modal="false" v-model:active-snap-point="snap" :snap-points="snapPoints" :dismissible="false">
      <BottomSheet :snap="snap" withSnapPoints bgColor="shadow-[0_0_10px_1px] shadow-base-content/10">
        <BudgetInfo :grocery-items="listItems" :budget="groceryList?.budget" @expand="snap = 1" @open-budget-modal="openBudgetSetModal"/>
      </BottomSheet>
      <BudgetSetterModal id="modal_budget" :list-id="groceryList?.id" @save-budget="saveBudget"/>
      <div class="page transition-opacity" :class="{
        'opacity-10 pointer-events-none select-none': snap === 0.9
      }">
        <BaseHeading :title="groceryList?.name || 'Grocery List'" :actions="headingActions" backURL="/" replace/>
        <div v-if="loading" class="mt-20 flex flex-col items-center justify-center w-full">
          <div class="loading loading-dots w-16"></div>
          <p class="text-base-content/40"> {{ $t('loadingMessages.loadingItems') }}</p>
        </div>
        <template v-else-if="groceryList">
          <GroceryListDrawer
              v-if="groceryList"
              :grocery-list="groceryList"
              :is-open="groupSettingsOpen"
              :isOnline="isOnline"
              :grocery-items="listItems"
              @close="closeGroupSettings"
              @grocery-list-updated="refreshListDetails"
          />
          <GroceryItemForm :list-id="groceryList.id" :added-by="currentUser?.username || 'Unknown'" @submit="addItem"/>
          <div class="p-5">
            <div class="space-y-3">
              <GroceryItemCard v-for="(item, index) in listItems" :key="index" :item="item"
                               @check-item="(checked: boolean) => checkItem(checked, item.id)"
                               @delete-item="deleteItem(item.id)"
                               @edit-item="selectItem(item)"/>
            </div>
          </div>
        </template>
        <div v-else>
          <p class="text-center text-base-content/50">{{ $t('groceryList.notFound') }}</p>
        </div>
      </div>
    </DrawerRoot>
    <BottomSheet @close="closeCardBottomSheet">
      <div class="p-5">
        <EditGroceryItemForm v-if="currentItem" :item="currentItem" @saveItem="saveItem"/>
      </div>
    </BottomSheet>

  </DrawerRoot>
</template>