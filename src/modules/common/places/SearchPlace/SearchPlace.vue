<template>
  <Combobox v-model="selectedItems" @update:modelValue="onSelect">
    <ComboboxInput
        class="input input-default"
        autocomplete="off"
        @input="onChange"
        placeholder="Поиск места"
        ref="input"
        :displayValue="(place) => place[keyName]"
    />

    <div v-if="items.length" class="relative z-50">
      <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
      >
        <ComboboxOptions
            class="absolute w-full left-0 top-full mt-1 max-h-60 overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ComboboxOption
              v-for="item in items"
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
    </div>
  </Combobox>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import debounce from 'lodash/debounce'

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
  callback: {
    type: Function,
    required: true,
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
  const value = event.target.value

  if (! value.length) {
    items.value = []
    return
  }

  try {
    items.value = await props.callback(value)
  } catch (error) {
    console.log(error)
  }
}, 250)
</script>