import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'
import { ref } from 'vue'

export default {
  title: 'VListBox',
};

const Template = (args) => ({
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    SelectorIcon
  },
  setup() {
    const people = [
      { name: 'Андрей' },
      { name: 'Денис' },
      { name: 'Дмитрий' },
      { name: 'Андрей' },
      { name: 'Денис' },
      { name: 'Дмитрий' },
      { name: 'Андрей' },
      { name: 'Денис' },
      { name: 'Дмитрий' },
      { name: 'Андрей' },
      { name: 'Денис' },
      { name: 'Дмитрий' },
    ]
    const selectedPerson = ref(people[0])

    return {
      args,
      people,
      selectedPerson
    }
  },
  template: `
    <Listbox v-model="selectedPerson">
      <div class="relative mt-1 text-sm">
        <ListboxButton
            class="transition duration-100 ease-in-out border border-gray-light focus:ring-primary-light focus:border-primary focus:outline-none focus:ring-4 focus-visible:ring-4 w-full cursor-default rounded-md bg-white py-2.5 pl-5 pr-10 text-left relative"
        >
          <span class="block truncate">{{ selectedPerson.name }}</span>
          <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
          <ListboxOptions
              class="border border-primary focus:ring-primary-light focus:outline-none focus:ring-4 focus-visible:ring-4 ring-1 ring-black ring-opacity-5 absolute mt-2 max-h-60 w-full overflow-auto rounded bg-white list-none m-0 p-0"
          >
            <ListboxOption
                v-slot="{ active, selected }"
                v-for="person in people"
                :key="person.name"
                :value="person"
                as="template"
            >
              <li
                  :class="[
                  active ? 'bg-gray-lightest' : '',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                    :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                >{{ person.name }}</span
                >
                <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <CheckIcon class="h-5 w-5 text-green" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  `,
});

export const Default = Template.bind({});
