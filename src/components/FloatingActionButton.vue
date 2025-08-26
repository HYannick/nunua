<script setup lang="ts">
import {Haptics, ImpactStyle} from '@capacitor/haptics';
import Squircle from '@/components/Squircle.vue';

withDefaults(
    defineProps<{
      label: string;
      type?: 'button' | 'submit' | 'reset';
      loading?: boolean;
      disabled?: boolean;
    }>(), {
      type: 'button',
      loading: false,
      disabled: false
    }
)
const emit = defineEmits(['onSubmit']);

const submitAction = () => {
  Haptics.impact({style: ImpactStyle.Light});
  emit('onSubmit');
}
</script>
<template>
  <div class="fixed
  bg-gradient-to-t from-base-100 from-80%
  z-10 bottom-0 left-0 right-0 p-5">
    <Squircle
        :corner-radius="15"
        :corner-smoothing="0.8"
        background-class="bg-base-100"
    >
    <button
        :type="type"
        @click="submitAction()"
        class="btn w-full btn-primary p-7 rounded-2xl text-lg"
        :disabled="loading || disabled"
    >
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <template v-else>
        {{ $t(label) }}
      </template>
    </button>
    </Squircle>
  </div>
</template>