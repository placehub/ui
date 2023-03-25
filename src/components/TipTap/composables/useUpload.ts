import { useQuery } from '../../../index'
import { shallowRef } from 'vue'

const isUploading = shallowRef(false)

const onUpload = async (callback): Promise<void> => {
  const inputFile = document.createElement('input')

  inputFile.accept   = 'image/*'
  inputFile.type     = 'file'
  inputFile.multiple = true
  inputFile.click()

  const handle = async (event) => {
    if (isUploading.value) {
      return
    }

    isUploading.value = true

    const formData = new FormData()
    const files = event.target.files

    for (let file of files) {
      formData.append('images[]', file)
    }

    formData.set('operations', JSON.stringify({
      query: `
        mutation ($input: UploadInput!, $images: [Upload!]!) {
          upload(input: $input, images: $images) {
            id
            url
          }
        }
      `,
      variables: {
        input: {
          model_type: 'posts'
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
      })

      callback(data.upload)
    } catch (errors) {
      console.log(errors)
    } finally {
      isUploading.value = false
      inputFile.removeEventListener('change', handle)
    }
  }

  inputFile.addEventListener('change', handle)
}

export default () => {
  return { onUpload, isUploading }
}