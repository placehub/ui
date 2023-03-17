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
      || selection.head === 1
  ) {
    return false
  }

  return true
}