import axios, { AxiosInstance } from 'axios'
import { Options, QueryOptions } from './intrefaces'
import { shallowRef } from 'vue'
import { useNuxtApp } from 'nuxt/app'

let axiosInstance: AxiosInstance

const defaultOptions: Options = {
  fields: ['id', 'url'],
  modelType: '',
}

const isUploading = shallowRef(false)

async function handleUpload(
    options: QueryOptions = {}
): Promise<any> {
  if (! axiosInstance) {
    const {$auth, $config} = useNuxtApp()

    axiosInstance = axios.create({
      baseURL: $config.public.GRAPHQL_URL,
      headers: {
        Authorization: $auth.strategy.token.get(),
      },
      method: 'POST',
    })
  }


  return new Promise((resolve, reject) => {
    if (! defaultOptions.modelType) {
      reject(new Error('Передайте параметр modelType.'))
    }

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

      formData.set('operations', JSON.stringify({
        query: `
          mutation upload($input: UploadInput!, $images: [Upload!]!) {
            images: upload(input: $input, images: $images) {
              ${defaultOptions.fields.join('\n')}
            }
          }
        `,
        variables: {
          input: {
            model_type: defaultOptions.modelType,
          },
          images: new Array(files.length),
        }
      }))

      formData.set('operationName', null)
      formData.set('map', JSON.stringify({
        input:  ['variables.$input'],
        images: ['variables.images'],
      }))

      axiosInstance({
        data: formData,
        ...options
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

function createInputFile(): HTMLInputElement {
  const input = document.createElement('input')

  input.accept    = 'image/*'
  input.multiple  = true
  input.type      = 'file'

  return input
}

export default (options) => {
  Object.assign(defaultOptions, options)

  return {
    handleUpload,
  }
}