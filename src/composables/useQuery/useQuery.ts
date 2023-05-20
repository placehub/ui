import { Query } from './interfaces'
import { useFetch, useNuxtApp } from 'nuxt/app'

const useQuery = async (
  { query, variables = {} }: Query,
  options = {}
) => {
  const { $auth, $config, vueApp } = useNuxtApp()

  options.method = 'POST'

  // Уникальный ключ на основе запроса
  let key = query

  if (Object.keys(variables).length) {
    key += JSON.stringify(variables)
  }

  const { data, refresh, pending } = await useFetch($config.public.GRAPHQL_URL, {
    onRequest({ options }) {
      options.headers = options.headers || {}
      options.headers.Accept = 'application/json'
      options.headers.Authorization = $auth?.strategy?.token?.get()
    },
    body: {
      query: query.trim().replaceAll(/\s+/ig, ' '),
      variables,
    },
    ...options,
    key: btoa(encodeURIComponent(key)),
  })

  if (data.value?.errors) {
    if (!options?.page) {
      if (data.value.errors[0].message === 'Unauthenticated.') {
        const { $overlay, $ui } = vueApp.config.globalProperties

        if ($ui.authenticationDialog) {
          $overlay.show($ui.authenticationDialog)
        }
      }
    }

    throw data.value.errors
  }

  return {
    ...data.value,
    refresh,
    pending,
  }
}

export default useQuery
