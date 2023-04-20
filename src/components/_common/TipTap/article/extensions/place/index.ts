import Component from './Component.vue'
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

export default Node.create({
  name: 'place',

  group: 'block',

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      id: {
        default: null,
      },
      name: {
        default: null
      }
    }
  },

  parseHTML() {
    return [{
      tag: 'place',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['place', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})