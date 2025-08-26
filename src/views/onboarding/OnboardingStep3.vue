<template>
  <OnboardingSlide
      title="onboarding.budgetFeature.title"
      description="onboarding.budgetFeature.description"
      :illustration="AddNotesIllustration" />
</template>
<script setup lang="ts">
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import {AddNotesIllustration} from '@/illustrations.ts';
</script>