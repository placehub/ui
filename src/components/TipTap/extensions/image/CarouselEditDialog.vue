<template>
  <div class="cd-overlay">
    <div class="p-4 flex-auto">
      <header>
        <h3 class="text-lg font-medium mb-4">Редактирование карусели</h3>
      </header>
      <Draggable v-model="localImages" itemKey="id" class="grid grid-cols-4 gap-4 mb-4">
        <template #item="{ element, index }">
          <div class="aspect-square relative">
            <img :src="element.url" alt="" class="object-cover rounded-lg w-full h-full cursor-move" />
          </div>
        </template>
      </Draggable>
      <footer class="mt-6">
        <Button @click="emits('update:modelValue', localImages)">Сохранить</Button>
      </footer>
    </div>
  </div>
</template>

<style>
.cd-overlay {
  @apply place-self-center min-w-[320px] flex flex-col bg-white rounded-lg shadow-md max-w-[640px]
}
</style>

<script setup>
import Draggable from 'vuedraggable'
import { shallowRef } from 'vue'
import { Button } from '../../../../index'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})
const localImages = shallowRef([...props.images])
</script>