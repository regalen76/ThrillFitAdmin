<template>
  <div v-if="user" class="flex w-full h-full justify-center items-center">
    <div class="w-full">
      <div class="text-center">
        <h1 class="text-3xl font-semibold lg:text-4xl">
          Thrill Fit Admin Site
        </h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard-layout",
});

const user = useCurrentUser();
</script>

<style></style>
