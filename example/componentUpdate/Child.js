import { h } from "../../lib/setup-mini-vue.esm.js"
export const Child = {
  name: 'Child',
  setup (props, { emit }) { },
  render () {
    return h('div', {}, [h("div", {}, "child-props-msg:" + this.$props.msg)])
  }
}