export default {
  install: (app, options) => {
    app.config.globalProperties.$fetch = fetch(options?.baseUrl || '')
  }
}