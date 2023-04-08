<template>
  <div class="relative flex items-center">
    <div v-if="hasPrependSlot" @click="$emit('click-prepend', $event)"
         class="absolute z-10 w-10 h-10 pl-2 flex items-center justify-center">
      <slot name="prepend"></slot>
    </div>
    <input
      :class="classes"
      :disabled="disabled"
      :maxlength="maxlength"
      :type="type"
      :value="modelValue"
      :id="id"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <div v-if="hasAppendSlot" @click="$emit('click-append', $event)"
         class="absolute right-0 z-10 w-10 h-10 pr-2 flex items-center justify-center">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script setup>
import './styles.scss'
import { computed, useSlots, ref, watch } from 'vue'

const emit = defineEmits(['click-prepend', 'click-append', 'update:modelValue'])
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String
  },
  id: {
    type: String
  },
  maxlength: {
    type: String
  },
  placeholder: {
    type: String
  },
  variant: {
    type: String,
    default: 'default',
    validator(type) {
      return ['default', 'success', 'warning', 'error'].includes(type)
    },
  },
  type: {
    type: String,
    default: 'text',
    validator(type) {
      return ['text', 'date', 'email', 'password', 'number'].includes(type)
    },
  },
})

const slots = useSlots()

const hasPrependSlot = computed(() => {
  return !!slots.prepend;
});
const hasAppendSlot = computed(() => {
  return !!slots.append;
});

const getVariant = computed(() => {
  const variants = {
    default:  'border border-indigo-100 focus:ring-indigo-100 focus:border-indigo-200',
    success:  'border border-green focus:ring-green-light',
  }

  return `input--${props.variant}`
})

const classes = computed(() => {

  let paddingX = '';

  if (hasPrependSlot.value && hasAppendSlot.value) {
    paddingX = 'input--prepend input--append'
  } else if (hasPrependSlot.value && !hasAppendSlot.value) {
    paddingX = 'input--prepend'
  } else if (hasAppendSlot.value && !hasPrependSlot.value) {
    paddingX = 'input--append'
  }

  return {
    [`input ${paddingX} `]: true,
    [getVariant.value]: true,
  }
})
</script>
