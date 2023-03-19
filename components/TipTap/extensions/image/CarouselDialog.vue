<template>
  <div class="place-self-center top-10 min-w-[320px] flex flex-col max-w-2xl bg-white rounded-lg shadow-md">
    <div class="p-4 flex-auto" style="width: 640px;">
      <Draggable v-model="localImages" @update:modelValue="emits('update:modelValue', $event)" itemKey="id" class="grid grid-cols-4 gap-4">
        <template #item="{ element, index }">
          <div class="aspect-square relative">
            <img :src="element.url" alt="" class="object-cover rounded-lg w-full h-full cursor-move" />
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup>
import Draggable from 'vuedraggable'
import { shallowRef } from 'vue'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const localImages = shallowRef([...props.images])
</script>