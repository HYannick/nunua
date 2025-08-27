<script setup lang="ts">
import BaseAvatar from './BaseAvatar.vue';
import {LucideCreditCard, LucideUserCog} from 'lucide-vue-next';
import {triggerHaptics} from '@/utils/haptics.utils.ts';
import type {LocalUser} from '@/user/domain/User.ts';

defineProps<{
  user?: LocalUser,
}>()

</script>
<template>
  <header class="w-full flex p-5 justify-between items-center">
    <div class="flex items-end gap-2">
      <RouterLink :to="{name:'profile'}" class="w-14">
        <div v-if="!user" class="w-14 h-14 rounded-full bg-primary">
        </div>
        <BaseAvatar v-else :name="user.avatar" :username="user.username"/>
      </RouterLink>
      <div>
        <p class="font-serif text-md ">{{ $t('greetings.hello') }}</p>
        <p class="font-serif text-xl font-bold">{{ user?.username || 'Struggler' }}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <RouterLink :to="{name: 'loyalty-cards'}" @click="triggerHaptics" class="btn btn-primary btn-circle btn-ghost">
        <LucideCreditCard />
      </RouterLink>
      <RouterLink :to="{name: 'settings'}" @click="triggerHaptics" class="btn btn-primary btn-circle btn-ghost">
        <LucideUserCog/>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>

</style>