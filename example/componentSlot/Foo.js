import { h, renderSlots } from '../../lib/setup-mini-vue.esm.js'

export const Foo = {
  render () {
    const foo = h('p', {}, 'Foo')
    const age = 19
    return h('div', {},
      [
        renderSlots(this.$slots, 'header', {
          age
        }),
        foo,
        renderSlots(this.$slots, 'footer'),
        renderSlots(this.$slots)
      ]
    )
  },
  setup () { }
}