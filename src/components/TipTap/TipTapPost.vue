<template>
  <div>
    <EditorContent :editor="editor" />
    <div v-if="!!$slots['default']" class="mt-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import Document from '@tiptap/extension-document'
import History from '@tiptap/extension-history'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import useUpload from './composables/useUpload'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { onBeforeUnmount, shallowRef, onMounted } from 'vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
  }
})

const { onUpload } = useUpload()

const editor = shallowRef(null)

onMounted(async () => {
  const CustomDocument = Document.extend({
    content: 'paragraph paragraph*',
  })

  const content = Object.hasOwn(props.modelValue, 'type') ? props.modelValue : { type: 'doc', content: [{ type: 'paragraph' }] }

  editor.value = new Editor({
    content,
    extensions: [
      CustomDocument,
      History,
      Paragraph,
      Placeholder.configure({
        placeholder: 'Привет, что нового?',
      }),
      Text,
      Typography,
    ],
    onUpdate: ({ editor }) => {
      emits('update:modelValue', editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm outline-none',
      },
    },
  })
})

onBeforeUnmount(() => editor.value.destroy)

const addImage = async () => {
  await onUpload((images) => {
    const position = editor.value.state.selection.$anchor.pos

    images.forEach((image, index) => {
      editor.value.commands.insertContentAt(position + index, {
        type: 'image',
        attrs: {
          images: [image]
        }
      })
    })
  })
}
</script>

<style>
.ProseMirror p.is-editor-empty:first-child::before {
  color: #aaa;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>