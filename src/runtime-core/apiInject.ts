import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    console.log(currentInstance)
    currentInstance.providers[key] = value
  }
}

export function inject(key) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    const parentProviders = currentInstance.parent.providers
    return parentProviders[key]
  }
}