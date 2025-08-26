<script setup lang="ts">
import {LucideCircleCheck, LucideCircleOff, LucideInfo} from 'lucide-vue-next';

import {storeToRefs} from 'pinia';
import {useNotificationStore, NotificationType} from '@/stores/NotificationStore.ts';
import {computed} from 'vue';
const notificationStore = useNotificationStore();
const { remove } = notificationStore;
const { notifications } = storeToRefs(notificationStore);

const status = computed(() => ({
	[NotificationType.ERROR]: {
		classes: 'bg-error text-error-content',
		icon: LucideCircleOff,
	},
	[NotificationType.SUCCESS]: {
		classes: 'bg-success text-success-content',
		icon: LucideCircleCheck,
	},
	[NotificationType.INFO]: {
		classes: 'bg-info text-info-content',
		icon: LucideInfo,
	},
}));
</script>

<template>
  <div class="fixed bottom-5 left-5 right-5 z-[100000] space-y-2">
    <TransitionGroup name="notification">
      <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
  'px-3 py-3 rounded-xl max-w-md text-sm transform transition-all duration-300 flex gap-2 items-center',
   status[notification.type].classes
]"
          @click="remove(notification.id)"
      >
        <component :is="status[notification.type].icon" class="w-5 h-5" />
        {{ notification.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
