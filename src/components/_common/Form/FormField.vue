<template>
  <div>
    <Field :name="name" :rules="rules" v-slot="{ errorMessage }">
      <label v-if="label" :for="name.replace('_', '-')" class="text-sm font-medium mb-1 inline-block">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </label>
      <div>
        <slot :hasError="errorMessage !== undefined" />
      </div>
      <p v-if="errorMessage" class="mt-1 text-red-500 font-semibold text-xs">{{ errorMessage }}</p>
      <p v-if="!!$slots['help'] && !errorMessage" class="mt-1 text-gray-400 font-medium text-xs">
        <slot name="help"></slot>
      </p>
    </Field>
  </div>
</template>

<script setup>
import { Field } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  required: {
    type: Boolean
  },
  rules: {
    type: [String, Array, Object]
  }
})
</script>