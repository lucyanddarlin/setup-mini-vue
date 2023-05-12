import { createRenderer } from '../runtime-core'

function createElement(type) {
  return document.createElement(type)
}

function patchProps(el, key, pervVal, nextVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    el.addEventListener(key.toLowerCase().slice(2), nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}

function insert(el, container) {
  container.append(el)
}

function remove(children) {
  const parent = children.parentNode
  parent.removeChild(children)

}

function setElementText(text, el) {
  el.textContent = text
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
  remove,
  setElementText
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from '../runtime-core'