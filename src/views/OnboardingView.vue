<script setup lang="ts">
import {ref, computed, inject} from 'vue'
import {useRouter} from 'vue-router'
import {LucideCheck, LucideArrowRight, LucideChevronLeft} from 'lucide-vue-next'
import type {UserService} from '@/user/services/UserService.ts';

import {useUserStore} from '@/stores/userStore.ts';
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import ProfileSetup from '@/views/onboarding/ProfileSetup.vue';
import OnboardingStep1 from '@/views/onboarding/OnboardingStep1.vue';
import OnboardingStep2 from '@/views/onboarding/OnboardingStep2.vue';
import {generateRandomWord} from '@/utils/string.utils.ts';
import OnboardingStep3 from '@/views/onboarding/OnboardingStep3.vue';

interface OnboardingSlide {
  id: string
  component: any;
}

const router = useRouter()

const currentPageIndex = ref(0)
const username = ref('')
const avatarString = ref(generateRandomWord(10));

const keyboardVisible = ref(false)

const slides: OnboardingSlide[] = [
  {
    id: 'step1',
    component: OnboardingStep1,
  },
  {
    id: 'step2',
    component: OnboardingStep2,
  },
  {
    id: 'step3',
    component: OnboardingStep3,
  },
]

const isLastSlide = computed(() => currentPageIndex.value === slides.length)
const isFirstSlide = computed(() => currentPageIndex.value === 0)


function nextSlide() {
  if (currentPageIndex.value < slides.length) {
    currentPageIndex.value++
  }
}

function previousSlide() {
  if (currentPageIndex.value > 0) {
    currentPageIndex.value--
  }
}

function skipToEnd() {
  currentPageIndex.value = slides.length
}

const userService = inject('userService') as UserService
const userStore = useUserStore();

async function completeOnboarding() {
  if (!username.value.trim()) {
    return
  }

  try {
    const user = await userService.saveUser(username.value, avatarString.value)
    userStore.setCurrentUser(user);
    await router.replace({name: 'home'})
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

function handleNext() {
  if (isLastSlide.value) {
    completeOnboarding()
  } else {
    nextSlide()
  }
}
</script>

<template>
  <div class="h-svh relative overflow-hidden">
    <button
        v-if="!isLastSlide"
        @click="skipToEnd"
        class="absolute top-4 right-4 z-10 btn btn-ghost btn-sm text-gray-600 hover:text-gray-800"
    >
      {{ $t('onboarding.buttons.skip') }}
    </button>

    <!-- Main content -->
    <div class="flex flex-col h-full">
      <!-- Slides container -->
      <div class="flex-1 flex items-center justify-center p-6">
        <div class="w-full max-w-md">
          <!-- Regular slides -->
          <div
              v-if="!isLastSlide"
              :key="currentPageIndex"
              class="text-center space-y-8 animate-fade-in"
          >
            <component  :is="slides[currentPageIndex].component"/>
          </div>
          <div v-else>
            <ProfileSetup
                v-model="username"
                :avatar-string="avatarString"
                @avatar-generated="avatarString = $event"
            />
          </div>
        </div>
      </div>

      <!-- Progress indicators -->
      <div class="flex justify-center py-6">
        <div class="flex space-x-2">
          <div
              v-for="(_, index) in [...slides, {}]"
              :key="index"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentPageIndex
              ? 'bg-orange-300 w-6'
              : 'bg-gray-300'"
          ></div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex justify-between items-center p-6" v-if="!keyboardVisible">
        <!-- Previous button -->
        <button
            v-if="!isFirstSlide"
            @click="previousSlide"
            class="btn btn-ghost gap-2 text-gray-600 hover:text-gray-800"
        >
          <LucideChevronLeft :size="20"/>
          {{ $t('onboarding.buttons.previous') }}
        </button>
        <div v-else></div>

        <!-- Next/Complete button -->
        <button
            @click="handleNext"
            class="btn btn-primary rounded-full btn-circle btn-xl w-18 h-18 gap-2"
            :disabled="isLastSlide && !username.trim()"
        >
          <LucideCheck v-if="isLastSlide" :size="20"/>
          <LucideArrowRight v-else :size="20"/>
        </button>
      </div>

      <!-- Floating action button for mobile -->
      <button
          v-if="keyboardVisible"
          @click="handleNext"
          class="fixed bottom-6 right-6 btn btn-primary btn-circle btn-lg"
          :disabled="isLastSlide && !username.trim()"
      >
        <LucideCheck v-if="isLastSlide" :size="24"/>
        <LucideArrowRight v-else :size="24"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}

.input-error {
  border-color: #ef4444;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Custom button hover effects */
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn-ghost:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Progress indicator animation */
.w-2.h-2.rounded-full {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>