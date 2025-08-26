<template>
  <OnboardingSlide
      title="joinOnboarding.welcome.title"
      description="joinOnboarding.welcome.description"
      :illustration="WelcomeIllustration" />
</template>
<script setup lang="ts">
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import {WelcomeIllustration} from '@/illustrations.ts';
</script>