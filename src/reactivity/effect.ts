import { extend } from "../shared"

class ReactiveEffect {
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
    activeEffect = this
    return this._fn()
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
    effect.active = false
  }
}

let activeEffect
let targetsMap = new Map()
export function track(target, key) {
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
  if (!activeEffect) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  let depsMap = targetsMap.get(target)
  let dep = depsMap.get(key)
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