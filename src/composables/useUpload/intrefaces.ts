interface Options {
  fields: string[]
  modelType: string
  multiple?: boolean
}

interface QueryOptions {
  onUploadProgress?: Function
}

export {
  Options,
  QueryOptions,
}