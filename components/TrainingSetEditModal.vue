<script lang="ts" setup>
import type { TrainingSet, GoalTypes } from "~/types";
import type { PropType } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { doc, updateDoc, query, collection } from "firebase/firestore";

const toast = useToast();
const db = useFirestore();

const props = defineProps({
  trainingSetData: {
    type: Object as PropType<TrainingSet>,
    required: true,
  },
});

const schema = object({
  goalTypeId: string().required("Required"),
  trainingSetName: string().required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  goalTypeId: props.trainingSetData.goal_type_id,
  trainingSetName: props.trainingSetData.training_set_name,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  useLoadingIndicator().start();
  toast.add({
    title: "Editing Training Set Data",
  });

  const trainingSetRef = doc(db, "training_sets", props.trainingSetData.id);
  try {
    await updateDoc(trainingSetRef, {
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
    title: "Finished Editing Training Set Data",
  });
  useLoadingIndicator().finish();
}

const goalTypesQuery = query(collection(db, "goal_types"));
const { data: goalTypes, pending } = useCollection<GoalTypes>(goalTypesQuery);

function selectGoalTypeAdd(id: string) {
  state.goalTypeId = id
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="space-y-2">
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
          <UCard>
            <template #header>
              <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Data
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Edit Training Set Data
              </p>
            </template>

            <UFormGroup name="goalTypeId">
              <template #label>
                <div class="flex">
                  <span>Goal Type Id</span>
                  <UPopover class="ml-2" mode="click" :popper="{ placement: 'left' }">
                    <UIcon class="w-6 h-6 hover:text-primary text-center hover:cursor-pointer ml-auto"
                      name="i-heroicons-list-bullet" />

                    <template #panel>
                      <div class="p-4">
                        <UProgress v-if="pending === true" animation="carousel" />
                        <div v-if="pending === false">
                          <span>Goal Type Name</span>
                          <div class="bg-white h-1 w-full mt-2 mb-2" />
                          <div v-for="data in goalTypes">
                            <div class="hover:text-primary cursor-pointer" @click="selectGoalTypeAdd(data.id)">
                              <span>{{ data.goal_type_name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </UPopover>
                </div>
              </template>
              <UInput v-model="state.goalTypeId" />
            </UFormGroup>

            <UFormGroup label="Training Set Name" name="trainingSetName">
              <UInput v-model="state.trainingSetName" />
            </UFormGroup>

            <template #footer>
              <UButton type="submit" color="black"> Edit Training Set </UButton>
            </template>
          </UCard>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
