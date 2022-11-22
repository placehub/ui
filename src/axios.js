import axios from 'axios'

export default {
  install: (app, options) => {
    if (process.client) {
      app.config.globalProperties.$axios = axios.create({
        baseURL: options?.baseUrl || ''
      })
    }
  }
}