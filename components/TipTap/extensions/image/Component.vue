<template>
  <NodeViewWrapper :class="{'image': selected}">
    <div v-show="! isEdit">
      <div @click="onUpload">Выбрать фото</div>

      <Swiper class="h-[360px]" :space-between="1" :class="[hasImages ? 'cursor-move' : '']">
        <SwiperSlide v-for="image in node.attrs.images" :key="image.id" class="flex justify-center bg-gray-50">
          <img :src="image.url" alt="" class="h-full object-cover" />
        </SwiperSlide>
      </Swiper>
    </div>
<!--    <button type="button" @click="addParagraph">
      <WrapText class="w-4 h-4" />
    </button>-->
  </NodeViewWrapper>
</template>

<style>
.image {
  @apply ring-blue-300 ring-offset-2 ring;
}
</style>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { WrapText } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { shallowRef } from 'vue'

const props = defineProps(nodeViewProps)

const isEdit = shallowRef(false)
const isLoading = shallowRef(false)
const inputFile = shallowRef()

const hasImages = props.node.attrs.images.length

const addParagraph = () => {
  props.editor
    .chain()
    .createParagraphNear()
    .insertContent('')
    .run()
}

const onImageDeleted = (index) => {
  props.node.attrs.images.splice(index, 1)

  props.updateAttributes({
    images: props.node.attrs.images
  })
}

/*
  Создаем инпут-файл и отправляем изображения на сервер.
 */
const onUpload = () => {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  inputFile.value         = document.createElement('input')
  inputFile.value.accept  = 'image/*'
  inputFile.value.type    = 'file'
  inputFile.value.click()

  const handle = async (event) => {
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

      props.updateAttributes({
        images: [
          ...props.node.attrs.images,
          ...data.upload
        ]
      })
    } catch (errors) {
      console.log(errors)
    } finally {
      isLoading.value = false
      inputFile.value.removeEventListener('change', handle)
    }
  }

  inputFile.value.addEventListener('change', handle)
}
</script>