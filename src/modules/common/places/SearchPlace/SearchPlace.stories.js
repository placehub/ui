import SearchPlace from './SearchPlace.vue';
import { ref } from 'vue'
import axios from 'axios'

export default {
  title: 'modules/common/places/search-place',
  component: SearchPlace,
};

const Template = (args) => ({
  components: {
    SearchPlace
  },
  setup() {
    const searchBy = ['countries'];
    const result = ref('')

    const callback = async (query) => {
      const { data: { data: { searchPlaces }}} = await axios.post('http://localhost/graphql', {
        query: `
          query($query: String!, $searchBy: [String]) {
            searchPlaces(query: $query, searchBy: $searchBy) {
              id
              name
              full_name
            }
          }
        `,
        variables: {
          query,
          searchBy
        }
      })

      return searchPlaces
    }

    return {
      args,
      result,
      searchBy,
      callback,
    };
  },
  template: `
    <SearchPlace
      clear-after-select
      :callback="callback"
      v-model="result"
      v-bind="args" />
    {{ result }}
  `,
});

export const Default = Template.bind({});