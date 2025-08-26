<script setup lang="ts">

import {LucideArrowLeft} from 'lucide-vue-next';
import {useRouter} from 'vue-router';

const props = withDefaults(
    defineProps<{
      title: string;
      backURL?: string;
      replace?: boolean;
      actions?: { icon: any, onClick?: () => void }[];
      asName?: boolean;
    }>(), {
      backURL: undefined,
      replace: false,
      asName: false,
      actions: () => []
    }
)
const router = useRouter();

const goBack = () => {
  if (props.backURL) {
    if (props.replace) {
      router.replace(props.backURL);
    } else {
      router.push(props.backURL);
    }
  } else {
    router.back();
  }
}

</script>
<template>
  <div class="flex w-full items-center gap-5 p-5">
    <button @click="goBack" class="flex items-center btn btn-circle btn-ghost">
      <LucideArrowLeft strokeWidth="2"/>
    </button>
    <h1 class="text-xl font-semibold font-serif">{{ asName ? title : $t(title) }}</h1>
    <div v-if="actions.length" class="ml-auto flex items-center gap-3">
      <button v-for="(action, index) in actions" :key="index" @click="action.onClick" class="btn btn-circle btn-ghost">
        <component :is="action.icon" class="w-5 h-5 "/>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>