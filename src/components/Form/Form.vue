<template>
  <form @submit.prevent="onSubmit">
    <slot :isLoading="isLoading" />
  </form>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useForm } from 'vee-validate'

const props = defineProps({
  submit: {
    type: Function
  },
})

const { handleSubmit, setErrors } = useForm()

const isLoading = shallowRef(false)

const onSubmit = handleSubmit(async () => {
  try {
    if (isLoading.value) return

    isLoading.value = true

    await props.submit()
  } catch (error) {
    if (error[0]?.extensions?.validation) {
      setErrors(error[0].extensions.validation);
    }
  } finally {
    isLoading.value = false
  }
})
</script>