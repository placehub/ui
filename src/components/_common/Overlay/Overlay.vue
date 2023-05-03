<template>
  <div :class="{[count ? 'flex justify-center fixed top-0 right-0 bottom-0 left-0 overflow-hidden z-[9999]' : '']: true}" tabindex="1">
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
    <Component
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
    ></Component>
    </TransitionGroup>
    <div v-show="count" class="fixed top-0 right-0 bottom-0 left-0 z-[1] bg-black/50" :style="{zIndex: count - 1}" @click="overlay.hide"></div>
  </div>
</template>

<script setup>
import useOverlay from './useOverlay.ts'
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'

const overlay = useOverlay()
const count = computed(() => overlay.stack.length)

watch(count, (newValue) => {
  if (newValue === 0) {
    document.body.classList.remove('body-lock')
  } else {
    document.body.classList.add('body-lock')
  }
})

const onKeydown = (event) => {
  if (overlay.stack.length && event.key === 'Escape') {
    overlay.hide()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<style>
.body-lock {
  overflow: hidden;
  padding-right: 17px;
}
</style>