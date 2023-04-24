<template>
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
</template>

<script setup>
import './styles.scss'
import { Sortable } from '@placehub/ui'
import { X } from 'lucide-vue-next'
import { watch, ref, shallowRef, nextTick } from 'vue'

const emits = defineEmits(['update:modelValue', 'update:uploadProgress'])
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  uploadProgress: {
    type: Number,
    default: 0,
  },
})

const root = ref()
const queue = shallowRef(0)

watch(() => props.modelValue, async (newValue, oldValue) => {
  const newIds = newValue.map((item) => item.id)
  const oldIds = oldValue.map((item) => item.id)

  await nextTick()

  // Берем только новые изображения.
  queue.value = newIds.filter(newId => !oldIds.includes(newId))

  if (queue.value.length) {
    queue.value.forEach((id) => {
      root.value.querySelector(`[data-id="${id}"]`).addEventListener('load', onLoad)
    })
  }
})

function onLoad(event) {
  // Изображение загрузилось, можем укоротить очередь.
  queue.value.pop()

  if (queue.value.length === 0) {
    emits('update:uploadProgress', 0)
  }

  event.target.removeEventListener('load', onLoad)
}

function onDelete (index) {
  const images = [...props.modelValue]
  images.splice(index, 1)
  emits('update:modelValue', images)
}
</script>