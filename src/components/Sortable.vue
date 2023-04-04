<template>
  <div>
    <slot />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash-es'

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
  },
  mounted() {
    import('@shopify/draggable/lib/sortable')
      .then((Sortable) => {
        const sortable = new Sortable.default(this.$el, {
          draggable: '.drag-handle',
          mirror: {
            appendTo: this.$el,
            constrainDimensions: true,
          },
        })

        sortable.on('sortable:stop', (event) => {
          this.$emit('update:modelValue', this.move(cloneDeep(this.modelValue), event.oldIndex, event.newIndex))
        })
      })
  },
  methods: {
    move(items, oldIndex, newIndex) {
      if (oldIndex >= items.length) {
        let size = newIndex - items.length + 1

        while (size--) {
          items.push(undefined)
        }
      }

      items.splice(newIndex, 0, items.splice(oldIndex, 1)[0])

      return items
    }
  }
}
</script>