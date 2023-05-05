import { shallowReadonly } from "../reactivity/reactive"
import { isObject } from "../shared"
import { emit } from "./componentEmits"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {},
    emit: () => { },
    slots: {}
  }

  instance.emit = emit.bind(null, instance) as any
  return instance
}

export function setupComponent(instance: any) {
  // TODO:
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type
  const { setup } = Component
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
    handleSetupResult(instance, setupResult)
  }
  finishComponentSetup(instance)
}

function handleSetupResult(instance, setupResult: any) {
  // TODO: function
  if (isObject(setupResult)) {
    instance.setupState = setupResult
  }
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render
}

