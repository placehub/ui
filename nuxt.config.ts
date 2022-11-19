export default {
  modules: [
    '@nuxtjs/apollo',
  ],
  apollo: {
    clients: {
      default: {
        authHeader:   'Authorization',
        authType:     'Bearer',
        httpEndpoint: 'http://127.0.0.1:8080/graphql',
        tokenName:    'auth._token.local',
        tokenStorage: 'cookie',
      }
    },
  },
}
