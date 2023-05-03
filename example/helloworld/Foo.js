import { h } from "../../lib/setup-mini-vue.esm.js";

export const Foo = {
  setup (props, { emit }) {
    const emitAdd = () => {
      emit('add', 2, 3)
      emit('add-foo')
    }
    return {
      emitAdd
    }
  },
  render () {
    const btn = h(
      'button',
      {
        'onClick': this.emitAdd
      },
      "emitAdd"
    )
    const foo = h('p', {}, 'foo')
    return h('div', {}, [btn, foo])
  }
}