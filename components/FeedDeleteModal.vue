<template>
  <UModal>
    <div class="p-4">
      <UContainer class="h-48">
        <div class="flex w-full h-full items-center justify-center flex-col">
          <h3>Are you sure you want to delete this data?</h3>
          <div class="flex flex-row mt-4">
            <div class="mr-4 w-20">
              <UButton v-if="type === 1" block @click="deleteFeeds"
                >Yes</UButton
              >
              <UButton v-if="type === 2" block @click="deleteGoalType"
                >Yes</UButton
              >
              <UButton v-if="type === 3" block @click="deleteTrainingSet"
                >Yes</UButton
              >
              <UButton v-if="type === 4" block @click="deleteWorkoutMove"
                >Yes</UButton
              >
            </div>
            <div class="w-20">
              <UButton block @click="closeModal">No</UButton>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import { deleteObject, ref as storageRef } from "firebase/storage";
import type {
  Post,
  GoalType,
  TrainingSet,
  TrainingSetMovement,
  WorkoutPlanMovesets,
} from "~/types";
import type { PropType } from "vue";
import {
  collection,
  query,
  deleteDoc,
  getDocs,
  where,
  doc,
} from "firebase/firestore";

const emit = defineEmits(["closed"]);

function closeModal() {
  emit("closed");
}

const props = defineProps({
  postData: {
    type: Object as PropType<
      Post | GoalType | TrainingSet | TrainingSetMovement
    >,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
});

const toast = useToast();
const db = useFirestore();
const storage = useFirebaseStorage();

async function deleteFeeds() {
  useLoadingIndicator().start();
  //delete the images in content
  toast.add({
    title: "Deleting Images",
  });
  const data = props.postData as Post;
  for (const id of data.content) {
    const feedsRef = storageRef(storage, `feeds/${id}`);
    try {
      await deleteObject(feedsRef);
    } catch (e: any) {
      toast.add({
        title: `Error deleting image: ${id}`,
        description: e.message,
      });

      useLoadingIndicator().finish();
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
      where("post_id", "==", data.id)
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
    useLoadingIndicator().finish();
    return;
  }

  //delete comments
  try {
    const feedsCommentQuery = query(
      collection(db, "post_comments"),
      where("post_id", "==", data.id)
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
    useLoadingIndicator().finish();
    return;
  }

  //delete post
  try {
    await deleteDoc(doc(db, "posts", data.id));
    toast.add({
      title: "Finished Deleting " + data.id + " post",
    });
  } catch (e: any) {
    toast.add({
      title: "Error deleting Post",
      description: e.message,
    });
    useLoadingIndicator().finish();
    return;
  }
  useLoadingIndicator().finish();
}

async function deleteGoalType() {
  useLoadingIndicator().start();
  const row = props.postData as GoalType;
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
}

async function deleteTrainingSet() {
  useLoadingIndicator().start();
  const row = props.postData as TrainingSet;

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
}

async function deleteWorkoutMove() {
  useLoadingIndicator().start();
  const row = props.postData as TrainingSetMovement;
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
</script>

<style></style>
