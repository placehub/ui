<template>
  <form @submit.prevent="onSubmit">
    <slot :isLoading="isLoading" />
  </form>
</template>

<script lang="ts" setup>
import { shallowRef, onUnmounted } from 'vue'
import { toast, type ToastOptions } from 'vue3-toastify'
import { useForm } from 'vee-validate'

const props = defineProps({
  submit: {
    type: Function
  },
  successMessage: {
    type: String,
    default: 'Сохранено!'
  }
})

const { handleSubmit, setErrors } = useForm()

const isLoading = shallowRef(false)
const toastId = shallowRef()

const onSubmit = handleSubmit(async () => {
  try {
    if (isLoading.value) return

    isLoading.value = true

    await props.submit()

    /*if (props.successMessage) {
      toastId.value = toast.success(props.successMessage, {
        position: toast.POSITION.TOP_CENTER,
        theme: 'dark',
      } as ToastOptions)
    }*/
  } catch (errors) {
    if (errors[0].extensions?.validation) {
      setErrors(errors[0].extensions.validation);
    }
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => toast.remove(toastId.value))
</script>