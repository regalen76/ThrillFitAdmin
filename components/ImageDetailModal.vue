<script lang="ts" setup>
import { ref as storageRef } from "firebase/storage";

const props = defineProps({
  images: {
    type: Array<string>,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["success"]);

const storage = useFirebaseStorage();
const imageDetail = ref<Array<string>>([]);
const oneTime = ref<boolean>(false)
async function loadImage() {
  console.log("masukjk")
  console.log(oneTime.value)
  if (!oneTime.value) {
    console.log("masuk2")
    const promises = props.images.map(async (url) => {
      const imageRef = storageRef(storage, `${props.location}/${url}`);
      const { promise } = useStorageFileUrl(imageRef);
      const imageUrl = await promise.value;
      if (imageUrl !== null) {
        imageDetail.value.push(imageUrl);
      }
    });

    await Promise.all(promises);
    oneTime.value = true
  }
}
function onSuccess() {
  emit("success");
}
</script>

<template>
  <UModal>
    <div class="p-4 flex items-center justify-center flex-col">
      <span class="text-center mb-4">{{ props.images }}</span>
      <UPopover mode="click" :popper="{ placement: 'top-start' }">
        <UIcon class="w-6 h-6 hover:text-primary text-center" name="i-heroicons-photo" @click="loadImage()" />

        <template #panel>
          <div class="p-10 min-h-32 min-w-32">
            <div v-if="imageDetail.length === 0" class="min-w-32 min-h-32 flex items-center justify-center">
              <UProgress animation="carousel" />
            </div>
            <UCarousel v-if="imageDetail.length !== 0" :items="imageDetail" :ui="{
              item: 'basis-full',
              container: 'rounded-lg',
              indicators: {
                wrapper: 'relative bottom-0 mt-4',
              },
            }" :prev-button="{
              color: 'primary',
              icon: 'i-heroicons-arrow-left-20-solid',
              class: '-left-12',
            }" :next-button="{
              color: 'primary',
              icon: 'i-heroicons-arrow-right-20-solid',
              class: '-right-12',
            }" arrows indicators class="max-w-96 mx-auto mt-4 mb-4 ml-4 mr-4">
              <template #default="{ item }">
                <NuxtImg class="h-[300px]" :src="item" draggable="false" loading="lazy" width="384" height="300"
                  fit="fill" />
              </template>

              <template #indicator="{ onClick, page, active }">
                <UButton :label="String(page)" :variant="active ? 'solid' : 'outline'" size="2xs"
                  class="rounded-full min-w-6 justify-center" @click="onClick(page)" />
              </template>
            </UCarousel>
          </div>
        </template>
      </UPopover>
    </div>
  </UModal>
</template>
