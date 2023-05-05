import { shapeFlags } from "../shared/shapeFlags"

export function initSlots(instance, children) {
  // instance.slots = Array.isArray(children) ? children : [children]
  // children -> object
  // const slots = {}
  // for (const key in children) {
  //   const value = children[key]
  //   slots[key] = normalizeSlotsValue(value)
  // }
  // instance.slots = slots

  // normalizeSlotObject 参数 2 直接将 instance.slots 的引用传递了过去.
  const { vnode } = instance
  if (vnode.shapeFlag & shapeFlags.SLOT_CHILDREN) {
    normalizeSlotsObject(children, instance.slots)
  }
}

function normalizeSlotsObject(children, slots) {
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotsValue(value(props))
  }
}

function normalizeSlotsValue(value) {
  return Array.isArray(value) ? value : [value]
}