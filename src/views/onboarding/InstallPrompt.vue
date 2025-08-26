<template>
  <div>
    <OnboardingSlide
        title="installPrompt.title"
        description="installPrompt.description"
        :illustration="AddNotesIllustration" />
    <div v-if="!appInstalled" class="flex gap-5 justify-center mt-5">
      <button @click="closePrompt" class="btn rounded-full btn-lg">{{ $t('buttons.later') }}</button>
      <button @click="bip && (bip as any).prompt()" class="btn btn-lg btn-primary rounded-full">{{ $t('buttons.installApp') }}</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import {AddNotesIllustration} from '@/illustrations.ts';
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
    success(t('notifications.appInstalled'));
  })
});
</script>