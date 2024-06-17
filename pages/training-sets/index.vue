<template>
  <div ref="contentEl" class="w-full h-full">
    <UTabs :items="tabItems" class="w-full">
      <template #tablegoaltype="{ item }">
        <div class="flex flex-row bg-gray-900 rounded-tl-2xl">
          <div class="flex px-3 py-3.5 dark:border-gray-700">
            <UInput
              v-model="goalNameInput"
              placeholder="Filter goal type name..."
            />
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
                  :schema="createGoalTypeSchema"
                  :state="createGoalTypeState"
                  class="space-y-4"
                  @submit="onUploadGoalType"
                >
                  <UFormGroup label="Goal Type Name" name="goalTypeName">
                    <UInput v-model="createGoalTypeState.goalTypeName" />
                  </UFormGroup>
                  <UFormGroup label="Goal Type Image" name="goalTypeImage">
                    <UInput
                      ref="imageUploadGoalType"
                      v-model="createGoalTypeState.goalTypeImage"
                      type="file"
                      size="md"
                      icon="i-heroicons-folder"
                      accept="image/*"
                    />
                  </UFormGroup>
                  <UFormGroup label="Image Name" name="imageName">
                    <UInput v-model="createGoalTypeState.imageName" />
                  </UFormGroup>

                  <UButton type="submit"> Upload Goal Type </UButton>
                </UForm>
              </div>
            </UModal>
          </div>
          <div class="flex items-center ml-auto mr-4">
            <p>{{ goalTypes.length }} data</p>
          </div>
        </div>
        <div
          v-if="height"
          class="overflow-auto relative"
          :style="{ width: width + 'px', height: height - 108 + 'px' }"
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
              thead:
                'sticky top-0 z-10 bg-gray-900 border-t-[1px] border-gray-400',
              th: {
                base: 'sticky top-0 m-0',
              },
              td: { base: 'max-w-[10rem] truncate border-b-2 border-gray-400' },
            }"
          >
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
            <template #goal_type_name-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.goal_type_name }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.goal_type_name }}
                    </p>
                  </div>
                </template>
              </UPopover>
            </template>
            <template #goal_type_image-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.goal_type_image }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.goal_type_image }}
                    </p>
                  </div>
                </template>
              </UPopover>
            </template>
            <template #actions-data="{ row }">
              <UDropdown
                :items="tableAction(row)"
                :popper="{ placement: 'left' }"
              >
                <UIcon
                  class="w-6 h-6 hover:text-primary text-center hover:cursor-pointer"
                  name="i-heroicons-ellipsis-horizontal-20-solid"
                  @click=""
                />
              </UDropdown>
            </template>
          </UTable>
        </div>
      </template>

      <template #tabletrainingset="{ item }">
        <div class="flex flex-row bg-gray-900 rounded-tl-2xl">
          <div class="flex px-3 py-3.5 dark:border-gray-700">
            <UInput
              v-model="trainingSetNameInput"
              placeholder="Filter training set name..."
            />
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
                @click="isOpenCreateDocModal2 = true"
              />

              <template #panel>
                <div class="p-4">
                  <p class="text-center" style="white-space: initial">
                    Add Firebase Document
                  </p>
                </div>
              </template>
            </UPopover>

            <UModal v-model="isOpenCreateDocModal2">
              <div class="p-4">
                <UForm
                  :schema="createTrainingSetSchema"
                  :state="createTrainingSetState"
                  class="space-y-4"
                  @submit="onUploadTrainingSet"
                >
                  <UFormGroup label="Goal Type Id" name="goalTypeId">
                    <UInput v-model="createTrainingSetState.goalTypeId" />
                  </UFormGroup>
                  <UFormGroup label="Training Set Name" name="trainingSetName">
                    <UInput v-model="createTrainingSetState.trainingSetName" />
                  </UFormGroup>

                  <UButton type="submit"> Upload Goal Type </UButton>
                </UForm>
              </div>
            </UModal>
          </div>
          <div class="flex items-center ml-auto mr-4">
            <p>{{ trainingSets.length }} data</p>
          </div>
        </div>
        <div
          v-if="height"
          class="overflow-auto relative"
          :style="{ width: width + 'px', height: height - 108 + 'px' }"
        >
          <UTable
            :rows="filteredRows2"
            :loading="pending2"
            :loading-state="{
              icon: 'i-heroicons-arrow-path-20-solid',
              label: 'Loading...',
            }"
            :progress="{ color: 'primary', animation: 'carousel' }"
            :empty-state="{
              icon: 'i-heroicons-circle-stack-20-solid',
              label: 'No items.',
            }"
            :columns="columns2"
            :ui="{
              wrapper: 'h-full',
              thead:
                'sticky top-0 z-10 bg-gray-900 border-t-[1px] border-gray-400',
              th: {
                base: 'sticky top-0 m-0',
              },
              td: { base: 'max-w-[10rem] truncate border-b-2 border-gray-400' },
            }"
          >
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
            <template #goal_type_id-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.goal_type_id }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.goal_type_id }}
                    </p>
                  </div>
                </template>
              </UPopover>
            </template>
            <template #training_set_name-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.training_set_name }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.training_set_name }}
                    </p>
                  </div>
                </template>
              </UPopover>
            </template>
            <template #actions-data="{ row }">
              <UDropdown
                :items="tableAction2(row)"
                :popper="{ placement: 'left' }"
              >
                <UIcon
                  class="w-6 h-6 hover:text-primary text-center hover:cursor-pointer"
                  name="i-heroicons-ellipsis-horizontal-20-solid"
                  @click=""
                />
              </UDropdown>
            </template>
          </UTable>
        </div>
      </template>

      <template #tableworkoutmove="{ item }">
        <div class="flex flex-row bg-gray-900 rounded-tl-2xl">
          <div class="flex px-3 py-3.5 dark:border-gray-700">
            <UInput
              v-model="movementNameInput"
              placeholder="Filter movement name..."
            />
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
                @click="isOpenCreateDocModal3 = true"
              />

              <template #panel>
                <div class="p-4">
                  <p class="text-center" style="white-space: initial">
                    Add Firebase Document
                  </p>
                </div>
              </template>
            </UPopover>

            <UModal v-model="isOpenCreateDocModal3">
              <div class="p-4">
                <UForm
                  :schema="createWorkoutMoveSchema"
                  :state="createWorkoutMoveState"
                  class="space-y-4"
                  @submit="onUploadWorkoutMove"
                >
                  <UFormGroup label="Movement 3D File" name="movementFile">
                    <UInput
                      ref="upload3dWorkoutMove"
                      v-model="createWorkoutMoveState.file3d"
                      type="file"
                      size="md"
                      icon="i-heroicons-folder"
                      accept=".glb"
                    />
                  </UFormGroup>
                  <UFormGroup label="3d File Name" name="file3dName">
                    <UInput v-model="createWorkoutMoveState.file3dName" />
                  </UFormGroup>
                  <UFormGroup label="Movement Name" name="movementName">
                    <UInput v-model="createWorkoutMoveState.movementName" />
                  </UFormGroup>
                  <UFormGroup label="Training Set Id" name="trainingSetId">
                    <UInput v-model="createWorkoutMoveState.trainingSetId" />
                  </UFormGroup>

                  <UButton type="submit"> Upload Workout Move </UButton>
                </UForm>
              </div>
            </UModal>
          </div>
          <div class="flex items-center ml-auto mr-4">
            <p>{{ traningSetMovements.length }} data</p>
          </div>
        </div>
        <div
          v-if="height"
          class="overflow-auto relative"
          :style="{ width: width + 'px', height: height - 108 + 'px' }"
        >
          <UTable
            :rows="filteredRows3"
            :loading="pending3"
            :loading-state="{
              icon: 'i-heroicons-arrow-path-20-solid',
              label: 'Loading...',
            }"
            :progress="{ color: 'primary', animation: 'carousel' }"
            :empty-state="{
              icon: 'i-heroicons-circle-stack-20-solid',
              label: 'No items.',
            }"
            :columns="columns3"
            :ui="{
              wrapper: 'h-full',
              thead:
                'sticky top-0 z-10 bg-gray-900 border-t-[1px] border-gray-400',
              th: {
                base: 'sticky top-0 m-0',
              },
              td: { base: 'max-w-[10rem] truncate border-b-2 border-gray-400' },
            }"
          >
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
            <template #movement_image-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.movement_image }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.movement_image }}
                    </p>
                  </div>
                </template>
              </UPopover>
            </template>
            <template #movement_name-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.movement_name }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.movement_name }}
                    </p>
                  </div>
                </template>
              </UPopover>
            </template>
            <template #training_set_id-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.training_set_id }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.training_set_id }}
                    </p>
                  </div>
                </template>
              </UPopover>
            </template>
            <template #actions-data="{ row }">
              <UDropdown
                :items="tableAction3(row)"
                :popper="{ placement: 'left' }"
              >
                <UIcon
                  class="w-6 h-6 hover:text-primary text-center hover:cursor-pointer"
                  name="i-heroicons-ellipsis-horizontal-20-solid"
                  @click=""
                />
              </UDropdown>
            </template>
          </UTable>
        </div>
      </template>
    </UTabs>
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
import type {
  GoalTypes,
  TrainingSetMovements,
  TrainingSets,
  GoalType,
  TrainingSet,
  TrainingSetMovement,
  WorkoutPlanMovesets,
} from "~/types";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";
import {
  TrainingSetEditModal,
  GoalTypeEditModal,
  WorkoutMoveEditModal,
} from "#components";

