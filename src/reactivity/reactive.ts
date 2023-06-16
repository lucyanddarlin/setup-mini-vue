import { mutableHandler, readonlyHandler, shallowReadonlyHandlers } from "./baseHandler"

export enum ReactiveFlags {
  isReactive = '__v_isReactive',
  isReadonly = '__v_isReadonly'
}

/**
 * 
 * @param raw 不同类型的 target
 * @param baseHandler 根据不同类型的 target 传入不同的 Handler
 * @returns Proxy
 */
function createReactiveObj(raw, baseHandler) {
  return new Proxy(raw, baseHandler)
}

/**
 * 
 * @param raw 针对 reactive 类型的 target
 * @returns Proxy -- reactive Obj
 */
export function reactive(raw) {
  return createReactiveObj(raw, mutableHandler)
}

/**
 * 
 * @param raw 针对 readonly 类型的 target
 * @returns Proxy -- readonly Obj
 */
export function readonly(raw) {
  return createReactiveObj(raw, readonlyHandler)
}

/**
 * 
 * @param raw 针对 shallowReadonly 类型的 target
 * @returns Proxy -- shallowReadonly Obj
 */
export function shallowReadonly(raw) {
  return createReactiveObj(raw, shallowReadonlyHandlers)
}

/**
 * 
 * @param value 传入检测对象
 * @returns Boolean
 */
export function isReactive(value) {
  // 如果是 proxy 对象, 那么会触发 get 操作
  return !!value[ReactiveFlags.isReactive]
}

/**
 * 
 * @param value 传入检测对象
 * @returns Boolean
 */
export function isReadonly(value) {
  return !!value[ReactiveFlags.isReadonly]
}

/**
 * 
 * @param value 传入检测对象
 * @returns Boolean
 */
export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}