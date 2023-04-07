<template>
  <div class="textarea" :class="textareaAfterStyles" :data-replicated-text="props.modelValue">
    <textarea
      :aria-label="label"
      :disabled="disabled"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      :value="modelValue"
      :class="textareaStyles"
      :maxlength="maxlength"
      @input="onInput"
    />
  </div>
</template>


<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

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

const onInput = (event) => {
 emit('update:modelValue', event.target.value)
}

const textareaStyles = computed(() => {
  const classes = 'border border-indigo-100 focus:ring-indigo-100 focus:border-indigo-200 rounded-lg p-2 focus:outline-none focus:ring-4 disabled:opacity-75 transition duration-100 ease-in-out'

  return !props.withoutStyles ? classes : ''
})

const textareaAfterStyles = computed(() => {
  const classes = 'after:p-2 after:w-full after:text-sm after:border after:border-transparent leading-relaxed'
  return !props.withoutStyles ? classes : ''
})
</script>

<style lang="scss">
/**
 * https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas
 */
.textarea {
  display: grid;
  position: relative;

  textarea {
    @apply overflow-hidden resize-none text-sm w-full outline-none leading-relaxed;
    grid-area: 1 / 1 / 2 / 2;
  }
}
.textarea::after {
  @apply leading-relaxed text-sm leading-relaxed;
  content: attr(data-replicated-text) ' ';
  grid-area: 1 / 1 / 2 / 2;
  visibility: hidden;
  white-space: pre-wrap;
}
</style>