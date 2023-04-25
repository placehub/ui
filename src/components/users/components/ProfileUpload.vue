<template>
  <button @click="onUpload" type="button">
    <slot :uploadProgress="uploadProgress" />
  </button>
</template>

<script lang="ts" setup>
import { useUpload } from '@placehub/ui'
import { ref } from 'vue'

interface Props {
  type: 'avatar' | 'cover',
  modelValue?: string,
}

const emits = defineEmits(['update:modelValue', 'busy'])
const props = defineProps<Props>()

const uploadProgress = ref(0)

const mutationName = props.type === 'avatar'
    ? 'uploadAvatar'
    : 'uploadCover'

const { handleUpload } = useUpload({
  mutation: `
    mutation ${mutationName}($images: [Upload!]!) {
      ${mutationName}(images: $images)
    }
  `
})

const onUpload = async () => {
  try {
    const { data } = await handleUpload({
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })

    emits('update:modelValue', data[mutationName])
  } catch (error) {
    console.log(error)
  } finally {
    uploadProgress.value = 0
  }
}
</script>