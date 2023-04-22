import { shallowRef, ref } from 'vue'
import { useQuery } from '@placehub/ui'

interface Options {
  fields: string[]
  modelType: string
  multiple?: boolean
}

interface QueryOptions {
  onUploadProgress?: Function
}

const defaultOptions: Options = {
  fields: ['id', 'url'],
  modelType: '',
}

const isUploading = shallowRef(false)
const stubs = ref([])

async function handleUpload(
  options: QueryOptions = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (! defaultOptions.modelType) {
      reject(new Error('Передайте параметр modelType.'))
    }

    if (isUploading.value) {
      reject('Я занят...')
      return
    }

    let inputFile = document.createElement('input')

    inputFile.accept   = 'image/*'
    inputFile.multiple = defaultOptions.multiple
    inputFile.type     = 'file'
    inputFile.click()

    function onChange(event) {
      // Флаг должен быть именно в этом месте.
      isUploading.value = true

      const files = event.target.files
      const formData = new FormData()

      for (let file of files) {
        formData.append('images[]', file)
        stubs.value.push(URL.createObjectURL(file))
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

      useQuery({ query: formData }, options)
        .then((data) => resolve(data))
        .finally(() => {
          isUploading.value = false
          stubs.value = []
        })

      inputFile.removeEventListener('change', onChange)
    }

    inputFile.addEventListener('change', onChange)
  })
}

export default (options) => {
  Object.assign(defaultOptions, options)

  return {
    stubs,
    handleUpload,
  }
}