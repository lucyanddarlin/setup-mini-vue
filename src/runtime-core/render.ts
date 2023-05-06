import { shapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {

  const { createElement: hostCreateElement, patchProps: hostPatchProps, insert: hostInsert } = options

  function render(vnode, container, parentComponent = null) {
    patch(vnode, container, parentComponent)
  }

  function patch(vnode, container, parentComponent) {
    // 判断 vnode 是 element 还是 component
    const { type, shapeFlag } = vnode
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;
      case Text:
        processText(vnode, container)
        break;
      default:
        if (shapeFlag & shapeFlags.ELEMENT) {
          // 处理 element
          processElement(vnode, container, parentComponent)
        } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
          //  处理组件
          processComponent(vnode, container, parentComponent)
        }
        break;
    }
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode
    const textVnode = (vnode.el = document.createTextNode(children))
    container.append(textVnode)

  }

  function processFragment(vnode: any, container: any, parentComponent) {
    const { children } = vnode
    mountChildren(children, container, parentComponent)
  }

  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const { children, props, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(vnode.type))
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent)
    }
    for (const key in props) {
      const val = props[key]
      hostPatchProps(el, key, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach(v => {
      patch(v, container, parentComponent)
    })
  }

  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
  }

  function setupRenderEffect(instance: any, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    // vnode -> element -> mountElement
    patch(subTree, container, instance)
    // handle $el
    initialVnode.el = subTree.el
  }

  return {
    createApp: createAppApi(render)
  }
}