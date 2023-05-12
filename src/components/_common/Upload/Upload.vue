<template>
  <div @click="$refs.file.click" class="cursor-pointer">
    <input type="file" @change="onChange" multiple ref="file" class="hidden">
    <slot :isLoading="isLoading" :uploadProgress="uploadProgress" />
  </div>
</template>

<script setup>
import { useQuery } from '../../../index'
import { shallowRef } from 'vue'
import { throttle } from 'lodash-es'

const emit = defineEmits([
  'update:modelValue',
  'progress',
])

const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => []
  },
  mutationName: {
    type: String,
    default: 'upload',
  },
  input: {
    type: Object,
    default: () => {}
  },
  fields: {
    type: Array,
    default: () => []
  },
})

const isLoading = shallowRef(false)
const uploadProgress = shallowRef(0)

const onChange = async (event) => {
  const images = event.target.files

  if (! images) {
    return
  }

  const hasInput = typeof props.input === 'object'
      && Object.keys(props.input).length

  const hasFields = props.fields.length

  const formData = new FormData()

  for (let image of images) {
    formData.append('images[]', image)
  }

  const mutationArg1 = ['$images: [Upload!]!']
  const mutationArg2 = ['images: $images']

  const variables = {
    images: new Array(images.length)
  }

  if (hasInput) {
    variables.input = props.input
    mutationArg1.push('$input: UploadInput')
    mutationArg2.push('input: $input')
  }

  formData.set('operations', JSON.stringify({
    query: `
      mutation (${mutationArg1.join(',')}) {
        ${props.mutationName}(${mutationArg2.join(',')})
        ${hasFields
        ? `{${props.fields.join('\n')}}`
        : ''
    }
      }
    `,
    variables
  }))

  formData.set('operationName', null)

  const map = {
    images: ['variables.images'],
  }

  if (hasInput) {
    map.input = ['variables.$input']
  }

  formData.set('map', JSON.stringify(map))

  try {
    if (isLoading.value) return

    isLoading.value = true

    const { data } = await useQuery({
      query: formData
    }, {
      onUploadProgress: throttle((progressEvent) => {
        emit('progress', Math.round((progressEvent.loaded * 100) / progressEvent.total))
      }, 1000),
    })

    const uploaded = data[props.mutationName]

    if (typeof uploaded === 'string') {
      emit('update:modelValue', uploaded)
    } else if (Array.isArray(uploaded)) {
      const arr = [...uploaded]

      if (Array.isArray(props.modelValue) && props.modelValue.length) {
        arr.push(...props.modelValue)
      }

      emit('update:modelValue', arr)
    }
  } catch (error) {
    console.log(error)
    if (error?.extensions?.validation) {
      emit('error', error.extensions.validation)
    }
  } finally {
    event.target.value = ''
    isLoading.value = false
    emit('progress', 0)
  }
}
</script>
