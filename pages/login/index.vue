<template>
  <UContainer class="flex min-h-dvh items-center justify-center">
    <div class="w-full max-w-[340px]">
      <div class="text-center">
        <h1 class="text-3xl font-semibold lg:text-4xl">Sign In</h1>
      </div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit"> Sign In </UButton>
      </UForm>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

definePageMeta({
  middleware: "already-logged-in",
});

const toast = useToast();
const auth = useFirebaseAuth();
const db = useFirestore();

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});
type Schema = InferType<typeof schema>;
const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Loading...",
    description: "We are signing you in",
  });
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth!,
      event.data.email,
      event.data.password
    );
    const userDoc = doc(db, "admin_info", userCredential.user.uid);
    toast.add({
      title: "Checking your permission",
    });
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
      // User is an admin
      toast.add({
        title: "Logged In",
      });
      return await navigateTo("/home", { replace: true });
    } else {
      // User is not an admin
      toast.add({
        title: "You do not have access to this website.",
      });
      await signOut(auth!);
    }
  } catch (e: any) {
    toast.add({
      title: "Error",
      description: e.message,
    });
  }
}
</script>

<style></style>
