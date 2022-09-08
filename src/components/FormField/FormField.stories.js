import FormField from './FormField.vue';
import Input from '../Input/Input.vue'
import Button from '../Button/Button.vue';
import { useForm } from 'vee-validate';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'FormField',
  component: FormField,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'text', 'danger', 'success'],
    },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { FormField, Button, Input },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    const { handleSubmit } = useForm()

    const onSubmit = handleSubmit((values, actions) => {
      actions.setErrors({
        'title': 'Заполните поле'
      });
    })

    return { args, onSubmit };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: `
    <form @submit.prevent="onSubmit" class="space-y-4">
      <FormField name="title" label="Заголовок путешествия" v-slot="{ hasError }" required v-bind="args">
        <Input placeholder="Введите заголовок" name="title" :has-error="hasError" />
      </FormField>
    
      <Button type="submit">Отправить</Button>
    </form>
  `,
});

// More on args: https://storybook.js.org/docs/vue/writing-stories/args
export const Default = Template.bind({});