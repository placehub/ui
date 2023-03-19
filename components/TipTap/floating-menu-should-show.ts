export default ({ editor, view, state }) => {
  const { selection } = state
  const { $anchor, empty } = selection
  const isRootDepth = $anchor.depth === 1
  const isEmptyTextBlock = $anchor.parent.isTextblock && !$anchor.parent.type.spec.code && !$anchor.parent.textContent

  if (
      !view.hasFocus()
      || !empty
      || !isRootDepth
      || !isEmptyTextBlock
      || !editor.isEditable
      // Не показывает меню в заголовке.
      || selection.head === 1
      // Не показывает меню в подписях для изображений.
      || $anchor?.parent?.type?.name === 'image'
  ) {
    return false
  }

  return true
}