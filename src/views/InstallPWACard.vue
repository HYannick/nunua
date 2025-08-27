<template>
  <div v-if="!appInstalled" class="m-5 rounded-2xl border-2 border-base-300">
    <div class="p-5 flex flex-col items-center text-center gap-4">
      <LucideDownload />
      <div>
        <h3 class="font-bold">{{$t('installPrompt.title')}}</h3>
        <div class="text-xs">{{$t('installPrompt.description')}}</div>
      </div>
      <div class="flex gap-2">
        <button @click="closePrompt" class="btn rounded-full btn-md">{{$t('buttons.later')}}</button>
        <button  @click="bip && (bip as any).prompt()" class="btn btn-md btn-primary rounded-full">{{ $t('buttons.installApp') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {LucideDownload} from 'lucide-vue-next';

import {onMounted, ref} from 'vue';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import {useI18n} from 'vue-i18n';


const bip = ref<Event | null>(null);
const appInstalled = ref(true);
const { success } = useNotificationStore();

const closePrompt = () => {
  appInstalled.value = true;
}
const { t } = useI18n();
onMounted(async () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    bip.value = e;
    appInstalled.value = false;
  });

  window.addEventListener('appinstalled', () => {
    bip.value = null;
    appInstalled.value = true;
    success(t('notifications.appInstalled.success'));
  })
});

</script>