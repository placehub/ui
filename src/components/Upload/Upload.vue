<template>
  <input type="file" @change="onChange" multiple>
</template>

<script setup>
import { $fetch } from 'ohmyfetch'
import { useNuxtApp, useRuntimeConfig } from 'nuxt/app';

const config = useRuntimeConfig();

const emit = defineEmits([
    'uploaded'
])

const props = defineProps({
  modelType: {
    type: String,
    required: true,
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
    images: ['variables.images'],
  }))

  try {
    const { data: { upload }} = await $fetch(
      config.GRAPHQL_URL,
      {
        body: formData,
        headers: {
          Accept: 'application/json',
          Authorization: useNuxtApp().$auth.strategy.token.get()
        },
        initialCache: false,
        transform: data => data.data,
        method: 'POST',
        async onResponse({ response }) {
          if (response?._data?.errors) {
            return new Promise((resolve, reject) => reject(response._data.errors))
          }
        }
      }
    )

    emit('uploaded', upload)
  } catch (error) {
  } finally {
    event.target.value = ''
  }
}
</script>