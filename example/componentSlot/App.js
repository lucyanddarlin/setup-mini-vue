import { h } from '../../lib/setup-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  render () {
    const app = h('div', {}, 'App')
    const foo = h(Foo, {}, {
      header: ({ age }) => h('p', {}, 'foo-slot1' + age),
      footer: () => h('p', {}, 'foo-slot2'),
      default: () => h('p', {}, 'default-slot')
    })
    return h('div', {}, [app, foo])
  },
  setup () { }
}