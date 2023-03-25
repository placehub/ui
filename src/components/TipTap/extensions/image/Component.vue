<template>
  <NodeViewWrapper @click="selectNode" :class="{'ring-blue-300 ring-offset-2 ring': selected}" contenteditable="false"
                   draggable="true"
                   data-drag-handle>
    <figure class="relative h-[360px]">
      <!-- Carousel -->
      <Carousel v-if="hasImages" :modelValue="computedImages" />
      <!-- / Carousel -->

      <div v-if="!hasImages" @click="onUpload" class="flex items-center justify-center h-full cursor-pointer">
        Нажмите, чтобы выбрать изображения
      </div>
      <div v-show="hasImages" @click="showCarouselEditDialog" class="absolute top-0 right-0 z-10 p-2 cursor-pointer flex items-center space-x-2">
        <div class="bg-black/50 text-white rounded-lg py-1 px-2.5">{{ hasImages > 1 ? 'Редактировать' : 'Создать карусель' }}</div>
      </div>
    </figure>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { shallowRef, computed } from 'vue'
import { useQuery } from '../../../../index'
import useOverlay from '../../../Overlay/useOverlay'
import CarouselEditDialog from './CarouselEditDialog.vue'
import Carousel from './Carousel.vue'

const emits = defineEmits(['uploaded'])
const props = defineProps(nodeViewProps)

const isLoading = shallowRef(false)
const inputFile = shallowRef()
const overlay = useOverlay()

const computedImages = computed(() => props.node.attrs.images)
const hasImages = computed(() => computedImages.value.length)

const selectNode = () => {
  props.editor.commands.setNodeSelection(props.getPos())
}

const showCarouselEditDialog = () => {
  overlay.show(CarouselEditDialog, {
    props: {
      modelValue: computedImages,
      isLoading: isLoading
    },
    on: {
      'save': overlay.hide,
      'update:modelValue': (images) => {
        props.updateAttributes({
          images
        })
      },
      detach: (index) => {
        props.editor.commands.insertContentAt(props.getPos() + 1, {
          type: 'image',
          attrs: {
            images: [computedImages.value[index]]
          }
        })
      },
      upload: onUpload
    }
  })
}

const addParagraph = () => {
  props.editor
    .chain()
    .createParagraphNear()
    .insertContent('')
    .run()
}

/*
  Создаем инпут-файл и отправляем изображения на сервер.
 */
const onUpload = async () => {
  inputFile.value          = document.createElement('input')
  inputFile.value.accept   = 'image/*'
  inputFile.value.type     = 'file'
  inputFile.value.multiple = true
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
      if (isLoading.value) {
        return
      }

      isLoading.value = true

      const { data } = await useQuery({
        query: formData
      })

      // Первое изображение вставляем в этот блок.
      props.updateAttributes({
        images: [data.upload[0]]
      })

      // Остальные изображения вставляем в новые блоки.
      if (data.upload.length > 1) {
        data.upload.splice(1).forEach((image, index) => {
          props.editor.commands.insertContentAt(props.getPos() + index, {
            type: 'image',
            attrs: {
              images: [image]
            }
          })
        })
      }
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