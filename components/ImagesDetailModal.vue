<script lang="ts" setup>
import { ref as storageRef } from "firebase/storage";

const toast = useToast();
const db = useFirestore();

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
function onSuccess() {
  emit("success");
}

onMounted(async () => {
  const storage = useFirebaseStorage();
  const promises = props.images.map(async (url) => {
    const imageRef = storageRef(storage, `${props.location}/${url}`);
    const { promise } = useStorageFileUrl(imageRef);
    const imageUrl = await promise.value;
    if (imageUrl !== null) {
      imageUrls.value.push(imageUrl);
    }
  });

  await Promise.all(promises);
  doneLoading.value = true;
});

const imageUrls = ref<Array<string>>([]);
const doneLoading = ref(false);
</script>

<template>
  <UModal>
    <UProgress v-if="doneLoading === false" animation="carousel" />
    <div
      v-if="doneLoading === true"
      class="flex items-center justify-center w-full"
    >
      <p v-if="imageUrls.length === 0" class="mt-4 mb-4 text-red-400 text-xl">
        Failed to get image
      </p>
      <UCarousel
        v-if="imageUrls.length !== 0"
        :items="imageUrls"
        :ui="{
          item: 'basis-full',
          container: 'rounded-lg',
          indicators: {
            wrapper: 'relative bottom-0 mt-4',
          },
        }"
        :prev-button="{
          color: 'primary',
          icon: 'i-heroicons-arrow-left-20-solid',
          class: '-left-12',
        }"
        :next-button="{
          color: 'primary',
          icon: 'i-heroicons-arrow-right-20-solid',
          class: '-right-12',
        }"
        arrows
        indicators
        class="max-w-96 mx-auto mt-4 mb-4 ml-4 mr-4"
      >
        <template #default="{ item }">
          <NuxtImg
            :src="item"
            class="w-full"
            draggable="false"
            loading="lazy"
          />
        </template>

        <template #indicator="{ onClick, page, active }">
          <UButton
            :label="String(page)"
            :variant="active ? 'solid' : 'outline'"
            size="2xs"
            class="rounded-full min-w-6 justify-center"
            @click="onClick(page)"
          />
        </template>
      </UCarousel>
    </div>
  </UModal>
</template>
