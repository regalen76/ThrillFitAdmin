<template>
  <NuxtLoadingIndicator>
    <div
      class="w-screen h-screen flex items-center justify-center bg-black bg-opacity-70 flex-col"
    >
      <p>Loading...</p>
      <UProgress class="w-32" animation="carousel" />
    </div>
  </NuxtLoadingIndicator>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
  <UModals />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: rotate3d(1, 1, 1, 15deg);
}
</style>
