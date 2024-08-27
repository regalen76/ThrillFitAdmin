<script lang="ts" setup>
import type { TrainingSetMovement, TrainingSets } from "~/types";
import type { PropType } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { doc, updateDoc, query, collection } from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";

const toast = useToast();
const storage = useFirebaseStorage();
const db = useFirestore();

const props = defineProps({
  movementData: {
    type: Object as PropType<TrainingSetMovement>,
    required: true,
  },
});
const items = [
  {
    slot: "data",
    label: "Data",
  },
  {
    slot: "image",
    label: "Image",
  },
];
const imageName = ref<string>("");
const movementImage = ref<string>(props.movementData.movement_image);

const schema = object({
  movementName: string().required("Required"),
  trainingSetId: string().required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  movementName: props.movementData.movement_name,
  trainingSetId: props.movementData.training_set_id,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  useLoadingIndicator().start();
  toast.add({
    title: "Editing Workout Movement Data",
  });

  const postsRef = doc(db, "training_set_movements", props.movementData.id);
  try {
    await updateDoc(postsRef, {
      movement_name: event.data.movementName,
      training_set_id: event.data.trainingSetId,
    });
  } catch (e: any) {
    toast.add({
      title: "Error",
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Editing Workout Movement Data",
  });
  useLoadingIndicator().finish();
}

const imageInput = ref<HTMLInputElement | null>(null);

function selectImages() {
  if (imageInput.value) {
    imageInput.value.click();
  }
}

const handleImageInputChange = async (event: Event) => {
  useLoadingIndicator().start();
  let imageFile: File | null = null;
  let contentString: string = "";

  await deleteImage(movementImage.value);

  const target = event.target as HTMLInputElement;
  if (target.files) {
    imageFile = Array.from(target.files)[0];
    const imagePath =
      imageName.value !== "" ? imageName.value + ".glb" : imageFile.name;
    contentString = imagePath;

    const { upload } = useStorageFile(
      storageRef(storage, "workout/" + imagePath)
    );
    try {
      await upload(imageFile);
    } catch (e: any) {
      toast.add({
        title: "Error",
        description: e.message,
      });
      useLoadingIndicator().finish();
      return;
    }
    toast.add({
      title:
        "Finished Uploading New 3D Model, Next Updating Workout Movement Data",
    });

    const postsRef = doc(db, "training_set_movements", props.movementData.id);
    try {
      await updateDoc(postsRef, {
        movement_image: contentString,
      });
    } catch (e: any) {
      toast.add({
        title: "Error",
        description: e.message,
      });
      useLoadingIndicator().finish();
      return;
    }
    movementImage.value = contentString;
    toast.add({
      title: "Finished Updating Workout Movement Data",
    });
  }

  useLoadingIndicator().finish();
};

async function deleteImage(path: string) {
  toast.add({
    title: "Deleting Old 3D Model",
  });
  const feedsRef = storageRef(storage, `workout/${path}`);
  try {
    await deleteObject(feedsRef);
  } catch (e: any) {
    toast.add({
      title: `Error deleting 3D Model: ${path}`,
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Deleting 3D Model, Next Uploading New 3D Model",
  });
}

const trainingSetQuery = query(collection(db, "training_sets"));
const { data: trainingSets, pending } = useCollection<TrainingSets>(trainingSetQuery);

function selectTrainingSetAdd(id: string) {
  state.trainingSetId = id
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="space-y-2">
        <UTabs :items="items" class="w-full">
          <template #data="{ item }">
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
              <UCard>
                <template #header>
                  <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    {{ item.label }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Edit Workout Move Data
                  </p>
                </template>

                <UFormGroup label="Movement Name" name="movementName">
                  <UInput v-model="state.movementName" />
                </UFormGroup>
                <UFormGroup name="trainingSetId">
                  <template #label>
                    <div class="flex">
                      <span>Training Set Id</span>
                      <UPopover class="ml-2" mode="click" :popper="{ placement: 'left' }">
                        <UIcon class="w-6 h-6 hover:text-primary text-center hover:cursor-pointer ml-auto"
                          name="i-heroicons-list-bullet" />

                        <template #panel>
                          <div class="p-4">
                            <UProgress v-if="pending === true" animation="carousel" />
                            <div v-if="pending === false">
                              <span>Goal Type Name</span>
                              <div class="bg-white h-1 w-full mt-2 mb-2" />
                              <div v-for="data in trainingSets">
                                <div class="hover:text-primary cursor-pointer" @click="selectTrainingSetAdd(data.id)">
                                  <span>{{ data.training_set_name }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </UPopover>
                    </div>
                  </template>
                  <UInput v-model="state.trainingSetId" />
                </UFormGroup>

                <template #footer>
                  <UButton type="submit" color="black">
                    Edit Workout Movement
                  </UButton>
                </template>
              </UCard>
            </UForm>
          </template>

          <template #image="{ item }">
            <UCard>
              <template #header>
                <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Edit Workout Move Image
                </p>
              </template>

              <UFormGroup label="3D Model File Name (if empty, will use file name)" name="imageName">
                <UInput v-model="imageName" />
              </UFormGroup>
              <div class="w-full flex flex-row border-gray-800 border-2 border-solid rounded-lg p-4 items-center mt-4">
                <div>
                  <span> {{ movementImage }} </span>
                </div>

                <div class="ml-auto">
                  <UTooltip text="Change 3D Model">
                    <input ref="imageInput" type="file" accept=".glb" class="hidden" @change="handleImageInputChange" />
                    <UIcon class="w-8 h-8 hover:text-primary text-gray-300 text-center hover:cursor-pointer ml-auto"
                      name="i-heroicons-pencil-square-16-solid" @click="selectImages" />
                  </UTooltip>
                </div>
              </div>
            </UCard>
          </template>
        </UTabs>
      </div>
    </UCard>
  </UModal>
</template>
