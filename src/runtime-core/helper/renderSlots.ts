import { Fragment, createVnode } from "../vnode";

export function renderSlots(slots, key = 'default', props) {
  const slot = slots[key]
  if (slot) {
    if (typeof slot === 'function') {
      return createVnode(Fragment, {}, slot(props))
    }
  }
}