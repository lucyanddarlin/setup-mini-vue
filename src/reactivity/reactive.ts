import { mutableHandler, readonlyHandler } from "./baseHandler"

function createReactiveObj(raw, baseHandler) {
  return new Proxy(raw, baseHandler)
}

export function reactive(raw) {
  return createReactiveObj(raw, mutableHandler)
}

export function readonly(raw) {
  return createReactiveObj(raw, readonlyHandler)
}