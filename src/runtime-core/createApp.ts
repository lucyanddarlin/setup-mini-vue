import { render } from "./render"
import { createVnode } from "./vnode"

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // component -> vnode
      // 基于 vnode 来进行后续操作
      const vnode = createVnode(rootComponent)
      render(vnode, rootContainer)
    }
  }
}