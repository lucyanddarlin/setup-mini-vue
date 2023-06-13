import { h, ref } from "../../lib/setup-mini-vue.esm.js"
import { Child } from "./Child.js"

export default {
  name: 'App',
  setup () {
    const msg = ref('123')
    const count = ref(1)
    window.msg = msg

    const changeChildProp = () => {
      msg.value = '456'
    }
    const changeCount = () => {
      count.value++
    }
    return { msg, count, changeCount, changeChildProp }
  },
  render () {
    return h('div', {}, [
      h('div', {}, "hello mini-vue"),
      h(
        'button',
        { onClick: this.changeChildProp },
        'changeChildProp'
      ),
      h(
        Child,
        { msg: this.msg },
      ),
      h('button', { onClick: this.changeCount }, 'change self count'),
      h("p", {}, "count:" + this.count)
    ])
  }
}
