<template>
  <component
    :is="as"
    :to="to"
    v-bind="$attrs"
    class="block bg-white py-1 px-2 hover:bg-blue-50 cursor-pointer rounded-lg"
    @click="$emit('click')"
  >
    <slot></slot>
  </component>
</template>

<script setup>
defineEmits(['click'])

const props = defineProps({
  as: {
    type:    String,
    default: 'NuxtLink'
  },
  to: {
    type: [String, Object]
  }
})
</script>