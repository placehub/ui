<template>
  <Combobox v-model="selectedItems" @update:modelValue="onSelect">
    <div>
      <ComboboxInput
          :displayValue="(place) => place?.[keyName]"
          @input="onChange"
          autocomplete="off"
          class="input"
          placeholder="Поиск места"
          ref="input"
      />

      <div v-if="items.length" class="relative z-50">
        <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
          <ComboboxOptions
              class="absolute w-full left-0 top-full mt-2 max-h-60 overflow-auto rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <ComboboxOption
                v-for="item in items"
                as="template"
                :key="item[keyId]"
                :value="item"
                v-slot="{ selected, active }"
            >
              <div
                  class="relative cursor-pointer select-none p-4"
                  :class="{
                  'bg-indigo-100': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                    class="block truncate"
                    :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ item[keyName] }}
                  <span v-if="item.id === null">(создать)</span>
                </span>
              </div>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </div>
  </Combobox>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { debounce } from 'lodash-es'
import { useQuery } from '../../../index'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'

const emit = defineEmits([
  'update:modelValue'
])

const props = defineProps({
  modelValue: {
    type: Object,
  },
  searchBy: {
    type: Array,
  },
  clearAfterSelect: {
    type: Boolean,
    default: false
  },
  canCreate: {
    type: Boolean,
    default: false,
  }
})

let selectedItems = ref(props.modelValue)
const items = ref([])
const keyName = 'full_name'
const keyId = 'id'
const input = ref(null)

const onSelect = async (place) => {
  emit('update:modelValue', place)

  if (props.clearAfterSelect) {
    await nextTick()
    selectedItems = ref({
      [keyId]: null,
      [keyName]: ''
    })
    input.value.el.value = ''
    items.value = []
  }
}

const onChange = debounce(async (event) => {
  try {
    const query = event.target.value

    if (query.length > 0) {
      const { data: {searchPlaces} } = await useQuery({
        query: `
          query ($query: String!, $search_by: [String]) {
            searchPlaces(query: $query, search_by: $search_by) {
              id
              name
              full_name
              parent_names
            }
          }
        `,
        variables: {
          query,
          search_by: props.searchBy,
        }
      })

      items.value = searchPlaces

      if (props.canCreate) {
        items.value.unshift({
          id: null,
          full_name: query
        })
      }
    } else {
      items.value = []
    }
  } catch (error) {}
}, 250)
</script>