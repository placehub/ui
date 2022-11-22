window.axios = require('axios')

export default {
  install: (app, options) => {
    console.log(window)
    app.config.globalProperties.$axios = axios.create({
      baseURL: options?.baseUrl || ''
    })
  }
}