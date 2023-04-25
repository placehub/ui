import axios, { AxiosInstance } from 'axios'
import { Options, QueryOptions } from './intrefaces'
import { shallowRef } from 'vue'
import { useNuxtApp } from 'nuxt/app'

let axiosInstance: AxiosInstance

function useUpload(options = {}) {
  const isUploading = shallowRef(false)

  async function handleUpload(axiosOptions: QueryOptions = {}): Promise<any> {
    if (! axiosInstance) {
      const { $auth, $config } = useNuxtApp()

      axiosInstance = axios.create({
        baseURL: $config.public.GRAPHQL_URL,
        headers: {
          Authorization: $auth.strategy.token.get(),
        },
        method: 'POST',
      })
    }

    return new Promise((resolve, reject) => {
      if (isUploading.value) {
        reject('Я занят...')
        return
      }

      const inputFile = createInputFile()
      inputFile.click()

      function onChange(event) {
        // Флаг должен быть именно в этом месте.
        isUploading.value = true

        const files = event.target.files
        const formData = new FormData()

        for (let file of files) {
          formData.append('images[]', file)
        }

        const variables = {
          images: new Array(files.length),
        }

        const map = {
          images: ['variables.images'],
        }

        if (options.variables) {
          Object.assign(variables, options.variables)
          map.input = ['variables.$input']
        }

        formData.set('operations', JSON.stringify({
          query: options.mutation,
          variables,
        }))

        formData.set('operationName', null)
        formData.set('map', JSON.stringify(map))

        axiosInstance({
          data: formData,
          ...axiosOptions
        })
            .then(({ data }) => resolve(data))
            .catch((error) => reject(error))
            .finally(() => {
              isUploading.value = false
            })

        inputFile.removeEventListener('change', onChange)
      }

      inputFile.addEventListener('change', onChange)
    })
  }

  return {
    handleUpload
  }
}

function createInputFile(): HTMLInputElement {
  const input = document.createElement('input')

  input.accept    = 'image/*'
  input.multiple  = true
  input.type      = 'file'

  return input
}

export default useUpload