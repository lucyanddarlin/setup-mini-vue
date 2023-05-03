import { h } from '../../lib/setup-mini-vue.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  render () {
    window.self = this
    return h('div',
      {
        'id': 'root',
        'class': ['red', 'blue'],
        onClick: () => {
          const a = 1
        }
      },
      [
        h('div', {}, 'hi,' + this.msg),
        h(Foo, {
          count: 1,
          onAdd: (a, b) => {
            console.log('add', a, b);
          },
          onAddFoo: () => {
            console.log('onAddFoo')
          }
        })
      ]
    )
  },
  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}