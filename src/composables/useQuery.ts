import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'

const useQuery = async ({ query, variables = {} }, options = {}) => {
  const { $auth, $config } = useNuxtApp()

  const instance = axios.create({
    baseURL: $config.public.GRAPHQL_URL,
    headers: {
      Authorization : $auth.strategy.token.get()
    },
    method: 'POST',
  })

  let body = ''

  if (query instanceof FormData) {
    body = query
  } else {
    body = {
      query: query
          .trim()
          .replaceAll(/\s+/ig, ' '),
      variables
    }
  }

  const { data } = await instance({
    data: body,
    ...options
  })

  if (data.errors) {
    throw data.errors
  }

  return {
    data: data.data,
  }
}

export default useQuery
