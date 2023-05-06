import { createRenderer } from '../runtime-core'

function createElement(type) {
  return document.createElement(type)
}

function patchProps(el, key, val) {
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (val) {
    if (isOn(key)) {
      console.log(key)
      el.addEventListener(key.toLowerCase().slice(2), val)
    } else {
      el.setAttribute(key, val)
    }
  }
}

function insert(el, container) {
  container.append(el)
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from '../runtime-core'