<template>
  <div class="relative">
    <Sortable :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" class="grid grid-cols-4 gap-1">
      <div v-for="(image, index) in modelValue" :key="image.id" class="aspect-square drag-handle relative">
        <img :src="image.url" alt="" @load="onLoad" :data-src="image.url" class="w-full h-full object-cover rounded-lg">
        <div class="absolute top-0 right-0 p-1">
          <button type="button" @click="onDelete(index)" class="rounded bg-black/50">
            <X class="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <div v-if="uploadProgress > 0 && modelValue.length === 0"  class="aspect-square"></div>
    </Sortable>
    <div v-if="uploadProgress > 0" class="top-0 left-0 w-full h-full absolute bg-black/75 rounded-lg flex items-center justify-center pointer-events-none">
      <div class="font-semibold text-white">
        {{ uploadProgress === 100 ? 'Пожалуйста, подождите....' : `${uploadProgress}%` }}
      </div>
    </div>
  </div>
</template>

<script setup>
import './styles.scss'
import { Sortable, Loader } from '@placehub/ui'
import { X } from 'lucide-vue-next'
import { shallowRef } from 'vue'

const emits = defineEmits(['update:modelValue', 'update:uploadProgress'])
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  uploadProgress: {
    type: Number,
    default: 0
  },
})

const loadedImages = shallowRef(0)

const onLoad = () => {
  loadedImages.value++

  if (loadedImages.value === props.modelValue.length) {
    emits('update:uploadProgress', 0)
  }
}

const onDelete = (index) => {
  const images = props.modelValue
  images.splice(index, 1)
  emits('update:modelValue', images)
}
</script>