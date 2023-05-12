import { ref, h } from "../../lib/setup-mini-vue.esm.js"
const nextChildren = 'newChildren'
const prevChildren = 'pervChildren'

export const TextToText = {
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
      ? h('div', {}, prevChildren)
      : h('div', {}, nextChildren)
  }
}