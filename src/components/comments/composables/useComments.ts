import { useQuery } from '@placehub/ui'

interface Options {
  post_id: number|string,
  graphql: {
    COMMENT: string
  }
}

interface Variables {
  page?: number
  order_by?: 'popular' | undefined,
  limit?: number
}

let post_id
let graphql

function getComments({
  page = 1,
  order_by,
  limit = 2,
}: Variables = {}): Promise<any> {
  return useQuery({
    query: `
      query getComments($post_id: ID!, $page: Int, $order_by: String, $limit: Int) {
        comments(post_id: $post_id, page: $page, order_by: $order_by, limit: $limit) {
          ${graphql.COMMENT}
        }
      }
    `,
    variables: {
      post_id,
      page,
      order_by,
      limit,
    },
  })
}

export default (options: Options) => {
  post_id = options.post_id
  graphql = options.graphql

  return {
    getComments,
  }
}