<template>
  <TipTap :editor="editor" />
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
import { useEditor, EditorContent as TipTap } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: 'Привет, что нового?'
  }
})

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    Document,
    Paragraph,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    Text,
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
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
</style>