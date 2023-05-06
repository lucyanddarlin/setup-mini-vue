import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    let { provides } = currentInstance
    const parentProviders = currentInstance.parent.provides
    // var a = { bg: 'red' }
    // var b = Object.create(a)
    // console.log(b)  // {}
    // console.log(b.__proto__) // {bg: "red"}
    // console.log(b.bg) // red
    console.log(provides, parentProviders);
    if (provides === parentProviders) {
      provides = currentInstance.provides = Object.create(parentProviders)
    }
    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const parentProviders = currentInstance.parent.provides
    if (key in parentProviders) {
      return parentProviders[key]
    } else if (defaultValue) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  }
}