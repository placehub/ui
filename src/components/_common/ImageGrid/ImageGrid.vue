<template>
  <div class="gallery" :class="classes[images.length]">
    <div v-for="image in images" :key="image.id">
      <img :src="image.url" alt="" :data-src="image.url">
    </div>
  </div>
</template>

<script setup>
import './styles.scss'

defineProps({
  images: {
    type: Array,
    required: true,
  }
})

const classes = {
  2:  'gallery-grid-2',
  3:  'gallery-grid-3',
  4:  'gallery-grid-4',
  5:  'gallery-grid-5',
  6:  'gallery-grid-6',
  7:  'gallery-grid-7',
  8:  'gallery-grid-8',
  9:  'gallery-grid-9',
  10: 'gallery-grid-10'
}
</script>