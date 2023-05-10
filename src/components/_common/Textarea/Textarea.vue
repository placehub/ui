<template>
  <div class="textarea">
    <textarea
      ref="textarea"
      :aria-label="label"
      :disabled="disabled"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      :class="textareaStyles"
      :maxlength="maxlength"
      v-model="input"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    />
  </div>
</template>


<script setup>
import { useTextareaAutosize } from '@vueuse/core'
import { computed, watch } from 'vue'

defineEmits(['update:modelValue', 'focus', 'blur'])

const props = defineProps({
  modelValue: {
    type: String,
  },
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  rows: {
    type: [String, Number],
    default: 1
  },
  maxlength: {
    type: [Number, String]
  },
  withoutStyles: {
    type: Boolean
  }
})

const { textarea, input } = useTextareaAutosize({
  input: props.modelValue
})

watch(() => props.modelValue, (newValue) => {
  if (newValue.trim() !== input.value.trim()) {
    input.value = newValue
  }
})

const textareaStyles = computed(() => {
  const classes = 'border border-indigo-100 focus:ring-indigo-100 focus:border-indigo-200 rounded-lg px-2 focus:outline-none focus:ring-4 disabled:opacity-75 transition duration-100 ease-in-out min-h-[44px] py-2.5'

  return !props.withoutStyles ? classes : ''
})
</script>

<style lang="scss">
.textarea {
  textarea {
    @apply resize-none text-sm w-full outline-none leading-relaxed overflow-hidden;
  }
}
</style>