<template>
  <section>
    <label :for="id" class="font-semibold text-sm">{{ label }}<span v-if="required" class="text-red ml-1">*</span></label>
    <div class="mt-1">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean
  }
})
</script>
