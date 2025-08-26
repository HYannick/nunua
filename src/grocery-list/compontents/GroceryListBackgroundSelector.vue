<script lang="ts" setup="">

import {LucideCheck} from 'lucide-vue-next';
import Squircle from '@/components/Squircle.vue';
import backgroundPictureOne from '@/assets/background-1.jpg';
import backgroundPictureTwo from '@/assets/background-2.jpg';
import backgroundPictureThree from '@/assets/background-3.jpg';
import backgroundPictureFour from '@/assets/background-4.jpg';
import backgroundPictureFive from '@/assets/background-5.jpg';
import {triggerHaptics} from '@/utils/haptics.utils.ts';

const props = defineProps<{
  modelValue: string;
  label: string;
}>();
const emit = defineEmits(['update:modelValue']);


const backgroundList = [
  backgroundPictureOne,
  backgroundPictureTwo,
  backgroundPictureThree,
  backgroundPictureFour,
  backgroundPictureFive
]

const selectBackground = (image: string) => {
  triggerHaptics()
  emit('update:modelValue', image);
}
</script>
<template>
  <div class="w-full">
    <p class="font-bold pb-2 pl-5">{{$t(label)}}</p>
    <div class="carousel carousel-center bg-transparent w-full rounded-box max-w-md space-x-4 px-4 pb-4">
      <div class="carousel-item h-36 w-58 anim-bounce relative" v-for="(image, index) in backgroundList" :key="index" @click="selectBackground(image)">
        <Squircle
            :corner-radius="20"
            :corner-smoothing="0.8"
            class="w-full"
        >
          <img
              :src="image"
              alt="Background Image"
              class="h-full w-full object-cover" />
        </Squircle>
        <LucideCheck v-if="image === props.modelValue" class="absolute top-2 right-2 text-primary-content bg-primary rounded-full p-1" :size="24"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>