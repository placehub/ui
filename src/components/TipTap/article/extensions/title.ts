import {
  Node,
  mergeAttributes
} from '@tiptap/core'

export default Node.create({
  name: 'title',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  parseHTML() {
    return [{
      tag: 'h1'
    }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['h1', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})