<template>
  <UContainer class="flex min-h-dvh items-center justify-center">
    <div class="w-full max-w-[340px]">
      <div class="text-center">
        <h1 class="text-3xl font-semibold lg:text-4xl">Create Account</h1>
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

        <UButton type="submit"> Submit </UButton>
      </UForm>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

definePageMeta({
  middleware: "already-logged-in",
});

const auth = useFirebaseAuth();

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
  const { user } = await createUserWithEmailAndPassword(
    auth!,
    event.data.email,
    event.data.password
  );
  await updateProfile(user, { displayName: "Admin Adhi" });
}
</script>

<style></style>
