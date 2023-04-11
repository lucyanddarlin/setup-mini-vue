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
          console.log('click');
        }
      },
      [h('div', {}, 'hi,' + this.msg), h(Foo, { count: 1 })]
      // [h('p', { 'class': 'red' }, 'p1'), h('p', { 'class': 'red' }, 'p2')]
      // 'hi, ' + this.msg
    )
  },
  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}