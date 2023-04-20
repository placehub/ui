<template>
  <div>
    <slot :getComments="getComments" />
  </div>
</template>

<script setup lang="ts">
import { COMMENT } from './graphql'
import { shallowRef } from 'vue'
import { useCommentsStore } from './store'
import { useQuery } from '../../index'

interface Props {
  commentsCount: number,
  postId: string|number,
}

const props = withDefaults(defineProps<Props>(), {
  commentsCount: 0,
})

const store = useCommentsStore()
const page = shallowRef(1)

store.$patch({
  comments: await getComments({
    page: 1
  })
})

async function getComments({ page = 1 }) {
  try {
    const { data } = await useQuery({
      query: `
        query getComments($post_id: ID!, $page: Int!) {
          comments(post_id: $post_id, page: $page) {
            ${COMMENT}
          }
        }
      `,
      variables: {
        post_id: props.postId,
        page,
      }
    })

    return data.comments
  } catch (error) {
    console.log(error)
  }
}
</script>