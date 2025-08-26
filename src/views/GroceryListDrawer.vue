<script setup lang="ts">
import {ref, computed, inject, watch} from 'vue'
import { useRouter } from 'vue-router'
import {
  LucideSave,
  LucideWifi,
  LucideWifiOff,
  LucideTriangleAlert
} from 'lucide-vue-next'

import BaseInput from '@/components/BaseInput.vue';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import type {GroceryList} from '@/grocery-list/domain/GroceryList.ts';
import type {GroceryListService} from '@/grocery-list/infrastructure/GroceryListService.ts';
import type {GroceryItem} from '@/grocery-list/domain/GroceryItem.ts';
import BaseButton from '@/components/BaseButton.vue';
import GroceryListBackgroundSelector from '@/grocery-list/compontents/GroceryListBackgroundSelector.vue';
import ShareGroupCard from '@/views/ShareGroupCard.vue';

interface Props {
  groceryList: GroceryList,
  groceryItems: GroceryItem[]
  isOpen: boolean
  isOnline: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  groceryListUpdated: []
}>()

const router = useRouter()

const groceryListService = inject('groceryListService') as GroceryListService
const {success, error} = useNotificationStore();
const groceryListForm = ref<{
  name: string,
  background: string
}>({
  name: '',
  background: ''
})
const showDeleteModal = ref(false)
const shouldDeleteOnline = ref(false)
const loading = ref(false)
const isOnline = computed(() => {
  return (props.isOnline && props.groceryList.shareCode) as boolean
})

const otpCode = computed(() => {
  return props.groceryList.shareCode || ''
})

const statusColor = computed(() => {
  const status = props.groceryList.status
  const colorMap: Record<string, string> = {
    'active': 'text-success',
    'deleted': 'text-error',
    'archived': 'text-warning',
  }
  return colorMap[status] || 'text-gray-600'
})

async function saveGroupName() {
  if (!groceryListForm.value.name.trim()) return

  loading.value = true
  try {
    await groceryListService.updateListDetails(
        props.groceryList.id,
        groceryListForm.value,
        props.isOnline
    )

    emit('groceryListUpdated')
  } catch (error) {
    console.error('Failed to update group name:', error)
  } finally {
    loading.value = false
  }
}

async function putGroupOnline() {
  loading.value = true
  try {
    await groceryListService.
    pushListOnline(props.groceryList.id);
    success('Successfully push list online')
    router.replace({name: 'grocery-list', params: {shareCode: props.groceryList.shareCode}})
  } catch (error) {
    console.error('Failed to put group online:', error)
  } finally {
    loading.value = false
  }
}

async function deleteList() {
  loading.value = true
  try {
    await groceryListService.deleteGroceryList(
        props.groceryList.id,
        props.groceryItems.map(item => item.id),
        props.isOnline
    )

    success('Group deleted successfully')
    router.replace({ name: 'home' })
  } catch (err) {
    error('Failed to delete group. try again later.')
    console.error('Failed to delete group:', err)
  } finally {
    loading.value = false
    showDeleteModal.value = false
  }
}

function openDeleteModal() {
  shouldDeleteOnline.value = false
  showDeleteModal.value = true
}

watch(() => props.groceryList, () => {
  groceryListForm.value = {
    name: props.groceryList.name,
    background: props.groceryList.background,
  }
}, {
  immediate: true,
})
</script>

<template>
  <!-- Backdrop -->
  <Transition>
    <div v-if="isOpen" class="fixed inset-0 bg-base-content z-[60] opacity-70" @click="emit('close')"></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-80 bg-base-100 shadow-xl z-[60] overflow-y-auto"
    >
      <div class="flex flex-col h-full">
        <div class="bg-base-200 p-5 rounded-b-3xl">
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="font-bold ">{{$t('groceryListSettings.state')}}</span>
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2">
                  <LucideWifi v-if="isOnline" :size="16" class="text-success" />
                  <LucideWifiOff v-else :size="16" />
                  <span :class="isOnline ? 'text-success' : ''">
                  {{ isOnline ? $t('state.online') : $t('state.offline') }}
                </span>
                </div>
                <div class="w-0.5 h-4 bg-base-content/50"></div>
                <span :class="statusColor">{{ $t(`state.${groceryList.status}`) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="flex-1 space-y-6">
          <!-- Deleted Group State -->
          <div v-if="groceryList.status === 'deleted'" class="text-center p-5 space-y-4">
            <div class="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <LucideTriangleAlert :size="48" class="text-red-600" />
            </div>
            <p>{{$t('groceryListSettings.onlineGroupDeleted')}}</p>
            <button @click="openDeleteModal" class="btn btn-error w-full btn-lg rounded-2xl">
              {{$t('groceryListSettings.deleteList')}}
            </button>
          </div>

          <!-- Normal Group State -->
          <div v-else class="space-y-6">
            <!-- Group Name Edit -->
            <div class="space-y-3">
              <div class="flex flex-col items-end gap-2">
                <div class="w-full px-5 py-2">
                  <BaseInput
                      v-model="groceryListForm.name"
                      type="text"
                      name="groupName"
                      class="w-full"
                      label="groceryListSettings.editListName"
                      :disabled="loading"
                  />
                </div>
                <GroceryListBackgroundSelector label="groceryListSettings.editListBackground" v-model="groceryListForm.background" />
                <div class="w-40 px-5">
                  <BaseButton
                      label="buttons.save"
                      @click="saveGroupName"
                      :disabled="loading || !groceryListForm.name.trim()"
                  >
                    <LucideSave />
                  </BaseButton>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Online Sharing / Put Online -->
            <div class="space-y-3 px-5">
              <template v-if="isOnline">
                <ShareGroupCard :is-online="isOnline" :otp-code="otpCode" />
              </template>
              <template v-else>
                <h3 class="font-bold ">{{$t('groceryListSettings.putOnline.title')}}</h3>
                <p class="text-gray-600 text-sm">
                  {{$t('groceryListSettings.putOnline.description')}}
                </p>
                <div class="flex justify-end">
                  <BaseButton
                      @click="putGroupOnline"
                      :disabled="loading"
                      label="groceryListSettings.putOnline.confirm"
                      btn-style="outline"
                  >
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  </BaseButton>
                </div>
              </template>
            </div>
            <div class="divider"></div>
            <!-- Danger Zone -->
            <div class="space-y-4 px-5">
              <div class="flex items-center gap-2 text-error">
                <LucideTriangleAlert :size="20" />
                <span class="font-bold">{{$t('groceryListSettings.dangerZone')}}</span>
              </div>
              <BaseButton onclick="modal_delete_list.showModal()" label="groceryListSettings.deleteList" btn-color-class="btn-error" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Delete Confirmation Modal -->
  <dialog id="modal_delete_list" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-error">{{$t('deleteList.title')}}</h3>
      <div class="py-4 space-y-4">
        <p>{{$t('deleteList.description')}}</p>
        <p>{{$t('deleteList.subDescription')}}</p>
        <p class="text-sm text-error" v-if="isOnline">{{$t('deleteList.warning')}}</p>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-ghost">
            {{$t('buttons.cancel')}}
          </button>
        </form>

        <form method="dialog">
          <button
              @click="deleteList"
              class="btn btn-error"
              :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{$t('buttons.delete')}}
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<style>
.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
</style>