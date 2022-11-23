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
    type: Array,
    default: () => []
  },
  fields: {
    type: Array,
    default: () => ['id', 'url', 'user_id']
  },
  presets: {
    type: Array,
    default: () => []
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

  if (props.presets.length) {
    const presets = props.presets.join('|')

    props.fields.push(`presets(dimensions: "${presets}")`)
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
    const { data } = await $fetch(formData)

    emit('update:modelValue', [...props.modelValue, ...data.upload])
  } catch (error) {
  } finally {
    event.target.value = ''
  }
}
</script>