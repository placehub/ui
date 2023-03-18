import {
  Node,
  mergeAttributes,
  textblockTypeInputRule
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

  /*addInputRules() {
    return textblockTypeInputRule({
      find: new RegExp(`^(#{1,1})\\s$`),
      type: this.type,
    })
  },*/
})