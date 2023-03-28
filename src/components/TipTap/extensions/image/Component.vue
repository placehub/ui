<template>
  <NodeViewWrapper @click="selectNode" :class="{'ring-blue-300 ring-offset-2 ring': selected}" data-drag-handle contenteditable="false"
                   draggable="true">
    <figure v-show="! isEdit" class="relative h-[360px]">
      <!-- Carousel -->
      <Carousel :modelValue="computedImages" />
      <!-- / Carousel -->

      <div v-show="hasImages" @click="isEdit = !isEdit" class="absolute top-0 right-0 z-10 p-2 cursor-pointer flex items-center space-x-2">
        <div class="bg-black/50 text-white rounded-lg py-1 px-2.5">{{ hasImages > 1 ? 'Редактировать' : 'Создать карусель' }}</div>
      </div>
    </figure>

    <CarouselEdit v-show="isEdit" :model-value="computedImages" @update:modelValue="onChange" @save="isEdit = false" />
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { shallowRef, computed } from 'vue'
import useOverlay from '../../../Overlay/useOverlay'
import CarouselEdit from './CarouselEdit.vue'
import Carousel from './Carousel.vue'

const emits = defineEmits(['uploaded'])
const props = defineProps(nodeViewProps)

const overlay = useOverlay()


const computedImages = computed(() => props.node.attrs.images)
const hasImages = computed(() => computedImages.value.length)
const isEdit = shallowRef(false)

const onChange = (images) => {
  props.updateAttributes({
    images
  })
}

const selectNode = () => {
  props.editor.commands.setNodeSelection(props.getPos())
}

const addParagraph = () => {
  props.editor
    .chain()
    .createParagraphNear()
    .insertContent('')
    .run()
}
</script>