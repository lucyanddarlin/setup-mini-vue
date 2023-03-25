import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGetter = createGetter(true)
const shallowReadonlyGetter = createGetter(true, true)

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.isReactive) {
      return !isReadonly
    } else if (key === ReactiveFlags.isReadonly) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    if (isShallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    if (!isReadonly) track(target, key)
    return res
  }
}
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

export const mutableHandler = {
  get,
  set
}
export const readonlyHandler = {
  get: readonlyGetter,
  set(target, key, value) {
    console.warn(`key${key} set 失败,因为 target${target} 是 readonly`, target)
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandler, {
  get: shallowReadonlyGetter
})
