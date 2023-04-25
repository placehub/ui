import { createError } from 'nuxt/app'

export default (error) => {
  if (error[0]?.extensions.statusCode > 0) {
    throw createError({
      message:    error[0].message,
      statusCode: error[0].extensions.statusCode,
    })
  }
}