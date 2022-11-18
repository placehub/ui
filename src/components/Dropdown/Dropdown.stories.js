import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import Button from '../Button/Button.vue'
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
    Button
  },
  setup() {
    return { args }
  },
  template: `<Dropdown>
  <Button>
    Нажми
    <template #append>
      <ChevronDownIcon class="w-4 h-4 text-white" />
    </template>
  </Button>
  <template v-slot:popper="{ hide }">
    <DropdownItem @click="hide" to="/users">Редактировать</DropdownItem>
    <DropdownItem to="/users">Пожаловаться</DropdownItem>
    <DropdownItem to="/users">Удалить</DropdownItem>
  </template>
  </Dropdown>
  `,
});

export const Default = Template.bind({});