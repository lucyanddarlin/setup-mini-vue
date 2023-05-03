import { shapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  // 判断 vnode 是 element 还是 component
  const { shapeFlag } = vnode
  if (shapeFlag & shapeFlags.ELEMENT) {
    // 处理 element
    processElement(vnode, container)
  } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
    //  处理组件
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { children, props, shapeFlag } = vnode
  const el = (vnode.el = document.createElement(vnode.type))
  if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el)
  }
  for (const key in props) {
    const val = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (val) {
      if (isOn(key)) {
        el.addEventListener('click', val)
      } else {
        el.setAttribute(key, val)
      }
    }
  }
  container.append(el)
}

function mountChildren(children, container) {
  children.forEach(v => {
    patch(v, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(initialVnode: any, container) {
  const instance = createComponentInstance(initialVnode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance: any, initialVnode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  // vnode -> element -> mountElement
  patch(subTree, container)
  // handle $el
  initialVnode.el = subTree.el
}


