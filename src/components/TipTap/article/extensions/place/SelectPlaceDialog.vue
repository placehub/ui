<template>
  <div class="place-self-center min-w-[320px] flex flex-col bg-white rounded-lg shadow-md max-w-[640px]">
    <div class="p-4 flex-auto">
      <header>
        <h3 class="text-lg font-medium mb-4">Поиск места</h3>
      </header>
      <div>
        <SearchPlace v-model="place" />
      </div>
      <footer class="mt-6">
        <Button @click="emits('submit', place)">Сохранить</Button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { Button, SearchPlace } from '../../../../../index'
import { shallowRef } from 'vue'

const place = shallowRef()

const emits = defineEmits(['submit'])
</script>