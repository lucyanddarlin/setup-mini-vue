import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { shapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp";
import { shouldUpdateComponent } from "./helper/componentUpdateUtils";
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
    patch(null, vnode, container, parentComponent, null)
  }

  function patch(n1, n2, container, parentComponent, anchor) {
    // 判断 vnode 是 element 还是 component
    const { type, shapeFlag } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & shapeFlags.ELEMENT) {
          // 处理 element
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & shapeFlags.STATEFUL_COMPONENT) {
          //  处理组件
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break;
    }
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2
    const textVnode = (n2.el = document.createTextNode(children))
    container.append(textVnode)

  }

  function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
    const { children } = n2
    mountChildren(children, container, parentComponent, anchor)
  }

  function processElement(n1, n2: any, container: any, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log('patchElement');
    console.log('n1', n1);
    console.log('n2', n2);
    const newProps = n2.props || EMPTY_OBJ
    const oldProps = n1.props || EMPTY_OBJ
    const el = n2.el = n1.el
    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(newProps, oldProps, el)
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
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
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        // array diff array
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, anchor) {
    let i = 0
    let l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1
    function isSameVnodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key
    }
    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVnodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor)
      } else {
        break
      }
      i++
    }

    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVnodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor)
      } else {
        break
      }
      e1--
      e2--
    }
    //e1
    // a b   e1 = -1, e2 = 1, i = 0  l2 = 3
    // c a b
    // i

    // a b   e1 = 2, e2 = 3, i = 2 l2 = 3
    // a b c
    // newArray more than oldArray
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) {
      // newArray less than oldArray
      // a b c   i = 2, e1 = 2, e2 = 1
      // a b

      // c a b   i = 0, e1 = 0, e2 = -1
      // a b
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      let s1 = i
      let s2 = i
      const toBePatched = e2 - s2 + 1
      let patched = 0
      let keyToNewIndexMap = new Map()
      let newIndexToOldIndexMap = new Array(toBePatched)
      let moved = false
      let newIndexSoFar = 0
      for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }
      let newIndex
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; s2 <= e2; j++) {
            if (isSameVnodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }
        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          if (newIndex >= newIndexSoFar) {
            newIndexSoFar = newIndex
          } else {
            moved = true
          }
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1
      for (let i = toBePatched - 1; i >= 0; i--) {
        const nextPos = i + s2
        const nextChild = c2[nextPos]
        const anchor = nextPos + 1 < l2 ? c2[nextPos + 1].el : null
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }
      }
    }
  }

  function unMountChildren(children) {
    for (let index = 0; index < children.length; index++) {
      const el = children[index].el
      hostRemove(el)
    }
  }

  function patchProps(newProps, oldProps, el) {
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

  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    const { children, props, shapeFlag } = vnode
    const el = (vnode.el = hostCreateElement(vnode.type))
    if (shapeFlag & shapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & shapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent, anchor)
    }
    for (const key in props) {
      const val = props[key]
      hostPatchProps(el, key, null, val)
    }
    // container.append(el)
    hostInsert(el, container, anchor)
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach(v => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor)
    } else {
      updateComponent(n1, n2)
    }
  }

  function mountComponent(initialVnode: any, container, parentComponent, anchor) {
    const instance = initialVnode.component = createComponentInstance(initialVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container, anchor)
  }

  function updateComponent(n1, n2) {
    let instance = n2.component = n1.component
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    } else {
      n2.el = n1.el
      instance.vnode = n2
    }
  }

  function setupRenderEffect(instance: any, initialVnode, container, anchor) {
    instance.update = effect(() => {
      const { isMounted } = instance
      if (!isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance, anchor)
        // handle $el
        initialVnode.el = subTree.el
        instance.isMounted = true
      } else {
        const { next: nextVnode, vnode: prevVnode } = instance
        if (nextVnode) {
          nextVnode.el = prevVnode.el
          updateComponentPreRender(instance, nextVnode)
        }

        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        patch(prevSubTree, subTree, container, instance, anchor)
      }
    })
  }

  return {
    createApp: createAppApi(render)
  }
}

function updateComponentPreRender(instance, nextVnode) {
  instance.vnode = nextVnode
  instance.next = null
  instance.props = nextVnode.props
}


// packages/runtime-core/src/renderer.ts
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}