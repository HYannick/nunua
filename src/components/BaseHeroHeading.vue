<script setup lang="ts">
import {LucideArrowLeft} from 'lucide-vue-next';
import {useRouter} from 'vue-router';
const props = defineProps<{
  title: string;
  backUrl?: string;
  replace?: boolean;
}>();

const router = useRouter();

const goBack = () => {
  if (props.backUrl) {
    if (props.replace) {
      router.replace(props.backUrl);
    } else {
      router.push(props.backUrl);
    }
  } else {
    router.back();
  }
}
</script>
<template>
  <div class="p-5 h-34 bg-base-200 flex flex-col justify-between mb-5">
    <div class="flex justify-between">
      <button @click="goBack" class="flex items-center btn btn-circle btn-ghost">
        <LucideArrowLeft />
      </button>
      <slot name="actions"></slot>
    </div>
    <h1 class="font-serif text-center text-3xl">{{$t(title)}}</h1>
  </div>
</template>
