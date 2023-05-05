import { h, getCurrentInstance } from "../../lib/setup-mini-vue.esm.js"
import { Foo } from './Foo.js'

export const App = {
  name: 'APP',
  render () {
    const app = h('div', {}, 'APP')
    const foo = h(Foo, {})
    return h('div', {}, [app, foo])
  },
  setup () {
    const instance = getCurrentInstance()
    console.log('App', instance)
  }
}