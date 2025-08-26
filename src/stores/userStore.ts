import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {LocalUser} from '@/user/domain/User.ts';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<LocalUser>();

  const setCurrentUser = (user: LocalUser) => {
    currentUser.value = user;
  }
  return {
    currentUser,
    setCurrentUser
  }
})