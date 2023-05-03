export const extend = Object.assign
export const isObject = (val) => {
  return val !== null && typeof val === 'object'
}
export const hasChanged = (val, newVal) => {
  return !Object.is(val, newVal)
}
export const isOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)


export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ""
  })
}
const capitalize = (str: string) => {
  const newStr = str.charAt(0).toUpperCase() + str.slice(1)
  return newStr
}
export const toHandlerKey = (str: string) => {
  return `on${capitalize(camelize(str))}`
}