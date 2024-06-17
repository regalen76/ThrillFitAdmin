<template>
  <div ref="contentEl" class="w-full h-full">
    <div class="flex flex-row bg-gray-900 rounded-tl-2xl">
      <div class="flex px-3 py-3.5 dark:border-gray-700">
        <UInput v-model="authorInput" placeholder="Filter author..." />
      </div>
      <div class="flex items-center ml-2">
        <UPopover
          class="flex items-center"
          mode="hover"
          :popper="{ placement: 'top' }"
        >
          <UIcon
            class="w-6 h-6 hover:text-primary text-center hover:cursor-pointer"
            name="i-heroicons-document-plus-solid"
            @click="isOpenCreateDocModal = true"
          />

          <template #panel>
            <div class="p-4">
              <p class="text-center" style="white-space: initial">
                Add Firebase Document
              </p>
            </div>
          </template>
        </UPopover>

        <UModal v-model="isOpenCreateDocModal">
          <div class="p-4">
            <UForm
              :schema="createPostSchema"
              :state="createPostState"
              class="space-y-4"
              @submit="onUploadPost"
            >
              <UFormGroup label="Image Post" name="imageFile">
                <UInput
                  ref="imageUpload"
                  v-model="createPostState.imageFile"
                  type="file"
                  size="md"
                  icon="i-heroicons-folder"
                  multiple
                  accept="image/*"
                />
              </UFormGroup>
              <UFormGroup label="Post Body" name="body">
                <UInput v-model="createPostState.body" />
              </UFormGroup>

              <UButton type="submit"> Upload Post </UButton>
            </UForm>
          </div>
        </UModal>
      </div>
      <div class="flex items-center ml-auto mr-4">
        <p>{{ feeds.length }} data</p>
      </div>
    </div>
    <div
      v-if="height"
      class="overflow-auto relative"
      :style="{ width: width + 'px', height: height - 60 + 'px' }"
    >
      <UTable
        :rows="filteredRows"
        :loading="pending"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
        :progress="{ color: 'primary', animation: 'carousel' }"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        :columns="columns"
        :ui="{
          wrapper: 'h-full',
          thead: 'sticky top-0 z-10 bg-gray-900 border-t-[1px] border-gray-400',
          th: {
            base: 'sticky top-0 m-0',
          },
          td: { base: 'max-w-[10rem] truncate border-b-2 border-gray-400' },
        }"
      >
        <template #timestamp-data="{ row }">
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <span>{{ row.timestamp.toDate() }}</span>

            <template #panel>
              <div class="p-4 w-[50rem]">
                <p class="text-center" style="white-space: initial">
                  {{ row.timestamp.toDate() }}
                </p>
              </div>
            </template>
          </UPopover>
        </template>
        <template #author-data="{ row }">
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <span>{{ row.author }}</span>

            <template #panel>
              <div class="p-4 w-[50rem]">
                <p class="text-center" style="white-space: initial">
                  {{ row.author }}
                </p>
              </div>
            </template>
          </UPopover>
        </template>
        <template #content-data="{ row }">
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <span>{{ row.content }}</span>

            <template #panel>
              <div class="p-4 w-[50rem]">
                <p class="text-center" style="white-space: initial">
                  {{ row.content }}
                </p>
              </div>
            </template>
          </UPopover>
        </template>
        <template #body-data="{ row }">
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <span>{{ row.body }}</span>

            <template #panel>
              <div class="p-4 w-[50rem]">
                <p class="text-center" style="white-space: initial">
                  {{ row.body }}
                </p>
              </div>
            </template>
          </UPopover>
        </template>
        <template #workout_plan-data="{ row }">
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <span>{{ row.workout_plan }}</span>

            <template #panel>
              <div class="p-4 w-[50rem]">
                <p class="text-center" style="white-space: initial">
                  {{ row.workout_plan }}
                </p>
              </div>
            </template>
          </UPopover>
        </template>
        <template #id-data="{ row }">
          <UPopover mode="hover" :popper="{ placement: 'top' }">
            <span>{{ row.id }}</span>

            <template #panel>
              <div class="p-4 w-[50rem]">
                <p class="text-center" style="white-space: initial">
                  {{ row.id }}
                </p>
              </div>
            </template>
          </UPopover>
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="tableAction(row)" :popper="{ placement: 'left' }">
            <UIcon
              class="w-6 h-6 hover:text-primary text-center hover:cursor-pointer"
              name="i-heroicons-ellipsis-horizontal-20-solid"
              @click=""
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { object, string, mixed, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import {
  collection,
  query,
  deleteDoc,
  getDocs,
  where,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import type { Posts, Post } from "~/types";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import { FeedEditModal } from "#components";

definePageMeta({
  middleware: "auth",
  layout: "dashboard-layout",
});

const contentEl = ref(null);
const { width, height } = useElementSize(contentEl);

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "timestamp",
    label: "Created Date",
  },
  {
    key: "author",
    label: "Author",
  },
  {
    key: "content",
    label: "Image Content",
  },
  {
    key: "body",
    label: "Post Text Body",
  },
  {
    key: "workout_plan",
    label: "Workout Plan",
  },
  { key: "actions" },
];
const authorInput = ref("");
const filteredRows = computed(() => {
  if (!authorInput.value) {
    return feeds.value;
  }

  return feeds.value.filter((feed) => {
    return Object.values(feed).some((value) => {
      return String(value)
        .toLowerCase()
        .includes(authorInput.value.toLowerCase());
    });
  });
});
const tableAction = (row: any) => [
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        deleteFeeds(row);
      },
    },
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        openEditModal(row);
      },
    },
  ],
];

