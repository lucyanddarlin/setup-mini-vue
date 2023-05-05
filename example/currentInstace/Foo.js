import { h, getCurrentInstance } from "../../lib/setup-mini-vue.esm.js"

export const Foo = {
  name: 'Foo',
  render () {
    const foo = h('div', {}, 'Foo')
    return h('div', {}, [foo])
  },
  setup () {
    const instance = getCurrentInstance()
    console.log('Foo', instance)
  }
}