import axios from 'axios'

export default {
  install: (app, options) => {
    if (options.window) {
      window = options.window
    }

    app.config.globalProperties.$axios = axios.create({
      baseURL: options?.baseUrl || ''
    })
  }
}