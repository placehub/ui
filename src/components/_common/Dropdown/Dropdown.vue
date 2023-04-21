<template>
  <div ref="root">
    <div ref="button" class="flex items-center justify-center h-full trigger">
      <slot :isActive="isActive"></slot>
    </div>
    <div ref="popper" class="popper absolute z-10 left-0 top-0" style="display: none">
      <div class="bg-white rounded-lg shadow-lg inline-block overflow-hidden p-1 ring-1 ring-slate-100">
        <slot name="popper" :hide="hide"></slot>
        <slot name="content" :hide="hide"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown'
}
</script>

<script setup>
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  placement: {
    type:    String,
    default: 'bottom-end'
  },
  trigger: {
    type:    String,
    default: 'click'
  },
  interactive: {
    type:    Boolean,
    default: false,
  },
})

const root   = ref()
const button = ref()
const popper = ref()
const isActive = ref(false)

const update = () => {
  computePosition(button.value, popper.value, {
    middleware: [flip(), shift(), offset(8)],
    placement:  props.placement
  })
  .then(({x, y}) => {
    Object.assign(popper.value.style, {
      left: `${x}px`,
      top:  `${y}px`,
    })
  })
}

const show = () => {
  popper.value.style.display = 'block'
  isActive.value = true
  update()
}
const hide = () => {
  popper.value.style.display = 'none'
  isActive.value = false
}

const toggle = () => {
  if (popper.value.style.display === 'block') {
    popper.value.style.display = 'none'
    isActive.value = false
  } else {
    popper.value.style.display = 'block'
    update()
    isActive.value = true
  }
}

onMounted(() => {
  if (props.trigger === 'click') {
    button.value.addEventListener('click', toggle)
  } else if (props.trigger === 'hover') {
    button.value.addEventListener('mouseenter', show)
    button.value.addEventListener('mouseleave', hide)
  }
})

onBeforeUnmount(() => {
  if (props.trigger === 'click') {
    button.value.removeEventListener('click', toggle)
  } else if (props.trigger === 'hover') {
    button.value.removeEventListener('mouseenter', show)
    button.value.removeEventListener('mouseleave', hide)
  }
})

onClickOutside(popper, () => {
  const isTrigger = root.value.closest('.trigger')

  // Если клик по trigger, то не обрабатываем событие его обработает toggle.
  if (popper.value.style.display === 'block' && !isTrigger) {
    popper.value.style.display = 'none'
  }


  isActive.value = popper.value.style.display === 'block'
})
</script>
