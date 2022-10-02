import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import VButton from '../VButton/VButton.vue'
import { ChevronDownIcon } from '@heroicons/vue/outline'

export default {
  title:    'Dropdown',
  component: Dropdown,
}

const Template = (args) => ({
  components: {
    Dropdown,
    DropdownItem,
    ChevronDownIcon,
    VButton
  },
  setup() {
    return { args }
  },
  template: `<Dropdown>
  <VButton>
    Нажми
    <template #append>
      <ChevronDownIcon class="w-4 h-4 text-white" />
    </template>
  </VButton>
  <template v-slot:popper="{ hide }">
    <DropdownItem @click="hide" to="/users">Редактировать</DropdownItem>
    <DropdownItem to="/users">Пожаловаться</DropdownItem>
    <DropdownItem to="/users">Удалить</DropdownItem>
  </template>
  </Dropdown>
  `,
});

export const Default = Template.bind({});