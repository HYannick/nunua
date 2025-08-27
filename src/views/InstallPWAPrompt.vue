<template>
  <div v-if="!appInstalled" class="toast toast-top toast-center">
    <div class="alert">
      <LucideDownload />
      <div>
        <h3 class="font-bold">{{$t('installPrompt.title')}}</h3>
        <div class="text-xs">{{$t('installPrompt.description')}}</div>
      </div>
      <div class="flex gap-2">
        <button @click="closePrompt" class="btn btn-sm">{{$t('buttons.later')}}</button>
        <button  @click="bip && (bip as any).prompt()" class="btn btn-sm btn-primary">{{ $t('buttons.installApp') }}</button>
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