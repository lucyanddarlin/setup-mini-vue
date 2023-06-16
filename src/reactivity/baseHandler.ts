import { extend, isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGetter = createGetter(true)
const shallowReadonlyGetter = createGetter(true, true)

/**
 * @description 创建 getter
 * @param isReadonly 控制是否为 readonly 对象 
 * @param isShallow 控制是否为 isShallow 对象 
 * @returns 
 */
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.isReactive) {
      return !isReadonly
    } else if (key === ReactiveFlags.isReadonly) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    // 响应式最外层
    if (isShallow) {
      return res
    }
    // 循环递归创建响应式
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    // readonly 无法 set ,无需收集依赖
    if (!isReadonly) track(target, key)
    return res
  }
}

/**
 * @description 创建 setter
 * @returns 
 */
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
