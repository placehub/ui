<template>
  <div ref="root"></div>
</template>

<style lang="scss">
.ProseMirror {
  @apply p-4 prose-sm;

  p:first-child {
    margin-top: 0 !important;
  }

  &:focus {
    outline: none;
  }
}
</style>

<script setup>
import { Editor } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { onMounted, onBeforeUnmount, shallowRef } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: 'Привет, что нового?'
  },
  isArticle: {
    type: Boolean,
    default: false
  }
})

const CustomDocument = Document.extend({
  content: 'pluses minuses paragraph+',
})

let extensions = [
  Document,
  Heading,
  Paragraph,
  Placeholder.configure({
    showOnlyCurrent: false,
    placeholder: () => {
      return props.placeholder
    },
  }),
  Text,
]

const root = shallowRef()
const editor = shallowRef()

const newEditor = () => {
  return new Editor({
    element: root.value,
    content: props.modelValue,
    extensions,
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML());
    },
  })
}

onMounted(() => {
  editor.value = newEditor()
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style>
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #ced4da;
  float: left;
  height: 0;
  pointer-events: none;
}

.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
</style>