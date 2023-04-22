<template>
  <Sortable :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" class="grid grid-cols-4 gap-1">
    <div v-for="(image, index) in modelValue" :key="image.id" class="aspect-square drag-handle relative">
      <img :src="image.url" alt="" :data-src="image.url" class="w-full h-full object-cover rounded-lg">
      <div class="absolute top-0 right-0 p-1">
        <button type="button" @click="onDelete(index)" class="rounded bg-black/50">
          <X class="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  </Sortable>
</template>

<script setup>
import './styles.scss'
import { Sortable } from '@placehub/ui'
import { X } from 'lucide-vue-next'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  }
})
const onDelete = (index) => {
  const images = props.modelValue
  images.splice(index, 1)
  emits('update:modelValue', images)
}
</script>