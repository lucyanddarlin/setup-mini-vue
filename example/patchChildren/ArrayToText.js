import { ref, h } from "../../lib/setup-mini-vue.esm.js"
const nextChildren = 'newChildren'
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]

export const ArrayToText = {
  name: 'ArrayToText',
  setup () {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange
    }
  },
  render () {
    const self = this
    return self.isChange === false
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  }
}