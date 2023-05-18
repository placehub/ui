<template>
  <Combobox :modelValue="modelValue" @update:modelValue="onSelect">
    <div class="relative">
      <ComboboxInput
        :displayValue="(place) => place?.full_name"
        :placeholder="placeholder"
        autocomplete="off"
        class="input"
        ref="input"
        @input="onChange" />
      <button v-if="clearable && modelValue?.name" @click="onClear" class="absolute top-0 right-0 h-full p-1 aspect-square">
        <span class="transition-colors block text-indigo-200 h-full bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-500 rounded flex items-center justify-center">
          <X class="mx-auto" />
        </span>
      </button>
    </div>

    <div v-if="items.length" class="relative z-50">
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ComboboxOptions
            class="absolute w-full left-0 top-full mt-2 max-h-60 overflow-auto rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <ComboboxOption v-for="item in items" as="template" :key="item[keyId]" :value="item" v-slot="{ selected, active }">
            <div class="relative cursor-pointer select-none p-2" :class="{'bg-indigo-100': active, 'text-gray-900': !active}">
              <div class="truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                <div class="font-medium">{{ item[keyName] }}</div>
                <div class="text-sm text-gray-400">{{ item.parent_names }}</div>
                <span v-if="item.id === null">(создать)</span>
              </div>
            </div>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import {nextTick, ref, withDefaults} from 'vue'
import {debounce} from 'lodash-es'
import {useQuery} from '../../../index'
import { X } from 'lucide-vue-next'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import Button from '../../_common/Button/Button.vue';

const emit = defineEmits([
  'update:modelValue'
])

interface Props {
  modelValue?: object
  creatable?: boolean
  searchable?: boolean
  clearable?: boolean
  placeholder?: string
  options?: {
    searchBy?: 'country' | 'region' | 'locality' | 'poi',
    parentId?: number | string
  }
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  placeholder: 'Введите название места'
})

const items = ref([])
const keyName = 'name'
const keyId = 'id'
const input = ref(null)

const onSelect = async (place) => {
  emit('update:modelValue', place)
}

const onClear = () => {
  input.value.el.value = ''
  items.value = []
  emit('update:modelValue', {
    [keyId]: null,
    [keyName]: '',
  })
}

const onChange = debounce(async (event) => {
  try {
    const query = event.target.value

    if (query.length > 0) {
      if (props.searchable) {
        const {data: {searchPlaces}} = await useQuery({
          query: `
          query ($query: String!, $searchBy: String, $parentId: ID) {
            searchPlaces(query: $query, searchBy: $searchBy, parentId: $parentId) {
              id
              name
              full_name
              parent_names
              lat
              lng
            }
          }
        `,
          variables: {
            query,
            searchBy: props.options?.searchBy,
            parentId: props.options?.parentId,
          }
        })

        items.value = searchPlaces
      } else {
        items.value = []
      }

      if (props.creatable) {
        items.value.unshift({
          id: null,
          name: query,
          full_name: query,
        })
      }
    } else {
      items.value = []
    }
  } catch (error) {
  }
}, 250)
</script>