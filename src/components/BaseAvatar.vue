<script setup lang="ts">
import MultiAvatar from '@multiavatar/multiavatar'
import {ref, watch} from 'vue';
import BoringAvatar from './boring-avatar/BoringAvatar.vue';
enum AvatarMode {
  Avataars = 'avataars',
  Boring = 'boring',
  Basic = 'basic'
}
const props = withDefaults(
    defineProps<{
      name: string,
      username?: string,
      mode?: AvatarMode,
    }>(), {
      name: '',
      mode: AvatarMode.Avataars
    }
)
const avatar = ref(MultiAvatar(props.name, true))
watch(() => props.name, (newName) => {
  avatar.value = MultiAvatar(newName, true)
})
</script>
<template>
  <div v-if="mode === AvatarMode.Avataars" v-html="avatar" class="w-full aspect-square"></div>
  <BoringAvatar
      v-if="mode === AvatarMode.Boring"
      :name="props.name"
      variant="beam"
      :size="50"
      :square="false"/>
  <div v-else-if="mode === AvatarMode.Basic && props.username" class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
    <span class="text-primary-content font-bold text-lg">{{ props.username.slice(0, 2)}}</span>
  </div>
</template>

<style scoped>

</style>