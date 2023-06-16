import { extend } from "../shared"

/**
 * 当前 effect 实例
 */
let activeEffect
/**
 * 是否进行依赖收集
 */
let shouldTrack
/**
 * 依赖收集容器: targetsMap -> depsMap -> dep
 */
let targetsMap = new Map()
export class ReactiveEffect {
  /**
   * 需要收集的依赖函数
   */
  private _fn: any
  deps = []
  active = true
  public scheduler?: undefined | Function
  public onStop?: () => void
  constructor(fn, scheduler?: Function) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    if (!this.active) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    shouldTrack = false
    return result
  }

  stop() {
    cleanupEffect(this)
    if (this.onStop) this.onStop()
  }
}

function cleanupEffect(effect) {
  if (effect.active) {
    effect.deps.forEach((dep: any) => {
      dep.delete(effect)
    });
    effect.deps.length = 0
    effect.active = false
  }
}

export function track(target, key) {
  if (!isTracking()) return
  // 将要收集的函数存进一个容器里 dep
  // target -> key -> dep
  let depsMap = targetsMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetsMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  if (dep.has(activeEffect)) return
  trackEffects(dep)
}

export function trackEffects(dep) {
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  let depsMap = targetsMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function stop(runner) {
  runner.effect.stop()
}

export function effect(fn, options?: any) {
  const _effect = new ReactiveEffect(fn, options?.scheduler)
  extend(_effect, options)
  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}