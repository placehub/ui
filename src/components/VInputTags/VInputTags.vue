<template>
  <Combobox v-model="selectedItems" @update:modelValue="emit('update:modelValue', $event)" multiple>
    <div class="relative mt-1">
      <div class="relative">
        <div
            class="flex space-x-1 flex-wrap border border-gray-light focus:ring-gray-lightest relative w-full rounded text-sm p-1.5 focus:outline-none focus:ring-4 disabled:opacity-75 transition duration-100 ease-in-out">
          <ul class="flex flex-wrap gap-2  w-full">
            <li v-for="(person, index) in selectedItems" :key="person[keyId]"
                class="flex rounded items-center py-1 pl-2 pr-1 bg-indigo-500">
              <span class="mr-2 max-w-40 truncate">{{ person[keyName] }}</span>
              <x-icon class="w-5 h-5 bg-white rounded" @click="selectedItems.splice(index, 1)"></x-icon>
            </li>

            <li class="flex-auto">
              <ComboboxInput
                  class="p-1 w-full focus:outline-none"
                  autocomplete="off"
                  @input="query = $event.target.value"
                  @change="callback"
                  placeholder="Добавить тег"
                  :displayValue="(person) => person[keyName]"
              />

              <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="query = ''"
              >
                <ComboboxOptions
                    class="absolute max-w-60 mt-1 max-h-60 overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <ComboboxOption
                    v-for="item in filteredItems"
                    as="template"
                    :key="item[keyId]"
                    :value="item"
                    v-slot="{ selected, active }"
                  >
                    <div
                        class="relative cursor-default select-none py-2 pl-10 pr-4"
                        :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
                    >
                <span
                    class="block truncate"
                    :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ item[keyName] }}
                </span>
                    </div>
                  </ComboboxOption>
                </ComboboxOptions>
              </TransitionRoot>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </Combobox>
</template>

<script setup>
import { ref, computed } from 'vue'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import {
  CheckIcon,
  XIcon
} from '@heroicons/vue/solid'

const emit = defineEmits([
  'update:modelValue'
])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  items: {
    type: Array,
    default: () => []
  },
  keyId: {
    type: String,
    default: 'id',
  },
  keyName: {
    type: String,
    default: 'name',
  },
  callback: {
    type: Function,
    required: true
  }
})

let query = ref('')

let selectedItems = ref(props.modelValue)

let filteredItems = computed(() => {
  const filter = () => {
    let items = props.items;

    // Исключаем уже добавленные теги.
    selectedItems.value.forEach(selected => {
      props.items.forEach((newItem, index) => {
        if (
            selected[props.keyName].toLowerCase().replace(/\s+/g, '') ===
            newItem[props.keyName].toLowerCase().replace(/\s+/g, '')
        ) {
          items.splice(index, 1)
        }
      })
    })

    return items.filter((item) =>
      item[props.keyName]
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, '')))
  }

  return query.value === ''
    ? []
    : filter()
})
</script>