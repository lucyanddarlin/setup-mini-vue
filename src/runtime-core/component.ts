import { isObject } from "../shared"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {}
  }
  return instance
}

export function setupComponent(instance: any) {
  // TODO:
  // initProps
  // initSlots
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type
  const { setup } = Component
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  if (setup) {
    const setupResult = setup()
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

