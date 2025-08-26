<template>
  <OnboardingSlide
      title="onboarding.appDesc.title"
      description="onboarding.appDesc.description"
      :illustration="AddNotesIllustration" />
</template>
<script setup lang="ts">
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import {AddNotesIllustration} from '@/illustrations.ts';
</script>