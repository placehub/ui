<template>
  <article :id="`comment-${comment.id}`">
    <slot :onEdit="onEdit" :onReply="onReply" :isReply="isReply" />
  </article>
</template>

<script>
export default {
  name: 'BaseComment'
}
</script>

<script setup>
import { computed } from 'vue'
import { useCommentsStore } from '@placehub/ui'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const store = useCommentsStore()

const isReply = computed(() => parseInt(store.selectedComment?.id) === parseInt(props.comment.id))

const onEdit = () => {
  store.setSelectedComment(props.comment, 'edit')
}

const onReply = () => {
  if (store.isReply || store.isEdit) {
    store.setSelectedComment()
  } else {
    store.setSelectedComment(props.comment, 'reply')
  }
}
</script>