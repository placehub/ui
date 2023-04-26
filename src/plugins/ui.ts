interface Options {
  authenticationDialog?: any
}

export default {
  install(app, options: Options) {
    app.config.globalProperties.$ui = options
  }
}