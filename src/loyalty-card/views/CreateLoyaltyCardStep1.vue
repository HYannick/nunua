<script lang="ts" setup="">
import {type DetectedBarcode, QrcodeStream} from 'vue-qrcode-reader';
import VueBarcode from '@chenfengyuan/vue-barcode';
import {ref} from 'vue';
import Squircle from '@/components/Squircle.vue';
import FloatingActionButton from '@/components/FloatingActionButton.vue';
import BaseButton from '@/components/BaseButton.vue';
import {useRouter} from 'vue-router';
import BaseHeading from '@/components/BaseHeading.vue';

const errorScanning = ref('');
const loyaltyCode = ref();
const onDetect = async (detectedCodes: DetectedBarcode[]) => {
  loyaltyCode.value = detectedCodes.map(code => code.rawValue)[0]
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
const router = useRouter();
const navigateToStep2 = (withCode: boolean= true) => {
  router.replace({ name: 'create-loyalty-card-step2', query: {loyaltyCode: withCode ? loyaltyCode.value : ''} });
};
</script>
<template>
  <div class="page">
    <BaseHeading title="loyaltyCards.step1.title" />
    <div class="px-5">
      <p class="my-5">{{$t('loyaltyCards.step1.description')}}</p>
      <Squircle
          v-if="!loyaltyCode"
          :corner-radius="20"
          :corner-smoothing="0.8"
          border-class="bg-base-content/50"
          background-class="bg-base-100 h-40 relative"
      >
        <div v-if="cameraReady === false" class="w-full h-full flex items-center justify-center">
          <div class="loading loading-ball"></div>
        </div>
        <div class="absolute animate-pulse h-[1px] bg-red-500 top-1/2 -translate-y-1/2  left-10 right-10 z-10"></div>
        <QrcodeStream @detect="onDetect" @error="onError"  @camera-on="cameraReady = true" @camera-off="cameraReady = false" :formats="['qr_code', 'linear_codes']" />
      </Squircle>
      <VueBarcode v-if="loyaltyCode" :value="loyaltyCode" class="max-w-72 w-full mx-auto">
        {{$t('loyaltyCards.step1.barcodeError')}}
      </VueBarcode>
      <BaseButton label="loyaltyCards.step1.manualEntryButton" class="mt-5 mx-auto" btn-style="outline" @click="navigateToStep2(false)" />
      <BaseButton label="loyaltyCards.retryScan" class="mt-5 w-1/2 mx-auto" btn-style="ghost" @click="loyaltyCode = null" v-if="loyaltyCode" />

      <FloatingActionButton label="buttons.continue" icon="lucide:camera" :disabled="!loyaltyCode" class="mt-5" @click="navigateToStep2" />
    </div>

  </div>
</template>

<style scoped>

</style>