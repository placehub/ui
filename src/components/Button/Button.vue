<template>
  <button
    :class="classes"
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <Loader v-if="loading" />
    <slot v-if="hasPrependSlot && !loading" name="prepend"></slot>
    <span :style="{visibility: loading ? 'hidden' : 'visible'}"><slot></slot></span>
    <slot v-if="hasAppendSlot && !loading" name="append"></slot>
  </button>
</template>

<script>
export default {
  name: 'Button'
}
</script>

<script setup>
import Loader from '../Loader/Loader.vue'
import { computed, useSlots } from 'vue'

defineEmits(['click'])

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator(type) {
      return ['default', 'primary', 'secondary', 'danger', 'success', 'dark'].includes(type)
    },
  },
  type: {
    type: String,
    default: 'button',
    validator(type) {
      return ['button', 'submit', 'reset'].includes(type)
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})

const slots = useSlots()

const hasPrependSlot = computed(() => {
  return !!slots['prepend'];
})
const hasAppendSlot = computed(() => {
  return !!slots['append'];
})

const classes = computed(() => {
  const variants = {
    primary:    'text-white bg-indigo-500 enabled:hover:bg-indigo-600 focus:ring-indigo-400 focus:ring-4',
    secondary:  'text-indigo-400 enabled:hover:bg-indigo-50 border border-indigo-200 focus:ring-indigo-100 focus:ring-4',
    danger:     'text-white bg-red enabled:hover:bg-red-dark focus:ring-red-light focus:ring-4',
    success:    'text-white bg-green enabled:hover:bg-green-dark focus:ring-green-light focus:ring-4',
    dark:       'text-white bg-black/40 enabled:hover:bg-black/50 focus:ring-black/20 focus:ring-4'
  };

  return {
    'flex justify-center items-center text-center relative font-medium rounded-md text-sm px-5 py-2 h-10 focus:outline-none disabled:opacity-75 transition duration-100 ease-in-out"': true,
    [variants[props.variant]]: true,
    'space-x-2': hasAppendSlot || hasPrependSlot
  }
})
</script>
