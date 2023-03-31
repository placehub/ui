<template>
  <div class="grid grid-cols-4 gap-1">
    <div v-for="(image, index) in images" :key="image" class="aspect-square relative overflow-hidden">
      <div
        class="w-full h-full absolute top-0 left-0 opacity-50 bg-white"
        :style="{
          transform: `translateX(${index >= previousLength && progress > 0 ? `${progress}%` : '100%'})`
        }"
      />
      <img
        :src="image"
        :alt="image"
        class="w-full h-full object-cover block rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
import { watch, shallowRef } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  progress: {
    type: Number,
    default: 0
  }
})

const previousLength = shallowRef(0)

watch(() => props.images.length, (newValue, oldValue) => {
  previousLength.value = oldValue
})
</script>