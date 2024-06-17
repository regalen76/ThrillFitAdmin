<script lang="ts" setup>
import type { GoalType } from "~/types";
import type { PropType } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";

const toast = useToast();
const storage = useFirebaseStorage();
const db = useFirestore();

const props = defineProps({
  goalTypeData: {
    type: Object as PropType<GoalType>,
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
const goalTypeImage = ref<string>(props.goalTypeData.goal_type_image);

const emit = defineEmits(["success"]);
function onSuccess() {
  emit("success");
}

const schema = object({
  goalTypeName: string().required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  goalTypeName: props.goalTypeData.goal_type_name,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  useLoadingIndicator().start();
  toast.add({
    title: "Editing Goal Type Data",
  });

  const postsRef = doc(db, "goal_types", props.goalTypeData.id);
  try {
    await updateDoc(postsRef, {
      goal_type_name: event.data.goalTypeName,
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
    title: "Finished Editing Goal Type Data",
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

  await deleteImage(goalTypeImage.value);

  const target = event.target as HTMLInputElement;
  if (target.files) {
    imageFile = Array.from(target.files)[0];
    const imagePath =
      imageName.value !== ""
        ? imageName.value + "." + imageFile.type.split("/")[1]
        : imageFile.name;
    contentString = imagePath;

    const { upload } = useStorageFile(
      storageRef(storage, "goal-types/" + imagePath)
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
      title: "Finished Uploading Images, Next Updating Goal Type Data",
    });

    const postsRef = doc(db, "goal_types", props.goalTypeData.id);
    try {
      await updateDoc(postsRef, {
        goal_type_image: contentString,
      });
    } catch (e: any) {
      toast.add({
        title: "Error",
        description: e.message,
      });
      useLoadingIndicator().finish();
      return;
    }
    goalTypeImage.value = contentString;
    toast.add({
      title: "Finished Updating Goal Type Data",
    });
  }

  useLoadingIndicator().finish();
};

async function deleteImage(path: string) {
  toast.add({
    title: "Deleting Old Image",
  });
  const feedsRef = storageRef(storage, `goal-types/${path}`);
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
    title: "Finished Deleting Image, Next Uploading New Image",
  });
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
                    Edit Goal Type Data
                  </p>
                </template>

                <UFormGroup label="Goal Type Name" name="goalTypeName">
                  <UInput v-model="state.goalTypeName" />
                </UFormGroup>

                <template #footer>
                  <UButton type="submit" color="black">
                    Edit Goal Type
                  </UButton>
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
                  Edit Goal Type Image
                </p>
              </template>

              <UFormGroup
                label="Image Name (if empty, will use file name)"
                name="imageName"
              >
                <UInput v-model="imageName" />
              </UFormGroup>
              <div
                class="w-full flex flex-row border-gray-800 border-2 border-solid rounded-lg p-4 items-center mt-4"
              >
                <div>
                  <span> {{ goalTypeImage }} </span>
                </div>

                <div class="ml-auto">
                  <UTooltip text="Change Image">
                    <input
                      ref="imageInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleImageInputChange"
                    />
                    <UIcon
                      class="w-8 h-8 hover:text-primary text-gray-300 text-center hover:cursor-pointer ml-auto"
                      name="i-heroicons-pencil-square-16-solid"
                      @click="selectImages"
                    />
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
