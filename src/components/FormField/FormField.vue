<template>
  <Field :name="name" :rules="rules" v-slot="{ errorMessage }" as="div" ref="field">
    <label class="font-semibold text-sm">{{ label }}<span v-if="required" class="text-red ml-1">*</span></label>
    <div class="mt-1">
      <slot :hasError="errorMessage !== undefined" />
    </div>
    <p v-if="errorMessage" class="mt-1 text-red font-semibold text-xs">{{ errorMessage }}</p>
    <p v-if="help && !errorMessage" class="mt-1 text-gray-400 font-medium text-xs">{{ help }}</p>
  </Field>
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
    required: true,
  },
  required: {
    type: Boolean
  },
  help: {
    type: String
  },
  rules: {
    type: [String, Array, Object]
  }
})
</script>