<template>
  <div>
    <ImageGridEditable
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      v-model:uploadProgress="uploadProgress"
      @update:uploadProgress="$event === 0 ? emits('busy', false) : ''"
    />
    <div ref="trigger" @click="onUpload"></div>
  </div>
</template>

<script lang="ts" setup>
import { useUpload, ImageGridEditable } from '@placehub/ui'
import { shallowRef, ref, withDefaults } from 'vue'

interface Props {
  modelType: string,
  modelValue?: object[]
}

const emits = defineEmits(['update:modelValue', 'busy'])

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const { handleUpload } = useUpload({
  modelType: props.modelType,
  multiple: true,
})

const trigger = shallowRef()

defineExpose({
  trigger
})

const uploadProgress = ref(0)

const onUpload = async () => {
  try {
    const { data: { images }} = await handleUpload({
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        emits('busy', true)
      }
    })

    emits('update:modelValue', [...props.modelValue, ...images])
  } catch (error) {
    uploadProgress.value = 0
    console.log(error)
  }
}
</script>