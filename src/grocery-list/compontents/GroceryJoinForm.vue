<script setup lang="ts">

import BaseInput from '@/components/BaseInput.vue';
import {ref} from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import {LucideScanQrCode} from 'lucide-vue-next';
import {type DetectedBarcode, QrcodeStream} from 'vue-qrcode-reader';
import {useNotificationStore} from '@/stores/NotificationStore.ts';

const shareCode = ref('');

const emit = defineEmits(['submit', 'close'])
const {error} = useNotificationStore();

const submitForm = () => {
  if(!shareCode.value.trim()) {
    error('Please enter a share code.');
    return;
  }
  emit('submit', shareCode.value);
  shareCode.value = '';
}

const resetFormAndClose = () => {
  shareCode.value = '';
  emit('close');
}
const scannerOpen = ref(false);

const openScanner = () => {
  scannerOpen.value = !scannerOpen.value;
}

const paused = ref(false)
const errorScanning = ref('');
const onDetect = async (detectedCodes: DetectedBarcode[]) => {
  shareCode.value = detectedCodes.map(code => code.rawValue)[0]
  paused.value = true
  setTimeout(() => 500)
  paused.value = false;


  if (shareCode.value) {
     emit('submit', shareCode.value);
  }
}
const cameraReady = ref(false);
const onError = (err: { name: string, message: string }) => {
  errorScanning.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    errorScanning.value += 'you need to grant camera access permission'
  } else if (err.name === 'NotFoundError') {
    errorScanning.value += 'no camera on this device'
  } else if (err.name === 'NotSupportedError') {
    errorScanning.value += 'secure context required (HTTPS, localhost)'
  } else if (err.name === 'NotReadableError') {
    errorScanning.value += 'is the camera already in use?'
  } else if (err.name === 'OverconstrainedError') {
    errorScanning.value += 'installed cameras are not suitable'
  } else if (err.name === 'StreamApiNotSupportedError') {
    errorScanning.value += 'Stream API is not supported in this browser'
  } else if (err.name === 'InsecureContextError') {
    errorScanning.value += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  } else {
    errorScanning.value += err.message
  }
}
</script>
<template>
  <form @submit.prevent="submitForm" class="p-5">
    <h2 class="text-2xl font-bold mb-5">{{$t('joinList.title')}}</h2>
    <div class="flex items-end">
      <BaseInput name="shareCode" label="joinList.inputCodeLabel" placeholder="joinList.inputCodePlaceholder" v-model="shareCode" class="flex-1"/>
      <button type="button" class="flex items-center justify-center mask mask-squircle btn btn-secondary btn-xl" @click="openScanner">
        <LucideScanQrCode />
      </button>
    </div>
    <div class="wrapper" :class="{'is-open mt-10': scannerOpen}">
      <div class="inner aspect-square mask mask-squircle bg-base-100">
        <div v-if="cameraReady === false" class="loading loading-ball"></div>
        <QrcodeStream v-if="scannerOpen" @detect="onDetect" @error="onError"  @camera-on="cameraReady = true" @camera-off="cameraReady = false" />
      </div>
    </div>
    <div class="mt-10 space-y-3 flex justify-between gap-2">
      <div class="flex-1">
        <BaseButton @click="resetFormAndClose" label="buttons.cancel" btn-style="ghost" type="submit"/>
      </div>
      <div class="flex-1">
        <BaseButton label="buttons.joinList" type="submit"/>
      </div>
    </div>
  </form>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease-in-out;
}

.wrapper.is-open {
  grid-template-rows: 1fr;
}

.inner {
  overflow: hidden;
}
</style>