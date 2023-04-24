<template>
  <div class="gallery" :class="classes[images.length]">
    <div v-for="(image, index) in images" :key="image.id">
      <NuxtImg :src="image.url" alt="" :data-src="image.url" :width="size[index].width" :height="size[index].height" />
    </div>
  </div>
</template>

<script setup>
import './styles.scss'

const props = defineProps({
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

const sizes = {
  1: [{width: 480, height: 320}],
  2: [{width: 480, height: 320}, {width: 160, height: 160}],
  3: [{width: 320, height: 320}, {width: 200, height: 200}, {width: 200, height: 200}],
  4: [
    {width: 480, height: 320},
    {width: 200, height: 200},
    {width: 200, height: 200},
    {width: 200, height: 200},
  ],
  5: [
    {width: 240, height: 240},
    {width: 240, height: 240},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
  ],
  6: [
    {width: 480, height: 320},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
  ],
  7: [
    {width: 240, height: 240},
    {width: 240, height: 240},
    {width: 100, height: 100},
    {width: 100, height: 100},
    {width: 100, height: 100},
    {width: 100, height: 100},
    {width: 100, height: 100},
  ],
  8: [
    {width: 480, height: 320},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 480, height: 320},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
  ],
  9: [
    {width: 480, height: 320},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
    {width: 160, height: 160},
  ],
}

const size = sizes[props.images.length]
</script>