<script lang="ts" setup>
import type { Post } from "~/types";
import type { PropType } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { object, string, date as dated, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import {
  collection,
  query,
  deleteDoc,
  getDocs,
  where,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";

const toast = useToast();
const storage = useFirebaseStorage();
const db = useFirestore();

const props = defineProps({
  postData: {
    type: Object as PropType<Post>,
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
const contents = ref<string[]>(props.postData.content);

const emit = defineEmits(["success"]);
function onSuccess() {
  emit("success");
}

const schema = object({
  createdDate: dated().required("Required"),
  author: string().required("Required"),
  postTextBody: string().required("Required"),
  workoutPlan: string().nullable(),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  createdDate: props.postData.timestamp.toDate(),
  author: props.postData.author,
  postTextBody: props.postData.body,
  workoutPlan: props.postData.workout_plan,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  useLoadingIndicator().start();
  toast.add({
    title: "Editing Post Data",
  });

  const postsRef = doc(db, "posts", props.postData.id);
  try {
    await updateDoc(postsRef, {
      author: event.data.author,
      body: event.data.postTextBody,
      timestamp: Timestamp.fromDate(event.data.createdDate),
      workout_plan: event.data.workoutPlan,
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
    title: "Finished Editing Post Data",
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
  let imageFiles: File[] = [];
  const contentStringList: string[] = [];

  const target = event.target as HTMLInputElement;
  if (target.files) {
    imageFiles = Array.from(target.files);
    toast.add({
      title: "Uploading Images",
    });
    for (const image of imageFiles) {
      const imagePath = uuidV4() + "." + image.type.split("/")[1];
      contentStringList.push(imagePath);

      const { upload } = useStorageFile(
        storageRef(storage, "feeds/" + imagePath)
      );
      try {
        await upload(image);
      } catch (e: any) {
        toast.add({
          title: "Error",
          description: e.message,
        });
        useLoadingIndicator().finish();
        return;
      }
    }
    toast.add({
      title: "Finished Uploading Images, Next Updating Post Data",
    });

    const postsRef = doc(db, "posts", props.postData.id);
    contents.value.push(...contentStringList);
    try {
      await updateDoc(postsRef, {
        content: contents.value,
      });
    } catch (e: any) {
      contents.value.splice(
        -contentStringList.length,
        contentStringList.length
      );
      toast.add({
        title: "Error",
        description: e.message,
      });
      useLoadingIndicator().finish();
      return;
    }
    toast.add({
      title: "Finished Updating Post Data",
    });
  }

  useLoadingIndicator().finish();
};

async function deleteImage(path: string) {
  useLoadingIndicator().start();
  toast.add({
    title: "Deleting Images",
  });
  const feedsRef = storageRef(storage, `feeds/${path}`);
  try {
    await deleteObject(feedsRef);
  } catch (e: any) {
    toast.add({
      title: `Error deleting image: ${path}`,
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Deleting Image, Next Updating Post Data",
  });

  const postsRef = doc(db, "posts", props.postData.id);
  let indexToRemove = contents.value.indexOf(path);
  if (indexToRemove !== -1) {
    contents.value.splice(indexToRemove, 1);
  } else {
    toast.add({
      title: "Error",
      description: "Failed to find index",
    });
    useLoadingIndicator().finish();
    return;
  }
  try {
    await updateDoc(postsRef, {
      content: contents.value,
    });
  } catch (e: any) {
    contents.value.push(path);
    toast.add({
      title: "Error",
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Updating Post Data",
  });
  useLoadingIndicator().finish();
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="space-y-2">
        <UTabs :items="items" class="w-full">
          <template #data="{ item }">
            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onSubmit"
            >
              <UCard>
                <template #header>
                  <p
                    class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                  >
                    {{ item.label }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Edit Post Data
                  </p>
                </template>

                <UFormGroup label="Created Date" name="createdDate">
                  <VueDatePicker v-model="state.createdDate" :dark="true" />
                </UFormGroup>

                <UFormGroup label="Author" name="author">
                  <UInput v-model="state.author" />
                </UFormGroup>

                <UFormGroup label="Post Text Body" name="postTextBody">
                  <UInput v-model="state.postTextBody" />
                </UFormGroup>

                <UFormGroup label="Workout Plan (Nullable)" name="workoutPlan">
                  <UInput v-model="state.workoutPlan" />
                </UFormGroup>

                <template #footer>
                  <UButton type="submit" color="black"> Edit Post </UButton>
                </template>
              </UCard>
            </UForm>
          </template>

          <template #image="{ item }">
            <UCard>
              <template #header>
                <p
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Edit Post Image
                </p>
              </template>

              <div class="flex flex-col gap-4">
                <div
                  v-for="content in contents"
                  class="w-full flex flex-row border-gray-800 border-2 border-solid rounded-lg p-4 items-center"
                >
                  <div>
                    <span> {{ content }} </span>
                  </div>

                  <UTooltip text="Delete Image">
                    <UIcon
                      class="w-6 h-6 hover:text-primary text-red-600 text-center hover:cursor-pointer ml-auto"
                      name="i-heroicons-trash-20-solid"
                      @click="deleteImage(content)"
                    />
                  </UTooltip>
                </div>
              </div>

              <template #footer>
                <div class="w-full flex justify-center">
                  <UTooltip text="Add Image">
                    <input
                      ref="imageInput"
                      type="file"
                      accept="image/*"
                      multiple
                      class="hidden"
                      @change="handleImageInputChange"
                    />
                    <UIcon
                      class="w-12 h-12 hover:text-primary text-gray-300 text-center hover:cursor-pointer ml-auto"
                      name="i-heroicons-plus-circle"
                      @click="selectImages"
                    />
                  </UTooltip>
                </div>
              </template>
            </UCard>
          </template>
        </UTabs>
      </div>
    </UCard>
  </UModal>
</template>
