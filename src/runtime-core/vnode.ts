import { shapeFlags } from "../shared/shapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    key: props && props.key,
    shapeFlag: getShapeFlags(type)
  }
  if (typeof children === 'string') {
    vnode.shapeFlag |= shapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= shapeFlags.ARRAY_CHILDREN
  }
  if (vnode.shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= shapeFlags.SLOT_CHILDREN
    }
  }
  return vnode
}

export function createTextVnode(text) {
  return createVnode(Text, {}, text)
}


function getShapeFlags(type) {
  return typeof type === 'string' ? shapeFlags.ELEMENT : shapeFlags.STATEFUL_COMPONENT
}