<template>
  <NodeViewWrapper @click="selectNode" :class="{'ring-blue-300 ring-offset-2 ring': selected}" contenteditable="false"
                   draggable="true"
                   data-drag-handle>
    <figure class="relative h-[360px]">
      <!-- Carousel -->
      <Carousel :modelValue="computedImages" />
      <!-- / Carousel -->

      <div v-show="hasImages" @click="showCarouselEditDialog" class="absolute top-0 right-0 z-10 p-2 cursor-pointer flex items-center space-x-2">
        <div class="bg-black/50 text-white rounded-lg py-1 px-2.5">{{ hasImages > 1 ? 'Редактировать' : 'Создать карусель' }}</div>
      </div>
    </figure>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { shallowRef, computed } from 'vue'
import useOverlay from '../../../Overlay/useOverlay'
import CarouselEditDialog from './CarouselEditDialog.vue'
import Carousel from './Carousel.vue'

const emits = defineEmits(['uploaded'])
const props = defineProps(nodeViewProps)

const isLoading = shallowRef(false)
const overlay = useOverlay()

const computedImages = computed(() => props.node.attrs.images)
const hasImages = computed(() => computedImages.value.length)

const selectNode = () => {
  props.editor.commands.setNodeSelection(props.getPos())
}

const showCarouselEditDialog = () => {
  overlay.show(CarouselEditDialog, {
    props: {
      modelValue: computedImages,
      isLoading: isLoading
    },
    on: {
      'save': overlay.hide,
      'update:modelValue': (images) => {
        props.updateAttributes({
          images
        })
      },
      detach: (index) => {
        props.editor.commands.insertContentAt(props.getPos() + 1, {
          type: 'image',
          attrs: {
            images: [computedImages.value[index]]
          }
        })
      },
    }
  })
}

const addParagraph = () => {
  props.editor
    .chain()
    .createParagraphNear()
    .insertContent('')
    .run()
}
</script>