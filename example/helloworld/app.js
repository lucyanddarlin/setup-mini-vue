import { h } from '../../lib/setup-mini-vue.esm.js'

window.self = null
export const App = {
  render () {
    window.self = this
    return h('div',
      {
        'id': 'root', 'class': ['red', 'blue'], onClick: () => {
          console.log('click');
        }
      },
      // [h('p', { 'class': 'red' }, 'p1'), h('p', { 'class': 'red' }, 'p2')]
      'hi, ' + this.msg
    )
  },
  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}