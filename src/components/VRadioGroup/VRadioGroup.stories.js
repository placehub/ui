import { ref } from 'vue'
import VRadioGroup from './VRadioGroup.vue'

export default {
  title: 'VRadioGroup',
  component: VRadioGroup,
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'danger', 'success'],
    },
  },
};

const Template = (args) => ({
  components: {
    VRadioGroup
  },
  setup() {
    const radio1 = ref(false)
    const radio2 = ref(false)
    const radio3 = ref(false)

    return {
      args,
      radio1,
      radio2,
      radio3
    }
  },
  template: `
    <v-radio-group></v-radio-group>
  `,
});

export const Default = Template.bind({});
