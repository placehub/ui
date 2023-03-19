<template>
  <NodeViewWrapper @click="selectNode" :class="{'image': selected}" style="margin: 0 -24px;">
    <div v-if="! isEdit" class="relative">
      <Swiper class="h-[360px]" :space-between="1" :class="[hasImages ? 'cursor-move' : '']">
        <SwiperSlide v-for="image in node.attrs.images" :key="image.id" class="flex justify-center bg-gray-50">
          <img :src="image.url" alt="" class="h-full object-cover" />
        </SwiperSlide>
      </Swiper>
      <div v-show="! hasImages" @click="onUpload">Выбрать фото</div>
      <div v-show="hasImages" @click="overlay.show(CarouselDialog, {
        props: {
          images: node.attrs.images
        },
        on: {
          'update:modelValue': (images) => {
            updateAttributes({
              images
            })
            overlay.hide()
          }
        }
      })" class="absolute top-0 right-0 z-10 p-2 cursor-pointer">
        <div class="bg-black/50 text-white rounded-full py-1 px-2.5">{{ hasImages > 1 ? 'Редактировать' : 'Создать карусель' }}</div>
      </div>
    </div>

    <div v-show="isEdit">
      <div @click="isEdit = !isEdit">edit</div>

      <div @click="onUpload">Выбрать фото</div>
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
import { Swiper, SwiperSlide } from 'swiper/vue'
import { shallowRef, computed } from 'vue'
import useOverlay from '../../../Overlay/useOverlay'
import CarouselDialog from './CarouselDialog.vue'

const props = defineProps(nodeViewProps)

const isEdit = shallowRef(false)
const isLoading = shallowRef(false)
const inputFile = shallowRef()
const overlay = useOverlay()

const hasImages = computed(() => props.node.attrs.images.length)

const selectNode = () => {
  props.editor.commands.setNodeSelection(props.getPos())
}

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