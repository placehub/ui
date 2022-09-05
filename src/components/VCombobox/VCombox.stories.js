import {ref, computed} from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import {CheckIcon, SelectorIcon, XIcon} from '@heroicons/vue/solid'

export default {
  title: 'VComboBox',
};

const Template = (args) => ({
  components: {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
    TransitionRoot,
    CheckIcon,
    SelectorIcon,
    XIcon
  },
  setup() {
    let people = ref([]);
    const selectedPeople = ref([])
    let query = ref('')
    let filteredPeople = computed(() =>
        query.value === ''
            ? people.value
            : people.value.filter((person) =>
                person.todo
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.value.toLowerCase().replace(/\s+/g, ''))
            )
    )

    const onInput = async (event) => {
      fetch('https://dummyjson.com/todos')
          .then((response) => response.json())
          .then((json) => people.value = json.todos);
      /*people.value = await new Promise((resolve) => {
        setTimeout(() => {
          if (event.target.value.length > 0) {
            resolve([
              {id: 0, name: event.target.value },
              {id: 1, name: 'Durward Reynolds'},
              {id: 2, name: 'Kenton Towne'},
              {id: 3, name: 'Therese Wunsch'},
              {id: 4, name: 'Benedict Kessler'},
              {id: 5, name: 'Katelyn Rohan'},
            ]);
          } else {
            resolve([])
            query.value = ''
          }
        }, 500);
      });*/
    }

    return {
      args,
      onInput,
      people,
      selectedPeople,
      query,
      filteredPeople
    }
  },
  template: `
    <Combobox v-model="selectedPeople" multiple>
    <div class="relative mt-1">
      <div class="relative">

        <div
            class="flex space-x-1 flex-wrap border border-gray-light focus:ring-gray-lightest relative w-full rounded text-sm p-1.5 focus:outline-none focus:ring-4 disabled:opacity-75 transition duration-100 ease-in-out">
          <ul class="flex flex-wrap gap-2  w-full">
            <li v-for="(person, index) in selectedPeople" :key="person.id"
                class="flex rounded items-center py-1 pl-2 pr-1 bg-indigo-500">
              <span>{{ person.todo }}</span>
              <x-icon class="w-5 h-5 bg-white rounded" @click="selectedPeople.splice(index, 1)"></x-icon>
            </li>
            <li class="flex-auto">
              <ComboboxInput
                  class="p-1 w-full focus:outline-none"
                  autocomplete="off"
                  @change="onInput"
                  placeholder="Добавить тег"
                  :displayValue="(person) => person.todo"
              />

              <TransitionRoot
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  @after-leave="query = ''"
              >
                <ComboboxOptions
                    class="absolute max-w-60 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <div
                      v-if="filteredPeople.length === 0 && query !== ''"
                      class="relative cursor-default select-none py-2 px-4 text-gray-700"
                  >
                    Nothing found.
                  </div>

                  <ComboboxOption
                      v-for="person in filteredPeople"
                      as="template"
                      :key="person.id"
                      :value="person"
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
                  {{ person.todo }}
                </span>
                      <span
                          v-if="selected"
                          class="absolute inset-y-0 left-0 flex items-center pl-3"
                          :class="{ 'text-white': active, 'text-teal-600': !active }"
                      >
                  <CheckIcon class="h-5 w-5" aria-hidden="true"/>
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
  `,
});

export const Default = Template.bind({});
