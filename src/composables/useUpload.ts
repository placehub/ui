import { useQuery } from '../index'
import { shallowRef, ref } from 'vue'

const isUploading = shallowRef(false)
const progress = shallowRef(0)
const previews = ref([])

interface Options {
  accept?: string
  fields: string[]
  modelType: string
  multiple?: boolean
}

const defaultOptions: Options = {
  accept: 'image/*',
  fields: ['id', 'url'],
  modelType: '',
  multiple: true,
}

const upload = async (callback, options: Options): Promise<void> => {
  options = Object.assign(defaultOptions, options)

  if (! options.modelType) {
    throw new Error('Передайте параметр modelType')
  }

  const inputFile = document.createElement('input')

  inputFile.accept = options.accept
  inputFile.multiple = options.multiple
  inputFile.type = 'file'
  inputFile.click()

  const handle = async (event) => {
    if (isUploading.value) return

    isUploading.value = true

    const formData = new FormData()
    const files = event.target.files

    for (let file of files) {
      formData.append('images[]', file)
      previews.value.push(URL.createObjectURL(file))
    }

    formData.set('operations', JSON.stringify({
      query: `
        mutation ($input: UploadInput!, $images: [Upload!]!) {
          upload(input: $input, images: $images) {
            ${options.fields.join('\n')}
          }
        }
      `,
      variables: {
        input: {
          model_type: options.modelType
        },
        images: new Array(files.length),
      }
    }))

    formData.set('operationName', null)

    formData.set('map', JSON.stringify({
      input: ['variables.$input'],
      images: ['variables.images'],
    }))

    try {
      const { data } = await useQuery({
        query: formData
      }, {
        onUploadProgress: (progressEvent) => {
          progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      })

      callback(data.upload)
    } catch (errors) {
      console.log(errors)
    } finally {
      isUploading.value = false
      progress.value = 0
      inputFile.removeEventListener('change', handle)
    }
  }

  inputFile.addEventListener('change', handle)
}

export default () => {
  return { upload, isUploading, progress, previews }
}