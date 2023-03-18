<template>
  <NodeViewWrapper :class="{'image': selected}">
    <div v-show="! isEdit">
      {{ Date.now() }}
      <div @click="isEdit = !isEdit">edit</div>
    </div>
    <div v-show="isEdit">
      EDIT MODE
    </div>
    <button type="button" @click="addParagraph">
      <WrapText class="w-4 h-4" />
    </button>
  </NodeViewWrapper>
</template>

<style>
.image {
  @apply ring-blue-300 ring-offset-2 ring;
}
</style>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { WrapText } from 'lucide-vue-next'
import { shallowRef } from 'vue'

const props = defineProps(nodeViewProps)

const isEdit = shallowRef(false)

const addParagraph = () => {
  props.editor
    .chain()
    .createParagraphNear()
    .insertContent('')
    .run()
}
</script>