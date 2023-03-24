<template>
  <div class="place-self-center min-w-[320px] flex flex-col bg-white rounded-lg shadow-md max-w-[640px]">
    <div class="p-4 flex-auto">
      <header>
        <h3 class="text-lg font-medium mb-4">Редактирование карусели</h3>
      </header>
      <Draggable :modelValue="modelValue" @update:modelValue="emits('update:modelValue', $event)" itemKey="id" class="grid grid-cols-4 gap-4 mb-4">
        <template #item="{ element, index }">
          <div class="aspect-square relative">
            <img :src="element.url" alt="" class="object-cover rounded-lg w-full h-full cursor-move" />
<!--            <button type="button" @click="onDelete(index)" class="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
              <Unlink class="w-4 h-4 text-white" />
            </button>-->
            <button type="button" @click="onDelete(index)" class="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
              <Trash class="w-4 h-4 text-white" />
            </button>
          </div>
        </template>

        <template #footer>
          <button :disabled="isLoading" title="Создать карусель изображений" class="relative flex items-center justify-center bg-gray-200 hover:bg-indigo-300 hover:text-indigo-500 text-gray-400 transition-colors aspect-square rounded-lg" type="button" @click="emits('upload')">
            <ImagePlus class="w-12 h-12" />
            <Loader v-show="isLoading" class="z-10 bg-black/50" />
          </button>
        </template>
      </Draggable>
      <footer class="mt-6">
        <Button @click="emits('save')">Сохранить</Button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import Draggable from 'vuedraggable'
import { Button, Loader } from '../../../../index'
import { ImagePlus, Trash, Unlink } from 'lucide-vue-next'

const emits = defineEmits(['update:modelValue', 'save', 'upload', 'detach'])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean
  }
})

/*
  Изображение будет откреплено от текущего набора и вставлено отдельно.
 */
const onDetach = async (index) => {
  emits('detach', index)
  onDelete(index)
}

const onDelete = (index) => {
  const images = [...props.modelValue]
  images.splice(index, 1)
  emits('update:modelValue', images)
}
</script>