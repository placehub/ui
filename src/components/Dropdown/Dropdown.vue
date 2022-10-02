<template>
  <div>
    <div ref="trigger" class="trigger" style="display: inline-block">
      <slot></slot>
    </div>
    <div ref="popper" class="absolute left-0 top-0" style="display: none">
      <div class="bg-white rounded-lg shadow-sm inline-block overflow-hidden p-2 ring-1 ring-slate-100">
        <slot name="popper" :hide="hide"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computePosition, flip, shift, offset } from '@floating-ui/dom'
import { ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

const trigger = ref()
const popper  = ref()

const update = () => {
  computePosition(trigger.value, popper.value, {
    middleware: [flip(), shift(), offset(8)],
    placement: 'bottom-start'
  })
  .then(({x, y}) => {
    Object.assign(popper.value.style, {
      left: `${x}px`,
      top:  `${y}px`,
    })
  })
}

const hide = () => {
  if (popper.value.style.display === 'block') {
    popper.value.style.display = 'none'
  }
}

const toggle = () => {
  if (popper.value.style.display === 'block') {
    popper.value.style.display = 'none'
  } else {
    popper.value.style.display = 'block'
    update()
  }
}

onMounted(() =>  trigger.value.addEventListener('click', toggle))

onClickOutside(popper, (event) => {
  const isTrigger = event.target.closest('.trigger')

  // Если клик по trigger, то не обрабатываем событие его обработает toggle.
  if (popper.value.style.display === 'block' && !isTrigger) {
    popper.value.style.display = 'none'
  }
})
</script>