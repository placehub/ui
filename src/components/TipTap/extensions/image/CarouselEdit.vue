<template>
  <div class="p-4">
    <div class="text-lg font-medium mb-4">Редактирование карусели</div>
    <div class="grid grid-cols-4 gap-4 mb-4 drag">
      <div v-for="(element, index) in modelValue" :key="element.id" class="aspect-square relative draghandler">
        <img :src="element.url" alt="" class="object-cover rounded-lg w-full h-full cursor-move" />
        <button type="button" @click="onDelete(index)" class="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
          <Trash class="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
    <footer class="mt-6 space-x-2 flex items-center">
      <Button @click="onAddImages" :loading="isUploading">
        <template #prepend>
          <ImagePlus class="w-5 h-5" />
        </template>
        Добавить фото
      </Button>
      <Button @click="emits('save')" variant="secondary">Сохранить</Button>
    </footer>
  </div>
</template>

<script>
export default {
  mounted() {
    import('@shopify/draggable/lib/sortable')
      .then((data) => {
        const sortable = new data.default(document.querySelector('.drag'), {
          draggable: '.draghandler',
          mirror: {
            appendTo: document.querySelector('.drag'),
            constrainDimensions: true,
          },
        })

        sortable.on('sortable:stop', (event) => {
          this.$emit('update:modelValue', this.arrayMove([...this.modelValue], event.oldIndex, event.newIndex))
        });
      })
  },
  methods: {
    arrayMove(arr, old_index, new_index) {
      if (new_index >= arr.length) {
        let k = new_index - arr.length + 1
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr;
    }
  }
}
</script>

<script setup>
import { Button } from '../../../../index'
import { ImagePlus, Trash } from 'lucide-vue-next'
import useUpload from '../../composables/useUpload'

const { onUpload, isUploading } = useUpload()

const emits = defineEmits(['update:modelValue', 'save', 'upload'])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
})

const onAddImages = async () => {
  await onUpload((images) => {
    emits('update:modelValue', [...props.modelValue, ...images])
  })
}

const onDelete = (index) => {
  const images = [...props.modelValue]
  images.splice(index, 1)
  emits('update:modelValue', images)
}
</script>