<template>
  <div class="relative h-full">
    <div v-show="showPreviousButton" @click="onPrevious" class="carousel-arrow left-0">
      <div class="carousel-arrow-icon">
        <ChevronLeft class="w-8 h-8 text-white" />
      </div>
    </div>
    <div class="flex justify-center h-full">
      <img :src="activeImage.url" @load="isLoading = false" alt="" class="h-full object-cover" />
    </div>
    <div v-show="showNextButton" @click="onNext" class="carousel-arrow right-0">
      <div class="carousel-arrow-icon ml-auto">
        <ChevronRight class="w-8 h-8 text-white" />
      </div>
    </div>
    <Loader v-show="isLoading" class="bg-black/25" />
  </div>
</template>

<style>
.carousel-arrow {
  @apply absolute top-0 h-full px-4 flex items-center justify-center cursor-pointer;
}
.carousel-arrow-icon {
  @apply bg-black/50 p-1 rounded-full;
}
</style>

<script setup>
import { shallowRef, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Loader } from '../../../../index'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const isLoading = shallowRef(true)
const activeIndex = shallowRef(0)
const computedImages = computed(() => props.modelValue)
const activeImage = computed(() => computedImages.value[activeIndex.value])
const totalImages = computed(() => computedImages.value.length)

watch(computedImages, () => activeIndex.value = 0)

const showPreviousButton = computed(() => {
  return activeIndex.value > 0
})

const showNextButton = computed(() => {
  return (activeIndex.value + 1) < totalImages.value
})

const onNext = () => {
  isLoading.value = true

  if ((activeIndex.value + 1) < totalImages.value) {
    activeIndex.value++
  }
}

const onPrevious = () => {
  isLoading.value = true

  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}
</script>