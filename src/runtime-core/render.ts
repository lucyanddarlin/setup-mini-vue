import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { shapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {

  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vnode, container, parentComponent = null) {
    patch(null, vnode, container, parentComponent)
  }

  function patch(n1, n2, container, parentComponent) {
    // 判断 vnode 是 element 还是 component
    const { type, shapeFlag } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & shapeFlags.ELEMENT) {
          // 处理 element
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
          //  处理组件
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2
    const textVnode = (n2.el = document.createTextNode(children))
    container.append(textVnode)

  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    const { children } = n2
    mountChildren(children, container, parentComponent)
  }

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function patchElement(n1, n2, container, parentComponent) {
    console.log('patchElement');
    console.log('n1', n1);
    console.log('n2', n2);
    const newProps = n2.props || EMPTY_OBJ
    const oldProps = n1.props || EMPTY_OBJ
    const el = n2.el = n1.el
    patchChildren(n1, n2, el, parentComponent)
    patchProps(newProps, oldProps, el)
  }

  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const { shapeFlag } = n2
    const c2 = n2.children
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & shapeFlags.ARRAY_CHILDREN) {
        // 1. 清空 children
        unMountChildren(n1.children)
      }
      if (c1 !== c2) {
        hostSetElementText(c2, container)
      }
    } else {
      // new -> array
      if (prevShapeFlag & shapeFlags.TEXT_CHILDREN) {
        hostSetElementText('', container)
        mountChildren(c2, container, parentComponent)
      }
    }
  }

  function unMountChildren(children) {
    for (let index = 0; index < children.length; index++) {
      const el = children[index].el
      hostRemove(el)
    }
  }

  function patchProps(oldProps, newProps, el) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProps = oldProps[key]
        const nextProps = newProps[key]
        if (prevProps !== nextProps) {
          hostPatchProps(el, key, prevProps, nextProps)
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProps(el, key, oldProps[key], null)
          }
        }
      }
    }
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
      hostPatchProps(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container)
  }

  function mountChildren(children, container, parentComponent) {
    children.forEach(v => {
      patch(null, v, container, parentComponent)
    })
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
  }

  function setupRenderEffect(instance: any, initialVnode, container) {
    effect(() => {
      const { isMounted } = instance
      if (!isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance)
        // handle $el
        initialVnode.el = subTree.el
        instance.isMounted = true
      } else {
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppApi(render)
  }
}