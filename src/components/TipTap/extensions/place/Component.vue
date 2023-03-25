<template>
  <NodeViewWrapper
      class="flex items-center space-x-4 p-4 bg-white rounded-lg"
      contenteditable="false"
      data-drag-handle
      draggable="true">
    <div class="w-[80px] h-[80px] bg-slate-100 rounded-lg">

    </div>
    <div>
      <div class="text-2xl font-semibold">{{ node.attrs.name }}</div>
      <div>{{ node.attrs }}</div>
    </div>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)
</script>