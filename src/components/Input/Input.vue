<template>
  <div class="relative flex items-center">
    <div v-if="hasPrependSlot" @click="$emit('click-prepend', $event)"
         class="absolute z-10 w-10 h-10 flex items-center justify-center">
      <slot name="prepend"></slot>
    </div>
    <input
      :class="classes"
      :disabled="disabled"
      :maxlength="maxlength"
      :type="type"
      :value="modelValue"
      :id="id"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      style="max-height: 40px"
    >
    <div v-if="hasAppendSlot" @click="$emit('click-append', $event)"
         class="absolute right-0 z-10 w-10 h-10 flex items-center justify-center">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script setup>
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
const getVariant = ref(props.variant)
watch(() => props.variant, (newValue) => {
  getVariant.value = newValue.value
})

const hasPrependSlot = computed(() => {
  return !!slots.prepend;
});
const hasAppendSlot = computed(() => {
  return !!slots.append;
});

const classes = computed(() => {
  const variants = {
    default:  'border border-indigo-100 focus:ring-indigo-100 focus:border-indigo-200',
    error: 'border border-red focus:ring-red-light',
    success: 'border border-green focus:ring-green-light',
  };

  let paddingX = 'px-2.5';

  if (hasPrependSlot.value && hasAppendSlot.value) {
    paddingX = 'px-9'
  } else if (hasPrependSlot.value && !hasAppendSlot.value) {
    paddingX = 'pl-9 pr-2.5'
  } else if (hasAppendSlot.value && !hasPrependSlot.value) {
    paddingX = 'pl-2.5 pr-10'
  }

  return {
    [`${paddingX} relative w-full rounded-lg text-sm py-2.5 focus:outline-none focus:ring-4 disabled:opacity-75 transition duration-100 ease-in-out`]: true,
    [variants[getVariant.value]]: true,
  }
})
</script>
