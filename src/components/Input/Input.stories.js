import { ScaleIcon } from '@heroicons/vue/24/solid'
import Input from './Input.vue'
import { ref } from 'vue'

export default {
  title: 'Input',
  component: Input,
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
    Input,
    ScaleIcon
  },
  setup() {
    const err = ref(false)
    return { args, err };
  },
  template: `
    <button @click="err = !err">{{ err }}</button>
    <Input :variant="err ? 'error' : undefined" maxlength="5" v-bind="args" placeholder="Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cumque doloremque ea, harum iusto labore, minus nobis non odit optio perspiciatis quos temporibus vel voluptatum?">
      <template v-if="args.prepend" v-slot:prepend>
        <ScaleIcon class="w-5 h-5 text-gray-400" />
      </template>
      <template v-if="args.append" v-slot:append>
        <ScaleIcon class="w-5 h-5 text-gray-400" />
      </template>
    </Input>
  `,
});

export const Default = Template.bind({});
Default.args = {
  variant:  'default',
};

export const error = Template.bind({});
error.args = {
  variant:  'error',
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

