import Textarea from './Textarea.vue';

export default {
  title: 'Textarea',
  component: Textarea,
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
    Textarea,
  },
  setup() {
    return { args };
  },
  template: `
    <Textarea />
  `,
});

export const Default = Template.bind({});
Default.args = {
  variant:  'default',
};
