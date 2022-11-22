window.global ||= window

import axios from 'axios'

export default {
  install: (app, options) => {
    console.log(window)
    app.config.globalProperties.$axios = axios.create({
      baseURL: options?.baseUrl || ''
    })
  }
}