definePageMeta({
  middleware: "auth",
  layout: "dashboard-layout",
});

const tabItems = [
  {
    slot: "tablegoaltype",
    label: "Table Goal Type",
  },
  {
    slot: "tabletrainingset",
    label: "Table Training Set",
  },
  {
    slot: "tableworkoutmove",
    label: "Table Workout Move",
  },
];
const modal = useModal();

const contentEl = ref(null);
const { width, height } = useElementSize(contentEl);

const isOpenCreateDocModal = ref(false);
const isOpenCreateDocModal2 = ref(false);
const isOpenCreateDocModal3 = ref(false);
const db = useFirestore();
const storage = useFirebaseStorage();
const toast = useToast();
const goalTypesQuery = query(collection(db, "goal_types"));
const trainingSetsQuery = query(collection(db, "training_sets"));
const movementsQuery = query(collection(db, "training_set_movements"));
const { data: goalTypes, pending } = useCollection<GoalTypes>(goalTypesQuery);
const { data: trainingSets, pending: pending2 } =
  useCollection<TrainingSets>(trainingSetsQuery);
const { data: traningSetMovements, pending: pending3 } =
  useCollection<TrainingSetMovements>(movementsQuery);

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "goal_type_name",
    label: "Goal Type Name",
  },
  {
    key: "goal_type_image",
    label: "Goal Type Image",
  },
  { key: "actions" },
];
const columns2 = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "goal_type_id",
    label: "Goal Type ID",
  },
  {
    key: "training_set_name",
    label: "Training Set Name",
  },
  { key: "actions" },
];
const columns3 = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "movement_image",
    label: "Movement Image",
  },
  {
    key: "movement_name",
    label: "Movement Name",
  },
  {
    key: "training_set_id",
    label: "Training Set Id",
  },
  { key: "actions" },
];
const goalNameInput = ref("");
const trainingSetNameInput = ref("");
const movementNameInput = ref("");
const filteredRows = computed(() => {
  if (!goalNameInput.value) {
    return goalTypes.value;
  }

  return goalTypes.value.filter((goalType) => {
    return Object.values(goalType).some((value) => {
      return String(value)
        .toLowerCase()
        .includes(goalNameInput.value.toLowerCase());
    });
  });
});
const filteredRows2 = computed(() => {
  if (!trainingSetNameInput.value) {
    return trainingSets.value;
  }

  return trainingSets.value.filter((trainingSet) => {
    return Object.values(trainingSet).some((value) => {
      return String(value)
        .toLowerCase()
        .includes(trainingSetNameInput.value.toLowerCase());
    });
  });
});
const filteredRows3 = computed(() => {
  if (!movementNameInput.value) {
    return traningSetMovements.value;
  }

  return traningSetMovements.value.filter((setMovement) => {
    return Object.values(setMovement).some((value) => {
      return String(value)
        .toLowerCase()
        .includes(movementNameInput.value.toLowerCase());
    });
  });
});
const tableAction = (row: any) => [
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        deleteGoalType(row);
      },
    },
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        modal.open(GoalTypeEditModal, {
          goalTypeData: row,
          onSuccess() {
            modal.close();
          },
        });
      },
    },
  ],
];
const tableAction2 = (row: any) => [
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        deleteTrainingSet(row);
      },
    },
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        modal.open(TrainingSetEditModal, {
          trainingSetData: row,
          onSuccess() {
            modal.close();
          },
        });
      },
    },
  ],
];
const tableAction3 = (row: any) => [
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        deleteWorkoutMove(row);
      },
    },
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        modal.open(WorkoutMoveEditModal, {
          movementData: row,
          onSuccess() {
            modal.close();
          },
        });
      },
    },
  ],
];

