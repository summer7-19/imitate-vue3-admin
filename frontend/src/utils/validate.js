export const isArray = Array.isArray

export const isExternal = (path) => /^(https?:|mailto:|tel:)/.test(path)

export const isEmpty = (value) =>
  value === undefined || value === null || value === ''
