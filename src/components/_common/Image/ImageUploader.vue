<template>
  <div>
    <div class="relative" ref="root">
      <Sortable :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" class="grid grid-cols-4 gap-1">
        <div v-for="(image, index) in modelValue" :key="image.id" class="aspect-square drag-handle relative">
          <NuxtImg :src="image.url" :data-src="image.url" :data-id="image.id" width="120" height="120" alt="" class="w-full h-full object-cover rounded-lg" />
          <div class="absolute top-0 right-0 p-1">
            <button type="button" @click="onDelete(index)" class="rounded bg-black/50">
              <X class="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div v-if="uploadProgress > 0 && modelValue.length === 0"  class="aspect-square"></div>
      </Sortable>
      <div v-if="uploadProgress > 0" class="top-0 left-0 w-full h-full absolute z-10 bg-white/75 rounded-lg flex items-center justify-center pointer-events-all">
        <div class="font-semibold cursor-default">
          {{ uploadProgress === 100 ? 'Пожалуйста, подождите....' : `${uploadProgress}%` }}
        </div>
      </div>
    </div>
    <div ref="trigger" @click="onUpload"></div>
  </div>
</template>

<script lang="ts" setup>
import { useUpload, Sortable } from '@placehub/ui'
import {shallowRef, ref, withDefaults, watch, nextTick} from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  modelType: string,
  modelValue?: object[],
  select?: string[],
}

const emits = defineEmits(['update:modelValue', 'busy'])

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  select:     () => ['id', 'url'],
})

const { handleUpload } = useUpload({
  multiple: true,
  mutation: `
    mutation upload($input: UploadInput!, $images: [Upload!]!) {
      images: upload(input: $input, images: $images) {
        ${props.select.join('\n')}
      }
    }
  `,
  variables: {
    input: {
      model_type: props.modelType
    }
  }
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

const root = ref()
const queue = shallowRef(0)

// События загрузки вешаем только на новые изображения.
watch(() => props.modelValue, async (newValue, oldValue) => {
  const newIds = newValue.map((item) => item.id)
  const oldIds = oldValue.map((item) => item.id)

  await nextTick()

  // Берем только новые изображения.
  queue.value = newIds.filter(newId => !oldIds.includes(newId))

  if (queue.value.length) {
    queue.value.forEach((id) => {
      root.value.querySelector(`[data-id="${id}"]`).addEventListener('load', onLoadImage)
    })
  }
})

function onLoadImage(event) {
  // Изображение загрузилось, можем укоротить очередь.
  queue.value.pop()

  if (queue.value.length === 0) {
    uploadProgress.value = 0
  }

  event.target.removeEventListener('load', onLoadImage)
}

function onDelete (index) {
  const images = [...props.modelValue]
  images.splice(index, 1)
  emits('update:modelValue', images)
}
</script>