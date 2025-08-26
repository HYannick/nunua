<script setup lang="ts">
import {useRouter} from 'vue-router';
import {inject, onMounted, ref} from 'vue';
import type {UserService} from '@/user/services/UserService.ts';
import {useUserStore} from '@/stores/userStore.ts';
import UpdatePWAPrompt from '@/UpdatePWAPrompt.vue';
import Notification from '@/components/Notification.vue';
import InstallPWAPrompt from '@/views/InstallPWAPrompt.vue';
const router = useRouter()
const transitionName = ref('')

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  transitionName.value = toDepth < fromDepth ? 'page-right' : 'page-left'
})
const userService = inject('userService') as UserService;
const userStore = useUserStore();
onMounted(async () => {
  const user = await userService.fetchUser();
  if(!user) {
    return;
  }
  userStore.setCurrentUser(user);
})
</script>

<template>
  <Notification />
  <RouterView v-slot="{ Component, route}">
    <Transition :name="transitionName">
      <div :key="route.path">
        <component :is="Component"/>
      </div>
    </Transition>
  </RouterView>
  <UpdatePWAPrompt />
  <InstallPWAPrompt />
</template>
