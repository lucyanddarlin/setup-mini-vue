import { h } from '../../lib/setup-mini-vue.esm.js'

export const App = {
  render () {
    return h('div', { 'id': 'root', 'class': ['red', 'blue'] }, [h('p', { 'class': 'red' }, 'p1'), h('p', { 'class': 'red' }, 'p2')])
  },
  setup () {
    return {
      msg: 'mini-vue'
    }
  }
}