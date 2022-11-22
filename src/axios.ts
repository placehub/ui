import axios from 'axios'

export default {
  install: (app: any, options: object) => {
    app.config.globalProperties.$axios = axios.create({
      baseURL: options?.baseUrl || ''
    })
  }
}