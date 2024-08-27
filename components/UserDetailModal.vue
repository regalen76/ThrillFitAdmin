<script lang="ts" setup>
import { collection, doc, query, where } from "firebase/firestore";
import type { UserInfo, UserInfos } from "~/types";

const db = useFirestore();

const props = defineProps({
  uid: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["success"]);
function onSuccess() {
  emit("success");
}

onMounted(async () => {
  const { promise } = useDocument<UserInfos>(
    doc(collection(db, "user_info"), props.uid),
    {
      once: true,
    }
  );

  promise.value.then((data) => {
    if (data !== undefined) {
      userData.value = {
        id: data?.id ? data.id : "",
        age: data?.age ? data.age : "",
        challenge_wins: data?.challenge_wins ? data.challenge_wins : 0,
        consecutive_workout: data?.consecutive_workout
          ? data.consecutive_workout
          : 0,
        email: data?.email ? data.email : "",
        followers: data?.followers ? data.followers : 0,
        gender: data?.gender ? data.gender : "",
        height: data?.height ? data.height : 0,
        name: data?.name ? data.name : "",
        name_search: data?.name_search ? data.name_search : [],
        phone: data?.phone ? data.phone : "",
        weight: data?.weight ? data.weight : 0,
      };
    }
    doneLoading.value = true;
  });
});

const userData = ref<UserInfo | undefined>(undefined);
const doneLoading = ref(false);
</script>

<template>
  <UModal>
    <UProgress v-if="doneLoading === false" animation="carousel" />
    <div
      v-if="doneLoading === true"
      class="flex justify-center w-full flex-col p-4 gap-2"
    >
      <p>name: {{ userData?.name }}</p>
      <p>id: {{ userData?.id }}</p>
      <p>challenge wins: {{ userData?.challenge_wins }}</p>
      <p>consecutive_workout: {{ userData?.consecutive_workout }}</p>
      <p>age: {{ userData?.age }}</p>
      <p>email: {{ userData?.email }}</p>
      <p>followers: {{ userData?.followers }}</p>
      <p>gender: {{ userData?.gender }}</p>
      <p>height: {{ userData?.height }}</p>
      <p>name_search: {{ userData?.name_search }}</p>
      <p>phone: {{ userData?.phone }}</p>
      <p>weight: {{ userData?.weight }}</p>
    </div>
  </UModal>
</template>
