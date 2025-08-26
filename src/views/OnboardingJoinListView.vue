<script setup lang="ts">
import {ref, computed, inject} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {LucideCheck, LucideArrowRight, LucideChevronLeft} from 'lucide-vue-next'
import type {UserService} from '@/user/services/UserService.ts';

import {useUserStore} from '@/stores/userStore.ts';
import OnboardingSlide from '@/views/onboarding/OnboardingSlide.vue';
import {generateRandomWord} from '@/utils/string.utils.ts';
import OnboardingLightStep1 from '@/views/onboarding/OnboardingLightStep1.vue';
import OnboardingLightStep3 from '@/views/onboarding/OnboardingLightStep3.vue';
import {useNotificationStore} from '@/stores/NotificationStore.ts';
import {useI18n} from 'vue-i18n';
import type {GroceryListService} from '@/grocery-list/infrastructure/GroceryListService.ts';
import OnboardingLightStep2 from '@/views/onboarding/OnboardingLightStep2.vue';
import InstallPrompt from '@/views/onboarding/InstallPrompt.vue';

interface OnboardingSlide {
  id: string
  component: any;
}

const router = useRouter()
const route = useRoute()

const currentPageIndex = ref(0)
const username = ref('')
const avatarString = ref(generateRandomWord(10));
const shareCode = ref(route.query.shareCode as string || '');
const {t} = useI18n()
const {success, error} = useNotificationStore()

const keyboardVisible = ref(false)

const slides: OnboardingSlide[] = [
  {
    id: 'step1',
    component: OnboardingLightStep1,
  },
  {
    id: 'step2',
    component: OnboardingLightStep2,
  },
  {
    id: 'step3',
    component: OnboardingLightStep3,
  },
  {
    id: 'install',
    component: InstallPrompt,
  },
]

const isLastSlide = computed(() => currentPageIndex.value === slides.length - 1)
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
  currentPageIndex.value = slides.length - 3
}

const userService = inject('userService') as UserService
const userStore = useUserStore();

async function setupUser() {
  if (!username.value.trim()) {
    return
  }

  try {
    const user = await userService.saveUser(username.value, avatarString.value)
    userStore.setCurrentUser(user);
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

function handleNext() {
  if (slides[currentPageIndex.value].id === 'step2') {
    setupUser();
  }
  nextSlide();
}

const groceryListService = inject('groceryListService') as GroceryListService

enum JoinStatusEnum {
  AlreadyJoined = 'alreadyJoined',
  Error = 'error',
  ListFound = 'listFound',
  Idle = 'idle'
}


let startX = 0
let endX = 0

const handleTouchStart = (e: TouchEvent) => {
  startX = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
  endX = e.changedTouches[0].clientX
  const diffX = startX - endX

  if (Math.abs(diffX) > 50) {
    if (diffX > 0 && !isLastSlide.value) {
      nextSlide()
    } else if (diffX < 0 && !isFirstSlide.value) {
      previousSlide()
    }
  }
}

const joinList = async (status: JoinStatusEnum) => {
  console.log('??')
  if (status === JoinStatusEnum.AlreadyJoined) {
    router.replace({
      name: 'grocery-list',
      params: {shareCode: shareCode.value}
    });
    return;
  }
  if (status === JoinStatusEnum.Error) {
    router.replace({name: 'home'});
    return;
  }
  try {
    await groceryListService.joinGroceryListByShareCode(shareCode.value);
    success(t('notifications.joinList.success'));
    await groceryListService.getMyGroceryLists();
    router.replace({
      name: 'grocery-list',
      params: {shareCode: shareCode.value}
    });
  } catch (err: any) {
    error(err.message);
    console.error(t('notifications.joinList.error'));
  }
}

const showConfirmButton = ref(false);
const joinStatus = ref<JoinStatusEnum>(JoinStatusEnum.Idle);
const handleConfirm = async (status: JoinStatusEnum) => {
  joinStatus.value = status;
  showConfirmButton.value = true;
  console.log(showConfirmButton.value)
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
      <div class="flex-1 flex items-center justify-center p-6" @touchstart="handleTouchStart"
           @touchend="handleTouchEnd">
        <div class="w-full max-w-md">
          <!-- Regular slides -->
          <div
              :key="currentPageIndex"
              class="text-center space-y-8 animate-fade-in"
          >
            <!-- Replace the component :is with explicit conditionals -->
            <OnboardingLightStep1 v-if="currentPageIndex === 0"/>

            <OnboardingLightStep2
                v-if="currentPageIndex === 1"
                v-model="username"
                :avatar-string="avatarString"
                @avatar-generated="avatarString = $event"
            />

            <OnboardingLightStep3
                v-if="currentPageIndex === 2"
                :share-code="shareCode"
                @result="handleConfirm($event)"
            />
            <InstallPrompt v-if="currentPageIndex === 3"/>
          </div>
        </div>
      </div>

      <!-- Progress indicators -->
      <div class="flex justify-center py-6">
        <div class="flex space-x-2">
          <div
              v-for="(_, index) in slides"
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
            v-if="!isLastSlide"
            @click="handleNext"
            class="btn btn-primary rounded-full btn-circle btn-xl w-18 h-18 gap-2"
            :disabled="slides[currentPageIndex]?.id === 'step2' && !username.trim()"
        >
          <LucideArrowRight :size="20"/>
        </button>
        <button
            v-else
            @click="joinList(joinStatus)"
            class="btn btn-success rounded-full btn-circle btn-xl w-18 h-18 gap-2">
          <LucideCheck :size="20"/>
        </button>
      </div>
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