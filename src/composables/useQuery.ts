import axios from 'axios'
import { useNuxtApp } from 'nuxt/app'

const useQuery = ({ query, variables = {} }, options = {}): Promise<any> => {
  const { $auth, $config } = useNuxtApp()

  const instance = axios.create({
    baseURL: $config.public.GRAPHQL_URL,
    headers: {
      Authorization : $auth.strategy.token.get()
    },
    method: 'POST',
  })

  let body

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

  return new Promise(async (resolve, reject) => {
    const { data } = await instance({
      data: body,
      ...options
    })

    if (data.errors) {
      reject(data.errors)
    }

    resolve(data.data)
  })
}

export default useQuery
