<template>
  <div class="grid grid-cols-5 gap-1">
    <div v-for="image in modelValue" :key="image.id" class="aspect-square relative">
      <img :src="image.url" :alt="image.url" class="w-full h-full object-cover block rounded-lg" />
      <button type="button" class="absolute">x</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Array,
    required: true,
  }
})
</script>