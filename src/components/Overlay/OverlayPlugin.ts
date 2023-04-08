import { reactive, markRaw } from 'vue'

export default {
  install: (app) => {
    let stack = reactive([])

    const show = (component, attributes = {on: {}, props: {}}) => {
      if (! attributes?.on) {
        attributes.on = {};
      }

      const overlay = {
        key: Math.random().toString(36).substring(2),
        component: markRaw(component),
        ...attributes
      }

      stack.push(overlay)

      if (stack.length > 0) {
        document.body.style.overflow = 'hidden'

        if (document.body.scrollHeight > window.innerHeight) {
          document.body.style.paddingRight = '17px'
        }
      }
    }

    /**
     * @param all - скрыть все диалоги.
     */
    const hide = (all = false) => {
      if (all) {
        stack.length = 0
      } else {
        stack.splice(stack.length - 1, 1)
      }

      if (stack.length === 0) {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }

    app.config.globalProperties.$overlay = {
      stack,
      show,
      hide,
    }
  }
}