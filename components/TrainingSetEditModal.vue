<script lang="ts" setup>
import type { TrainingSet } from "~/types";
import type { PropType } from "vue";
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { doc, updateDoc } from "firebase/firestore";

const toast = useToast();
const db = useFirestore();

const props = defineProps({
  trainingSetData: {
    type: Object as PropType<TrainingSet>,
    required: true,
  },
});

const emit = defineEmits(["success"]);
function onSuccess() {
  emit("success");
}

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
</script>

<template>
  <UModal>
    <UCard>
      <div class="space-y-2">
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
                Data
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Edit Training Set Data
              </p>
            </template>

            <UFormGroup label="Goal Type Id" name="goalTypeId">
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
