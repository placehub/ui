import { isTextSelection } from '@tiptap/core'

export default ({ editor, view, state, from, to }) => {
  const { doc, selection } = state
  const { empty, $anchor, node } = selection

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection)

  // When clicking on a element inside the bubble menu the editor "blur" event
  // is called and the bubble menu item is focussed. In this case we should
  // consider the menu as part of the editor and keep showing the menu
  // const isChildOfMenu = this.element.contains(document.activeElement)

  const hasEditorFocus = view.hasFocus() // || isChildOfMenu

  let hasBlocks = 0

  doc.nodesBetween(from, to, (node) => {
    if (node.type.name === 'image' || node.type.name === 'title' || node.type.name === 'place') {
      hasBlocks++
    }
  })

  if (
      !hasEditorFocus
      || empty
      || isEmptyTextBlock
      || !editor.isEditable
      // Не показывает меню в заголовке.
      || $anchor.parent.type.name === 'title'
      // Не показывает меню для блока изображений.
      || hasBlocks > 0
  ) {
    return false
  }

  return true
}