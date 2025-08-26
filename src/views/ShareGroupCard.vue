<script lang="ts" setup="">
import { useQRCode } from '@vueuse/integrations/useQRCode'
import {LucideCopy, LucideQrCode} from 'lucide-vue-next';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import {computed} from 'vue';

const props = defineProps<{isOnline: boolean, otpCode: string}>()
const {success} = useNotificationStore()
const groupURL = computed(() => `${window.location.origin}/join/${props.otpCode}`)
const qrcode = useQRCode(groupURL.value)
async function copyOtpCode() {
  try {
    await navigator.clipboard.writeText(groupURL.value)
    success('OTP code copied to clipboard')
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}
</script>
<template>
  <div>
    <h3 class="font-bold ">{{$t('groceryListSettings.shareList.title')}}</h3>
    <div class="flex gap-2">
      <input
          :value="otpCode"
          type="text"
          class="input input-bordered flex-1"
          readonly
      />
      <button onclick="modal_qrcode.showModal()" class="btn btn-outline btn-square">
        <LucideQrCode :size="16" />
      </button>
      <button @click="copyOtpCode" class="btn btn-primary btn-square">
        <LucideCopy :size="16" />
      </button>
    </div>
    <dialog id="modal_qrcode" class="modal">
      <div class="modal-box">
        <div class="w-full h-full mask mask-squircle p-2 bg-white">
          <img :src="qrcode" alt="QR Code" class="w-full h-full" />
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>

</style>