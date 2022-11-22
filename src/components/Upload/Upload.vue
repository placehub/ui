<template>
  <input type="file" @change="onChange" multiple>
</template>

<script setup>
import { getCurrentInstance  } from 'vue'

const { appContext } = getCurrentInstance()

const emit = defineEmits([
  'update:modelValue'
])

const $fetch = appContext.config.globalProperties.$fetch

const props = defineProps({
  modelType: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
  },
  fields: {
    type: Array,
    required: true,
  }
})

const onChange = async (event) => {
  const images = event.target.files

  if (! images) {
    return
  }

  const formData = new FormData()

  for (let image of images) {
    formData.append('images[]', image)
  }

  formData.set('operations', JSON.stringify({
    query: `
      mutation ($model_type: String!, $images: [Upload!]!) {
        upload(model_type: $model_type, images: $images) {
          ${props.fields.join(' ')}
        }
      }
    `,
    variables: {
      model_type: props.modelType,
      images: new Array(images.length),
    }
  }))

  formData.set('operationName', null)

  formData.set('map', JSON.stringify({
    model_type: ['variables.$model_type'],
    images:     ['variables.images'],
  }))

  try {
    const data = await $fetch(formData)
    emit('update:modelValue', data)
  } catch (error) {
    console.log(error)
  } finally {
    event.target.value = ''
  }
}
</script>