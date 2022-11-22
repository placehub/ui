export default {
  install: (app, options) => {
    app.config.globalProperties.$fetch = async (dataD = {}) => {
      const body = dataD instanceof FormData
        ? dataD
        : JSON.stringify(dataD)

      const response = await fetch(options?.baseUrl || '', {
        method: 'POST',
        // mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit

        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body
      })

      const { data } = await response.json()

      return data
    }
  }
}