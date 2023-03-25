import { mutableHandler, readonlyHandler, shallowReadonlyHandlers } from "./baseHandler"

export enum ReactiveFlags {
  isReactive = '__v_isReactive',
  isReadonly = '__v_isReadonly'
}

function createReactiveObj(raw, baseHandler) {
  return new Proxy(raw, baseHandler)
}

export function reactive(raw) {
  return createReactiveObj(raw, mutableHandler)
}

export function readonly(raw) {
  return createReactiveObj(raw, readonlyHandler)
}
export function shallowReadonly(raw) {
  return createReactiveObj(raw, shallowReadonlyHandlers)
}

export function isReactive(value) {
  // 如果是 proxy 对象, 那么会触发 get 操作
  return !!value[ReactiveFlags.isReactive]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.isReadonly]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}