import Component from './Component.vue'
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

export default Node.create({
  name: 'image',

  group: 'block',

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [{
      tag: 'image',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['image', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  }
})