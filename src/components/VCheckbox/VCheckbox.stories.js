import { ref } from 'vue'
import VCheckbox from './VCheckbox.vue'

export default {
  title: 'VCheckbox',
  component: VCheckbox,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'danger', 'success'],
    },
  },
};

const Template = (args) => ({
  components: {
    VCheckbox
  },
  setup() {
    const checkbox1 = ref(false)
    const checkbox2 = ref(false)
    const checkbox3 = ref(false)

    return {
      args,
      checkbox1,
      checkbox2,
      checkbox3
    }
  },
  template: `
    <div class="space-y-4">
      <v-checkbox v-model="checkbox1" v-bind="args" id="checkbox-1">
        Чекбокс
        <template #help>
          Вспомогательный текст для чекбокса
        </template>
      </v-checkbox>
      <v-checkbox v-model="checkbox2" v-bind="args" id="checkbox-2">Чекбокс</v-checkbox>
      <v-checkbox v-model="checkbox3" v-bind="args" id="checkbox-3">Чекбокс</v-checkbox>
    </div>
  `,
});

export const Default = Template.bind({});

export const danger = Template.bind({});
danger.args = {
  variant:  'danger',
};

export const success = Template.bind({});
success.args = {
  variant:  'success',
};
