<template>
  <button
    :class="classes"
    :type="type"
    :disabled="disabled || loading"
    v-ripple
    @click="onClick($event)"
  >
    <v-loader v-if="loading"></v-loader>
    <span :style="{visibility: loading ? 'hidden' : 'visible'}"><slot></slot></span>
  </button>
</template>

<script>
import VLoader from '../VLoader/VLoader.vue';

export default {
  name: 'Button',
  components: {
    VLoader
  },
  emits: ['click'],
  setup(_, { emit }) {
    const onClick = (event) => emit('click', event)

    return {
      onClick
    }
  },
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator(type) {
        return ['primary', 'secondary', 'danger', 'success'].includes(type)
      },
    },
    type: {
      type: String,
      default: 'button',
      validator(type) {
        return ['button', 'submit', 'reset'].includes(type)
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    classes() {
      const variants = {
        primary:    'text-white bg-indigo-500 enabled:hover:bg-indigo-600 focus:ring-indigo-400 focus:ring-4',
        secondary:  'text-indigo-400 enabled:hover:bg-indigo-50 border border-indigo-200 focus:ring-indigo-100 focus:ring-4',
        danger:     'text-white bg-red enabled:hover:bg-red-dark focus:ring-red-light focus:ring-4',
        success:    'text-white bg-green enabled:hover:bg-green-dark focus:ring-green-light focus:ring-4',
      };

      return {
        'relative font-medium rounded-md text-sm px-5 py-2 h-10 focus:outline-none disabled:opacity-75 transition duration-100 ease-in-out"': true,
        [variants[this.variant]]: true,
      }
    },
  },
}
</script>
