import { useQuery } from '../../../index'
import { COMMENT } from '../graphql'

interface Options {
  post_id: number|string
}

interface Variables {
  page?: number
}

let post_id

function getComments({
  page = 1,
}: Variables = {}): Promise<any> {
  return useQuery({
    query: `
      query getComments($post_id: ID!, $page: Int) {
        comments(post_id: $post_id, page: $page) {
          ${COMMENT}
        }
      }
    `,
    variables: {
      post_id,
      page,
    }
  })
}

export default (options: Options) => {
  post_id = options.post_id

  return {
    getComments,
  }
}