interface Options {
  multiple?: boolean
  mutation: string
  variables: object
}

interface QueryOptions {
  onUploadProgress?: Function
}

export {
  Options,
  QueryOptions,
}