<template>
  <div v-show="count" class="fixed top-0 right-0 bottom-0 left-0 overflow-hidden z-[9999]"
       tabindex="1">
    <TransitionGroup
        enter-active-class="transition duration-100 ease-linear"
        enter-from-class="translate-y-8 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-100 ease-linear"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-8 opacity-0"
    >
      <Component
          v-for="(overlay, index) in overlay.stack"
          v-bind="overlay.props"
          v-on="overlay.on"
          role="dialog"
          tabindex="-1"
          aria-hidden="true"
          :is="overlay.component"
          :key="overlay.key"
          :style="{ zIndex: index + 1 }"
          @click="onClick">
      </Component>
    </TransitionGroup>

    <div class="fixed top-0 right-0 bottom-0 left-0 z-[1] bg-black/50 backdrop-blur-sm"
         :style="{zIndex: count - 1}"></div>
  </div>
</template>

<script setup>
import useOverlay from './useOverlay.ts'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'

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

const onClick = ({ target }) => {
  if (target.getAttribute('role') === 'dialog') {
    overlay.hide()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<style>
.body-lock {
  overflow-y: hidden;
  padding-right: 17px;
}
</style>