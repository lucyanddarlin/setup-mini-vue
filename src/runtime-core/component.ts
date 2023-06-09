import { proxyRefs } from "../reactivity/ref"
import { shallowReadonly } from "../reactivity/reactive"
import { isObject } from "../shared"
import { emit } from "./componentEmits"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode, parent) {
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {},
    emit: () => { },
    slots: {},
    parent,
    isMounted: false,
    subTree: {},
    provides: parent ? parent.provides : {}
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
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
    handleSetupResult(instance, setupResult)
  }
  setCurrentInstance(null)
  finishComponentSetup(instance)
}

function handleSetupResult(instance, setupResult: any) {
  // TODO: function
  if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult)
  }
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render
}

let currentInstance = null
export function getCurrentInstance() {
  return currentInstance
}

function setCurrentInstance(instance) {
  currentInstance = instance
}

