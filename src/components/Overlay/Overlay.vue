<template>
  <div v-if="count" class="overlay" tabindex="1">
    <component
      v-bind="overlay.props"
      v-for="(overlay, index) in overlay.stack"
      v-on="overlay.on"
      class="absolute"
      role="dialog"
      :is="overlay.component"
      :key="overlay.key"
      :style="{
        zIndex: index + 1
      }"
    ></component>
    <div class="overlay-backdrop" :style="{zIndex: count - 1}" @click="overlay.hide"></div>
  </div>
</template>

<script setup>
import useOverlay from './useOverlay.ts'
import { computed, onMounted, onBeforeUnmount } from 'vue'

const overlay = useOverlay()
const count = computed(() => overlay.stack.length)

const onKeydown = (event) => {
  if (overlay.stack.length && event.key === 'Escape') {
    overlay.hide()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<style>
.overlay {
  @apply flex justify-center fixed top-0 right-[17px] bottom-0 left-0 overflow-hidden z-[9999];
}

.overlay-backdrop {
  @apply fixed top-0 right-0 bottom-0 left-0 z-[1] bg-black/50;
}
</style>