<template>
  <div>
    <FloatingMenu
      v-if="editor"
      :editor="editor"
      :should-show="floatingMenuShouldShow"
      :tippy-options="{placement: 'left', offset: [0, 8]}"
      ref="menu"
      class="relative"
    >
      <button type="button" @click="dropdown = !dropdown" class="flex items-center justify-center plus">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
      <div v-show="dropdown" class="bg-white absolute top-full left-0 -ml-[24px] mt-1 shadow p-2 rounded border">
        <button type="button" @click="addImage">
          addImage
        </button>
        <button type="button" @click="addPlace">
          addPlace
        </button>
      </div>
    </FloatingMenu>
    <BubbleMenu v-if="editor" :editor="editor" :tippy-options="{delay: 500}" :should-show="bubbleMenuShouldShow" id="bubble-menu">
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run();" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        Подзаголовок
      </button>
    </BubbleMenu>
    <div class="bg-slate-50 rounded-lg py-4 px-12">
      <EditorContent :editor="editor" />
      <slot />
    </div>
  </div>
</template>

<script setup>
import 'swiper/css'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import bubbleMenuShouldShow from './bubble-menu-should-show'
import floatingMenuShouldShow from './floating-menu-should-show'
import { Editor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/vue-3'
import { Image, Place, Title } from './extensions'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
  }
})

const initialState = {type: 'doc', content: [{ type: 'title' }, { type: 'paragraph' }]}

const menu = ref(null)
const dropdown = ref(false)

onClickOutside(menu, () => dropdown.value = false)

const editor = shallowRef(null)

onMounted(async () => {
  const CustomDocument = Document.extend({
    content: 'title block*',
  })

  const isNotEmpty = props.modelValue?.type === 'doc'

  editor.value = new Editor({
    autofocus: true,
    content: isNotEmpty ? props.modelValue : initialState,
    extensions: [
      CustomDocument,
      Heading.configure({
        levels: [2],
      }),
      History,
      Image,
      Paragraph,
      Place,
      Placeholder.configure({
        placeholder: ({ editor, node }) => {
          const { view: { state: { doc }}} = editor

          if (node.type.name === 'title') {
            return 'И, обходя моря и земли,'
          }

          if (doc.childCount === 2 && node.type.name === 'paragraph') {
            return 'Глаголом жги сердца людей'
          }

          return ''
        },
        showOnlyCurrent: false
      }),
      Text,
      Title,
      Dropcursor.configure({
        width: 2,
      }),
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

const addImage = () => {
  editor.value.commands.insertContent({
    type: 'image',
  })
}
const addPlace = () => {
  editor.value.commands.insertContent({
    type: 'place',
  })
}
</script>

<style lang="scss">
button.plus  {
  @apply bg-white shadow rounded-full w-6 h-6 block;
}
.ProseMirror {
  img {
    margin: auto;
  }

  .is-empty:not(h1), p {
    @apply bg-slate-100 p-1;
  }

  p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #ced4da;
    pointer-events: none;
    height: 0;
  }

  .is-empty::before {
    content: attr(data-placeholder);
    float: left;
    color: #ced4da;
    pointer-events: none;
    height: 0;
  }
}
</style>