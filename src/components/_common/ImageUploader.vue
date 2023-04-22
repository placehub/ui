<template>
  <div>
    <ImageGridEditable :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
    <div ref="trigger" @click="onUpload"></div>
  </div>
</template>

<script lang="ts" setup>
import useUpload2 from '../../composables/useUpload2'
import { ImageGridEditable } from '@placehub/ui'
import { shallowRef, withDefaults } from 'vue'

interface Props {
  modelType: string,
  modelValue?: object[]
}

const emits = defineEmits(['update:modelValue'])

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const { handleUpload } = useUpload2({
  modelType: props.modelType,
  multiple: true
})

const trigger = shallowRef()

defineExpose({
  trigger
})

const onUpload = () => {
  handleUpload({
    onUploadProgress: (progressEvent) => {
      console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total))
    }
  }).then(({ data: { images }}) => {
    emits('update:modelValue', [...props.modelValue, ...images])
  })
}
</script>