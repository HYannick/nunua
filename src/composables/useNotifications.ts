import {ref} from 'vue';
// import {NotificationService} from '@/groups/services/NotificationService.ts';
import {useNotificationStore} from '@/stores/NotificationStore.ts';

export const useNotifications = () => {
  const isPermissionGranted = ref(Notification.permission === 'granted')
  // const notificationService = inject('notificationService') as NotificationService
  const {info} = useNotificationStore();

  const requestPermission = async () => {
    if((await Notification.requestPermission()) === 'granted') {
      info('To disable notifications, go to the mobile settings on the app')
    }
    if((await Notification.requestPermission()) !== 'granted') {
      info('To enable notification, go to the mobile settings on the app')
    }
    if (!window.Notification) {
      throw new Error('This browser does not support notifications')
    }

    const permission = await Notification.requestPermission()
    isPermissionGranted.value = permission === 'granted'


    if (permission !== 'granted') {
      throw new Error('Notification permission denied')
    }
    // await notificationService.initializeMessaging()

    return permission
  }

  return {
    isPermissionGranted,
    requestPermission,
  }
}