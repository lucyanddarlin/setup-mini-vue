import { isObject } from "../shared";
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  // 判断 vnode 是 element 还是 component
  if (typeof vnode.type === 'string') {
    // 处理 element
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    //  处理组件
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { children, props } = vnode
  const el = (vnode.el = document.createElement(vnode.type))
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(children, el)
  }
  for (const key in props) {
    const val = props[key]
    if (val) {
      el.setAttribute(key, val)
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
  initialVnode.el = subTree.el
}