const imageUploadGoalType = ref<any>(null);
const createGoalTypeSchema = object().shape({
  goalTypeName: string().required("Goal Type Name is required"),
  goalTypeImage: mixed().required("Image File is required"),
  imageName: string().required("Image Name is required"),
});
type CreateGoalTypeSchema = InferType<typeof createGoalTypeSchema>;
const createGoalTypeState = reactive({
  goalTypeName: undefined,
  goalTypeImage: undefined,
  imageName: undefined,
});
async function onUploadGoalType(event: FormSubmitEvent<CreateGoalTypeSchema>) {
  useLoadingIndicator().start();
  const imageFile: File = imageUploadGoalType.value.input.files[0];
  let imagePathDoc: string = "";

  toast.add({
    title: "Uploading Images",
  });
  const imagePath = event.data.imageName + "." + imageFile.type.split("/")[1];
  imagePathDoc = imagePath;

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
    title: "Finished Uploading Images, Next Creating Goal Type Doc",
  });

  const goalTypeRef = doc(db, "goal_types", uuidV4());
  try {
    await setDoc(goalTypeRef, {
      goal_type_image: imagePathDoc,
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
    title: "Finished Creating Goal Type",
  });
  isOpenCreateDocModal.value = false;
  useLoadingIndicator().finish();
}

