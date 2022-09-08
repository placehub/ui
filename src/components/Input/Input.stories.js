import { SearchIcon } from '@heroicons/vue/solid'
import VInput from './VInput.vue';

export default {
  title: 'VInput',
  component: VInput,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    type: {
      control: { type: 'radio' },
      options: ['text', 'date'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['default', 'danger', 'success'],
    },
  },
};

const Template = (args) => ({
  components: {
    VInput,
    SearchIcon
  },
  setup() {
    return { args };
  },
  template: `
    <v-input maxlength="5" v-bind="args" placeholder="Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cumque doloremque ea, harum iusto labore, minus nobis non odit optio perspiciatis quos temporibus vel voluptatum?">
      <template v-if="args.prepend" v-slot:prepend>
        <search-icon class="w-5 h-5 text-gray-400" />
      </template>
      <template v-if="args.append" v-slot:append>
        <search-icon class="w-5 h-5 text-gray-400" />
      </template>
    </v-input>
  `,
});

export const Default = Template.bind({});
Default.args = {
  variant:  'default',
};

export const danger = Template.bind({});
danger.args = {
  variant:  'danger',
};

export const success = Template.bind({});
success.args = {
  variant:  'success',
};

export const WithPrependIcon = Template.bind({});
WithPrependIcon.args = {
  variant:  'default',
  prepend: true
};

export const WithAppendIcon = Template.bind({});
WithAppendIcon.args = {
  variant: 'default',
  append: true
};

export const WithPrependAppendIcon = Template.bind({});
WithPrependAppendIcon.args = {
  variant: 'default',
  prepend: true,
  append: true,
};

