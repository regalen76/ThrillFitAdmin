<template>
  <div class="flex flex-row">
    <!-- sidebar -->
    <transition name="slide">
      <div
        v-if="!hideSideBar"
        class="ml-6 mt-6 fixed top-0 bg-gray-800 h-[calc(100vh-3rem)] min-w-[14rem] rounded-3xl"
      >
        <UVerticalNavigation :links="links" class="rounded-3xl mt-4">
          <template #default="{ link }">
            <div
              class="w-full h-10 flex items-center ml-1 bg-gray-800 rounded-3xl hover:cursor-pointer"
            >
              <span
                class="group-hover:text-primary relative ml-2"
                :class="[{ 'text-primary': isActiveLink(link.to) }]"
                >{{ link.label }}</span
              >
            </div>
          </template>
        </UVerticalNavigation>
      </div>
    </transition>

    <!-- right side -->
    <div
      :class="[
        'flex flex-col mt-6 w-full mr-6 transition-margin',
        { 'ml-6': hideSideBar, 'ml-[17rem]': !hideSideBar },
      ]"
      class="z-10"
    >
      <div class="sticky top-0">
        <div
          class="w-full bg-gray-800 rounded-3xl h-16 flex items-center justify-between px-4"
        >
          <!-- Left Button -->
          <UIcon
            class="w-8 h-8 hover:text-primary text-center hover:cursor-pointer"
            name="i-heroicons-bars-3-bottom-left-16-solid"
            @click="hideSideBar = !hideSideBar"
          />

          <!-- Right Buttons -->
          <div class="flex space-x-4 items-center">
            <span class="h-fit">
              {{ user?.displayName }}
            </span>
            <UIcon
              class="w-8 h-8 hover:text-primary text-center hover:cursor-pointer"
              name="i-heroicons-power-16-solid"
              @click="openModalLogout = true"
            />
            <UModal v-model="openModalLogout">
              <div class="p-4">
                <UContainer class="h-48">
                  <div
                    class="flex w-full h-full items-center justify-center flex-col"
                  >
                    <h3>Do you want to Log Out?</h3>
                    <div class="flex flex-row mt-4">
                      <div class="mr-4 w-20">
                        <UButton block @click="logout">Yes</UButton>
                      </div>
                      <div class="w-20">
                        <UButton block @click="openModalLogout = false"
                          >No</UButton
                        >
                      </div>
                    </div>
                  </div>
                </UContainer>
              </div>
            </UModal>
          </div>
        </div>
      </div>

      <div
        class="overflow-y-auto rounded-3xl bg-gray-800 mt-6 mb-6 min-h-[calc(100vh-8.5rem)] p-6"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signOut } from "firebase/auth";

const links = [
  {
    label: "Home",
    to: "/home",
  },
  {
    label: "Feeds",
    to: "/feeds",
  },
  {
    label: "Training Sets",
    to: "/training-sets",
  },
];

const auth = useFirebaseAuth();
const user = useCurrentUser();
const toast = useToast();
const route = useRoute();

const openModalLogout = ref(false);
const hideSideBar = ref(false);

const logout = async () => {
  toast.add({ title: "Loading...", description: "Signing you out" });
  await signOut(auth!);
  toast.add({ title: "Logged Out" });
  await navigateTo("/login", { replace: true });
};

function isActiveLink(link: string) {
  return route.fullPath === link;
}
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-110%);
}

.transition-margin {
  transition: margin-left 0.3s ease;
}
</style>
