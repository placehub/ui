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
const previews = ref([])

async function handleUpload(
  options: QueryOptions = {}
): Promise<object> {
  if (! defaultOptions.modelType) {
    throw new Error('Передайте параметр modelType.')
  }

  if (isUploading.value) {
    return
  }

  isUploading.value = true

  const inputFile = document.createElement('input')

  inputFile.accept   = 'image/*'
  inputFile.multiple = defaultOptions.multiple
  inputFile.type     = 'file'
  inputFile.click()

  return new Promise((resolve) => {
    function onChange(event) {
      const formData = new FormData()
      const files = event.target.files

      for (let file of files) {
        formData.append('images[]', file)
        previews.value.push(URL.createObjectURL(file))
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

      try {
        resolve(useQuery({ query: formData }, options))
      } catch (error) {
        console.log(error)
      } finally {
        isUploading.value = false
        inputFile.removeEventListener('change', onChange)
      }
    }

    inputFile.addEventListener('change', onChange)
  })
}

export default (options) => {
  Object.assign(defaultOptions, options)

  return {
    handleUpload,
  }
}