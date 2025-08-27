<template>
  <div>
   <div class="w-48 bg-transparent mx-auto overflow-hidden rounded-3xl mb-5">
     <video autoplay muted loop class="w-full h-full object-cover">
       <source src="/videos/pwa-installation.mp4" type="video/mp4">
       Your browser does not support the video tag.
     </video>
   </div>
    <div class="text-center">
      <h2 class="text-3xl font-bold font-serif text-gray-800 mb-5">
        {{ $t('installPrompt.title') }}
      </h2>

      <p class="text-gray-600 text-lg leading-relaxed">
        {{ $t('installPrompt.description') }}
      </p>
    </div>
  </div>
</template>