<template>
  <div>
    <FloatingMenu
      v-if="editor"
      :editor="editor"
      :should-show="floatingMenuShouldShow"
      :tippy-options="{placement: 'left', offset: [0, 4]}"
      ref="menu"
      class="relative"
    >
      <button @click="dropdown = !dropdown" class="flex items-center justify-center plus">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
      <div v-show="dropdown" class="bg-white absolute top-full left-0 -ml-[24px] mt-1 shadow p-2 rounded border">
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run(); dropdown = false" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          Заголовок
        </button>
        <button @click="editor.chain().focus().toggleParagraph().run(); dropdown = false" :class="{ 'is-active': editor.isActive('paragraph') }">
          Текст
        </button>
      </div>
    </FloatingMenu>
    <BubbleMenu v-if="editor" :editor="editor" :should-show="bubbleMenuShouldShow" id="bubble-menu">
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run();" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        Заголовок
      </button>
    </BubbleMenu>
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup>
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import bubbleMenuShouldShow from './bubble-menu-should-show'
import floatingMenuShouldShow from './floating-menu-should-show'
import { Editor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/vue-3'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {}
  }
})

const menu = ref(null)
const dropdown = ref(false)

onClickOutside(menu, () => dropdown.value = false)

const editor = shallowRef(null)

onMounted(() => {
  const CustomDocument = Document.extend({
    content: 'heading block*',
  })

  editor.value = new Editor({
    autofocus: true,
    content: '',
    extensions: [
      CustomDocument,
      Heading,
      Paragraph,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading' && node.attrs.level === 1) {
            return 'Придумайте заголовок'
          }

          return ''
        },
        showOnlyCurrent: false
      }),
      Text,
      Typography.configure({
        openDoubleQuote: '«',
        closeDoubleQuote: '»'
      }),
    ],
    onUpdate: ({ editor }) => {
      emits('update:modelValue', editor.getJSON())
    },
  })


  if (props.modelValue?.type === 'doc') {
    const first = props.modelValue.content[0]

    if (first.type !== 'heading' && first?.attrs?.level !== 1) {
      editor.value.commands.insertContent({
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: '',
          },
        ],
      })
    }
  }

  editor.value.commands.setContent(props.modelValue)
})

onBeforeUnmount(() => editor.value.destroy)
</script>

<style lang="scss">
button.plus  {
  @apply bg-slate-100 rounded-full w-6 h-6 block;
}
.ProseMirror {
  @apply outline-none py-4 px-8;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

.ProseMirror .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
</style>