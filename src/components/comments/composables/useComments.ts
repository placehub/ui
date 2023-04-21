import { useQuery } from '@placehub/ui'

interface Options {
  post_id: number|string,
  graphql: {
    COMMENT: string
  }
}

interface Variables {
  page?: number
  order_by?: 'popular'
}

let post_id
let graphql

function getComments({
  page = 1,
  order_by,
}: Variables = {}): Promise<any> {
  return useQuery({
    query: `
      query getComments($post_id: ID!, $page: Int, $order_by: String) {
        comments(post_id: $post_id, page: $page, order_by: $order_by) {
          ${graphql.COMMENT}
        }
      }
    `,
    variables: {
      post_id,
      page,
      order_by,
    }
  })
}

export default (options: Options) => {
  post_id = options.post_id
  graphql = options.graphql

  return {
    getComments,
  }
}