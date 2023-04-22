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
import { computed, nextTick } from 'vue'
import { useCommentsStore } from '@placehub/ui'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const store = useCommentsStore()

const isReply = computed(() => parseInt(store.selectedComment?.id) === parseInt(props.comment.id))

const onEdit = async () => {
  store.setSelectedComment(props.comment, 'edit')

  await nextTick()

  const header = document.querySelector('#header')
  const target = document.querySelector(`#comment-form-${props.comment.id}`).offsetTop

  window.scrollTo({
    behavior: 'smooth',
    top: (target - header.offsetHeight) - 120,
  })
}

const onReply = () => {
  if (store.isReply || store.isEdit) {
    store.setSelectedComment()
  } else {
    store.setSelectedComment(props.comment, 'reply')
  }
}
</script>