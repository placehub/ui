<template>
  <div class="relative h-full">
    <button v-show="showPreviousButton" @click="onPrevious" tabindex="0" type="button" class="absolute top-0 left-0 w-1/2 h-full">
      <ChevronLeft class="w-8 h-8" />
    </button>
    <div class="flex justify-center h-full">
      <img :src="activeImage.url" @load="isLoading = false" alt="" class="h-full object-cover" />
    </div>
    <button v-show="showNextButton" @click="onNext" type="button" tabindex="0" class="absolute top-0 right-0 w-1/2 h-full z-10">
      <ChevronRight class="w-8 h-8 ml-auto" />
    </button>
    <Loader v-show="isLoading" class="bg-black/25" />
  </div>
</template>

<script setup>
import { shallowRef, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Loader } from '../../../../index'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const activeIndex = shallowRef(0)
const activeImage = computed(() => props.modelValue[activeIndex.value])
const totalImages = computed(() => props.modelValue.length)

const isLoading = shallowRef(false)

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