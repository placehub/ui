import { reactive, markRaw } from 'vue'

export default {
  install: (app) => {
    let stack = reactive([])
    let attrs = {}

    const show = (component, attributes = {on: {}, props: {}}) => {
      if (! attributes?.on) {
        attributes.on = {};
      }

      attrs = attributes

      const overlay = {
        key: Math.random().toString(36).substring(2),
        component: markRaw(component),
        ...attributes
      }

      stack.push(overlay)
    }

    /**
     * @param all - скрыть все диалоги.
     */
    const hide = async (all: boolean) => {
      if (all === true) {
        stack.length = 0
      } else {
        stack.splice(stack.length - 1, 1)
      }

      if (typeof attrs?.on?.hide === 'function') {
        setTimeout(attrs.on.hide)
      }
    }

    app.config.globalProperties.$overlay = {
      stack,
      show,
      hide,
    }
  }
}