<template>
  <div ref="root">
    <div @click="onClick">
      <slot></slot>
    </div>

    <div
      v-if="isShow"
      class="fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center"
      style="background-color: rgba(0,0,0,.4)"
    >
      <div class="p-4 xl:p-10 w-full h-full">
        <div class="xl:p-4 bg-black/75 rounded-lg h-full relative overflow-hidden">
          <swiper
            ref="target"
            :modules="[Zoom]"
            :initial-slide="active"
            :lazy="true"
            :zoom="true"
            :preload-images="false"
            class="w-auto h-full"
            @slideChange="onSlideChange"
          >
            <swiper-slide v-for="image in images" :key="image.id" class="flex items-center justify-center">
              <div class="swiper-zoom-container">
                <NuxtImg :data-src="image.src" :src="image.src" :alt="image.src" class="swiper-lazy" loading="lazy" />
              </div>
            </swiper-slide>
          </swiper>
          <div class="absolute top-0 p-4 right-0 xl:p-6 z-10 flex items-center">
            <div class="bg-black/50 py-1 px-3 rounded-full text-white text-sm">{{ active + 1 }} из {{ images.length }}</div>
            <button v-if="closable" type="button" class="ml-4 xl:ml-6">
              <X class="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/zoom'
// import 'swiper/css/lazy'
import { Zoom } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { X } from 'lucide-vue-next'

const props = defineProps({
  text: {
    type: String
  },
  selector: {
    type: String,
    default: '[data-src]'
  },
  closable: {
    type: Boolean
  }
})

const root = ref(null)
const target = ref(null)
const images = ref([])
const active = ref(0)
const isShow = ref(false)

const show = () => {
  isShow.value = true
  document.body.style.overflow = 'hidden'
}

const hide = () => {
  isShow.value = false
  document.body.style.overflow = ''
}

onClickOutside(target, hide)

const onEsc = (event) => {
  if (event.key === 'Escape') {
    hide()
  }
}

const onSlideChange= (slide) => {
  active.value = slide.activeIndex
}

onMounted(async () => {
  document.addEventListener('keydown', onEsc)

  root.value.querySelectorAll(props.selector)
    .forEach(image => images.value.push({...image.dataset}))
})

onBeforeUnmount(() => document.removeEventListener('keydown', onEsc))

const onClick = ({ target }) => {
  if (target.nodeName === 'IMG') {
    for (let index in images.value) {
      if (target.dataset.src === images.value[index].src) {
        active.value = parseInt(index)
        break
      }
    }

    show()
  }
}
</script>

<style lang="scss">
.prose {
  img {
    cursor: pointer;
  }
}
</style>
