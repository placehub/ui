<template>
  <div>
    <ImageGridEditable
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      v-model:uploadProgress="uploadProgress"
      @update:uploadProgress="$event === 0 ? emits('end') : ''"
    />
    <div ref="trigger" @click="onUpload"></div>
  </div>
</template>

<script lang="ts" setup>
import useUpload2 from '../../composables/useUpload2'
import { ImageGridEditable } from '@placehub/ui'
import { shallowRef, ref, withDefaults } from 'vue'

interface Props {
  modelType: string,
  modelValue?: object[]
}

const emits = defineEmits(['update:modelValue', 'start', 'end'])

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const { handleUpload } = useUpload2({
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
    const data = await handleUpload({
      onUploadProgress: (progressEvent) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        emits('start')
      }
    })

    emits('update:modelValue', [...props.modelValue, ...data.images])
  } catch (error) {
    console.log(error)
  }
}
</script>