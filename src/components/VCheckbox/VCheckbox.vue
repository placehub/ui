<template>
  <div role="checkbox" :class="{'opacity-50': disabled}">
    <div class="flex items-start">
      <input
          :aria-checked="checked"
          :aria-describedby="`${id}-checkbox-help`"
          :checked="checked"
          :class="classes"
          :disabled="disabled"
          :id="id"
          :name="name"
          :value="modelValue"
          type="checkbox"
          @input="$emit('update:modelValue', !modelValue)">
      <label class="text-sm font-semibold ml-2 -mt-0.5" :for="id"><slot /></label>
    </div>
    <div v-if="hasHelpSlot" class="ml-6">
      <p :id="`${id}-checkbox-help`" class="text-xs text-gray-500"><slot name="help" /></p>
    </div>
  </div>
</template>

<script>
import { computed, useSlots } from 'vue';

export default {
  name: 'VInput',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String
    },
    id: {
      type: String,
    },
    checked: {
      type: Boolean,
    },
    variant: {
      type: String,
      default: 'default',
      validator(type) {
        return ['default', 'danger', 'success'].includes(type)
      },
    },
    value: {
      type: String
    },
  },
  setup({ variant }) {
    const slots = useSlots()

    const hasHelpSlot = computed(() => {
      return !!slots.help
    })

    return {
      hasHelpSlot,
      classes: computed(() => {
        const variants = {
          default:    'border border-primary checked:bg-primary-light focus:ring-primary-light',
          secondary:  'border border-secondary checked:bg-secondary-light focus:ring-secondary-light',
          danger:   'border border-red checked:bg-red-light focus:ring-red-light',
          success:   'border border-green checked:bg-green-light focus:ring-green-light',
        };

        return {
          'flex-shrink-0 w-4 h-4 focus:ring-2 rounded appearance-none transition duration-100 ease-in-out': true,
          [variants[variant]]: true,
        }
      })
    }
  },
}
</script>

<style>
[type=checkbox]:checked {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 16 16' fill='%23fff' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z'/%3E%3C/svg%3E");
}
</style>
