import { defineStore } from 'pinia';

export enum NotificationType {
	ERROR = 'error',
	SUCCESS = 'success',
	INFO = 'info',
}
interface Notification {
	id: number;
	message: string;
	type: NotificationType;
	duration?: number;
}

export const useNotificationStore = defineStore('notification', {
	state: () => ({
		notifications: [] as Notification[],
		id: 0,
	}),

	actions: {
		show(
			message: string,
			type: Notification['type'] = NotificationType.INFO,
			duration = 3000,
		) {
			const notification: Notification = {
				id: this.id++,
				message,
				type,
				duration,
			};

			this.notifications.push(notification);

			if (duration > 0) {
				setTimeout(() => {
					this.remove(notification.id);
				}, duration);
			}
		},

		remove(id: number) {
			this.notifications = this.notifications.filter((t) => t.id !== id);
		},

		error(message: string, duration?: number) {
			this.show(message, NotificationType.ERROR, duration);
		},

		success(message: string, duration?: number) {
			this.show(message, NotificationType.SUCCESS, duration);
		},

		info(message: string, duration?: number) {
			this.show(message, NotificationType.INFO, duration);
		},
	},
});
