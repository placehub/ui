import VTagsInput from './VInputTags.vue'
import { ref } from 'vue'

export default {
  title: 'VTagsInput',
  component: VTagsInput,
};

const Template = (args) => ({
  components: {
    VTagsInput
  },
  setup() {
    const tags = ref([])
    const items = ref([])
    const callback = async (event) => {
      await fetch('https://dummyjson.com/todos')
          .then((response) => response.json())
          .then((json) => {
            items.value = json.todos

            if (event.target.value.length > 0) {
              items.value.unshift({
                id: null,
                todo: event.target.value
              })
            }
          });
    }
    return { args, callback, tags, items };
  },
  template: `
    <v-tags-input v-model="tags" key-name="todo" v-bind="args" :items="items" :callback="callback"></v-tags-input>
    {{ tags }}
  `,
});

export const Default = Template.bind({});
