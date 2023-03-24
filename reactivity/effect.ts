class ReactiveEffect {
  private _fn: any
  constructor(fn, public scheduler?) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    return this._fn()
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
  dep.add(activeEffect)
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

export function effect(fn, { scheduler = null }: { [key: string]: any } = {}) {
  const _effect = new ReactiveEffect(fn, scheduler)
  _effect.run()

  return _effect.run.bind(_effect)
}