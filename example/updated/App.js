import { h, ref } from '../../lib/setup-mini-vue.esm.js'

export const App = {
  name: 'App',
  setup () {
    const count = ref(0)
    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })
    const onClick = () => {
      count.value++
      console.log(count.value);
    }
    const changeFooPropsValue = () => {
      props.value.foo = 'new-foo'
    }
    const removeFooProsValue = () => {
      props.value.foo = undefined
    }
    const createNewProps = () => {
      props.value = {
        foo: 'new-props-foo'
      }
    }
    return {
      count,
      onClick,
      props,
      changeFooPropsValue,
      removeFooProsValue,
      createNewProps
    }
  },
  render () {
    return h('div', { id: 'root', ...this.props }, [
      h('div', {}, 'count:' + this.count),
      h('button', { onClick: this.onClick }, 'click'),
      h('button', { onClick: this.changeFooPropsValue }, 'change foo props value'),
      h('button', { onClick: this.removeFooProsValue }, 'remove foo props value'),
      h('button', { onClick: this.createNewProps }, 'create new props')
    ])
  }
}