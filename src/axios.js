export default {
  install: (app, options) => {
    app.config.globalProperties.$fetch = async (data = {}) => {
      const body = data instanceof FormData
        ? data
        : JSON.stringify(data)

      const response = await fetch(options?.baseUrl || '', {
        method: 'POST',
        // mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit

        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body
      })

      return await response.json()
    }
  }
}