async function deleteFeeds(row: any) {
  useLoadingIndicator().start();
  //delete the images in content
  toast.add({
    title: "Deleting Images",
  });
  for (const id of row.content) {
    const feedsRef = storageRef(storage, `feeds/${id}`);
    try {
      await deleteObject(feedsRef);
    } catch (e: any) {
      toast.add({
        title: `Error deleting image: ${id}`,
        description: e.message,
      });
      return;
    }
  }
  toast.add({
    title: "Finished Deleting Images, Next Deleting Likes",
  });
  //delete likes
  try {
    const feedsLikeQuery = query(
      collection(db, "post_likes"),
      where("post_id", "==", row.id)
    );
    const querySnapshot = await getDocs(feedsLikeQuery);
    for (const docSnapshot of querySnapshot.docs) {
      await deleteDoc(doc(db, "post_likes", docSnapshot.id));
    }
    toast.add({
      title: "Finished Deleting Likes, Next Deleting Comments",
    });
  } catch (error: any) {
    toast.add({
      title: "Error deleting likes",
      description: error.message,
    });
    return;
  }

  //delete comments
  try {
    const feedsCommentQuery = query(
      collection(db, "post_comments"),
      where("post_id", "==", row.id)
    );
    const querySnapshot = await getDocs(feedsCommentQuery);
    for (const docSnapshot of querySnapshot.docs) {
      await deleteDoc(doc(db, "post_comments", docSnapshot.id));
    }
    toast.add({
      title: "Finished Deleting Comments, Next Deleting Post",
    });
  } catch (error: any) {
    toast.add({
      title: "Error deleting Comments",
      description: error.message,
    });
    return;
  }

  //delete post
  try {
    await deleteDoc(doc(db, "posts", row.id));
    toast.add({
      title: "Finished Deleting " + row.id + " post",
    });
  } catch (e: any) {
    toast.add({
      title: "Error deleting Post",
      description: e.message,
    });
    return;
  }
  useLoadingIndicator().finish();
}

const imageUpload = ref<any>(null);
const isOpenCreateDocModal = ref(false);
const createPostSchema = object().shape({
  imageFile: mixed().required("Image File is required"),
  body: string().required("Post body is required"),
});
type CreatePostSchema = InferType<typeof createPostSchema>;
const createPostState = reactive({
  imageFile: undefined,
  body: undefined,
});
async function onUploadPost(event: FormSubmitEvent<CreatePostSchema>) {
  useLoadingIndicator().start();
  const imageList: FileList = imageUpload.value.input.files;
  const storage = useFirebaseStorage();
  const contentStringList: string[] = [];

  toast.add({
    title: "Uploading Images",
  });
  for (const image of imageList) {
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
      return;
    }
  }
  toast.add({
    title: "Finished Uploading Images, Next Creating Post Data",
  });

  const postsRef = doc(db, "posts", uuidV4());
  try {
    await setDoc(postsRef, {
      author: "bUNdkuD1H6SXDdqtpNmMaworI0F2",
      body: event.data.body,
      content: contentStringList,
      timestamp: Timestamp.fromDate(new Date()),
    });
  } catch (e: any) {
    toast.add({
      title: "Error",
      description: e.message,
    });
  }
  toast.add({
    title: "Finished Creating Post Data",
  });
  isOpenCreateDocModal.value = false;
  useLoadingIndicator().finish();
}

const db = useFirestore();
const storage = useFirebaseStorage();
const toast = useToast();

const feedsDataQuery = query(collection(db, "posts"));

const { data: feeds, pending } = useCollection<Posts>(feedsDataQuery);

const modal = useModal();
const count = ref(0);

function openEditModal(postData: Post) {
  count.value += 1;
  modal.open(FeedEditModal, {
    postData: postData,
    onSuccess() {
      modal.close();
    },
  });
}
</script>

<style></style>
