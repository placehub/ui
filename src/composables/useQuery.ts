import { useFetch, useNuxtApp } from 'nuxt/app'

interface Query {
  query: string
  variables?: object
}

const useQuery = async (
  { query, variables = {} }: Query,
  options = {}
) => {
  const { $auth, $config } = useNuxtApp()

  options.method = 'POST'

  const { data, refresh, pending } = await useFetch($config.public.GRAPHQL_URL, {
    onRequest({ options }) {
      options.headers = options.headers || {}
      options.headers.Accept = 'application/json'
      options.headers.Authorization = $auth.strategy.token.get()
    },
    body: {
      query: query.trim().replaceAll(/\s+/ig, ' '),
      variables,
    },
    ...options,
    key: btoa(encodeURIComponent(query)) // Уникальный ключ на основе запроса.
  })

  if (data.value?.errors) {
    throw data.value.errors
  }

  return {
    ...data.value,
    refresh,
    pending,
  }
}

export default useQuery
