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
              <div class="p-4">create</div>
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
              <div class="p-4">create</div>
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
              <div class="p-4">create</div>
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
            <template #movement_count-data="{ row }">
              <UPopover mode="hover" :popper="{ placement: 'top' }">
                <span>{{ row.movement_count }}</span>

                <template #panel>
                  <div class="p-4 w-[50rem]">
                    <p class="text-center" style="white-space: initial">
                      {{ row.movement_count }}
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
import type { GoalTypes, TrainingSetMovements, TrainingSets } from "~/types";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { v4 as uuidV4 } from "uuid";

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
    key: "movement_count",
    label: "Movement Count",
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
      click: () => {},
    },
  ],
];
const tableAction2 = (row: any) => [
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {},
    },
  ],
];
const tableAction3 = (row: any) => [
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {},
    },
  ],
];
</script>

<style></style>
