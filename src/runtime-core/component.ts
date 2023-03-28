export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type
  }
  return vnode
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

  if (setup) {
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
  finishComponentSetup(instance)
}

function handleSetupResult(instance, setupResult: any) {
  // TODO: function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render
  }
}