async function deleteGoalType(row: GoalType) {
  useLoadingIndicator().start();
  //delete the images
  toast.add({
    title: "Deleting Image",
  });
  const feedsRef = storageRef(storage, `goal-types/${row.goal_type_image}`);
  try {
    await deleteObject(feedsRef);
  } catch (e: any) {
    toast.add({
      title: `Error deleting image: ${row.goal_type_image}`,
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Deleting Image, Next Deleting Goal Type Doc",
  });

  try {
    await deleteDoc(doc(db, "goal_types", row.id));
  } catch (e: any) {
    toast.add({
      title: "Error deleting goal type doc",
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Deleting " + row.id + " goal type doc",
  });

  const temp: TrainingSet[] = trainingSets.value.filter(
    (trainingSet) => (trainingSet.goal_type_id = row.id)
  );
  if (temp.length !== 0) {
    deleteTrainingSetList(temp);
  }
}

const createTrainingSetSchema = object().shape({
  goalTypeId: string().required("Goal Type Id is required"),
  trainingSetName: string().required("Training Set Name is required"),
});
type CreateTrainingSetSchema = InferType<typeof createTrainingSetSchema>;
const createTrainingSetState = reactive({
  goalTypeId: undefined,
  trainingSetName: undefined,
});
async function onUploadTrainingSet(
  event: FormSubmitEvent<CreateTrainingSetSchema>
) {
  useLoadingIndicator().start();

  toast.add({
    title: "Creating Training Set",
  });
  const trainingSetRef = doc(db, "training_sets", uuidV4());
  try {
    await setDoc(trainingSetRef, {
      goal_type_id: event.data.goalTypeId,
      training_set_name: event.data.trainingSetName,
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
    title: "Finished Creating Training Set",
  });
  isOpenCreateDocModal2.value = false;
  useLoadingIndicator().finish();
}

async function deleteTrainingSet(row: TrainingSet) {
  useLoadingIndicator().start();

  try {
    await deleteDoc(doc(db, "training_sets", row.id));
  } catch (e: any) {
    toast.add({
      title: "Error deleting training set",
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Deleting " + row.id + " training set",
  });

  const temp: TrainingSetMovement[] = traningSetMovements.value.filter(
    (trainingSetMovement) => (trainingSetMovement.training_set_id = row.id)
  );
  if (temp.length !== 0) {
    deleteWorkoutMoveList(temp);
  }
}

async function deleteTrainingSetList(row: TrainingSet[]) {
  if (row.length !== 0) {
    for (const trainingSet of row) {
      try {
        await deleteDoc(doc(db, "training_sets", trainingSet.id));
      } catch (e: any) {
        toast.add({
          title: "Error deleting training set",
          description: e.message,
        });
        useLoadingIndicator().finish();
        return;
      }
    }
  }
  toast.add({
    title: "Finished Deleting training sets",
  });

  const temp: TrainingSetMovement[] = traningSetMovements.value.filter(
    (trainingSetMovement) =>
      row.some(
        (trainingSet) => trainingSet.id === trainingSetMovement.training_set_id
      )
  );
  if (temp.length !== 0) {
    deleteWorkoutMoveList(temp);
  }
}

const upload3dWorkoutMove = ref<any>(null);
const createWorkoutMoveSchema = object().shape({
  file3d: string().required("3d File is required"),
  file3dName: string().required("3d File Name is required"),
  movementName: mixed().required("Movement Name is required"),
  trainingSetId: string().required("Training Set Id is required"),
});
type CreateWorkoutMoveSchema = InferType<typeof createWorkoutMoveSchema>;
const createWorkoutMoveState = reactive({
  file3d: undefined,
  file3dName: undefined,
  movementName: undefined,
  trainingSetId: undefined,
});

async function onUploadWorkoutMove(
  event: FormSubmitEvent<CreateWorkoutMoveSchema>
) {
  useLoadingIndicator().start();
  const file3d: File = upload3dWorkoutMove.value.input.files[0];
  let file3dPathDoc: string = "";

  toast.add({
    title: "Uploading 3d File",
  });
  const file3dPath = event.data.file3dName + ".glb";
  file3dPathDoc = file3dPath;

  const { upload } = useStorageFile(
    storageRef(storage, "workout/" + file3dPath)
  );
  try {
    await upload(file3d);
  } catch (e: any) {
    toast.add({
      title: "Error",
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Uploading 3d File, Next Creating Workout Movement Doc",
  });

  const goalTypeRef = doc(db, "training_set_movements", uuidV4());
  try {
    await setDoc(goalTypeRef, {
      movement_image: file3dPathDoc,
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
    title: "Finished Creating Workout Move",
  });
  isOpenCreateDocModal3.value = false;
  useLoadingIndicator().finish();
}

async function deleteWorkoutMove(row: TrainingSetMovement) {
  useLoadingIndicator().start();
  //delete the 3d File
  toast.add({
    title: "Deleting 3d File",
  });
  const feedsRef = storageRef(storage, `workout/${row.movement_image}`);
  try {
    await deleteObject(feedsRef);
  } catch (e: any) {
    toast.add({
      title: `Error deleting 3d file: ${row.movement_image}`,
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Deleting 3d File, Next Deleting Workout Move Doc",
  });

  //delete likes
  try {
    await deleteDoc(doc(db, "training_set_movements", row.id));
  } catch (e: any) {
    toast.add({
      title: "Error deleting workout move doc",
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  toast.add({
    title: "Finished Deleting " + row.id + " workout move doc",
  });

  const { promise } = useCollection<WorkoutPlanMovesets>(
    query(
      collection(db, "workout_plan_movesets"),
      where("movement_id", "==", row.id)
    ),
    {
      once: true,
    }
  );
  promise.value.then(async (data) => {
    for (const wpm of data) {
      try {
        await deleteDoc(doc(db, "workout_plan_movesets", wpm.id));
      } catch (e: any) {
        toast.add({
          title: "Error deleting workout plan moveset doc",
          description: e.message,
        });
        useLoadingIndicator().finish();
        return;
      }
    }

    toast.add({
      title: "Finished Deleting workout plan moveset doc",
    });
  });

  useLoadingIndicator().finish();
}

async function deleteWorkoutMoveList(row: TrainingSetMovement[]) {
  if (row.length !== 0) {
    //delete the 3d File
    toast.add({
      title: "Deleting 3d Files",
    });
    for (const trainingSetMovement of row) {
      const feedsRef = storageRef(
        storage,
        `workout/${trainingSetMovement.movement_image}`
      );
      try {
        await deleteObject(feedsRef);
      } catch (e: any) {
        toast.add({
          title: `Error deleting 3d file: ${trainingSetMovement.movement_image}`,
          description: e.message,
        });
        useLoadingIndicator().finish();
        return;
      }
    }
    toast.add({
      title: "Finished Deleting 3d Files, Next Deleting Workout Move Docs",
    });

    for (const trainingSetMovement of row) {
      try {
        await deleteDoc(
          doc(db, "training_set_movements", trainingSetMovement.id)
        );
      } catch (e: any) {
        toast.add({
          title: "Error deleting workout move doc",
          description: e.message,
        });
        useLoadingIndicator().finish();
        return;
      }
    }
    toast.add({
      title: "Finished Deleting workout move docs",
    });

    const idList: string[] = row.map(
      (traningSetMovement) => traningSetMovement.id
    );
    const { promise } = useCollection<WorkoutPlanMovesets>(
      query(
        collection(db, "workout_plan_movesets"),
        where("movement_id", "in", idList)
      ),
      {
        once: true,
      }
    );
    promise.value.then(async (data) => {
      for (const wpm of data) {
        try {
          await deleteDoc(doc(db, "workout_plan_movesets", wpm.id));
        } catch (e: any) {
          toast.add({
            title: "Error deleting workout plan moveset doc",
            description: e.message,
          });
          useLoadingIndicator().finish();
          return;
        }
      }

      toast.add({
        title: "Finished Deleting workout plan moveset doc",
      });
    });
  }

  useLoadingIndicator().finish();
}
</script>

<style></style>
