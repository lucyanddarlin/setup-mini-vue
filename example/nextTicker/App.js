import { h, ref, getCurrentInstance, nextTick } from "../../lib/setup-mini-vue.esm.js"

export default {
  name: 'App',
  setup () {
    const currentInstance = getCurrentInstance()
    const count = ref(1)

    const updateCount = () => {
      console.log('update');
      for (let index = 0; index < 100; index++) {
        count.value = index
      }
      debugger
      console.log(currentInstance);
      nextTick(() => {
        console.log(currentInstance);
      })
    }
    return { count, updateCount }
  },
  render () {
    const p = h('p', {}, 'count: ' + this.count)
    const button = h('button', { onClick: this.updateCount }, 'update')
    return h('div', {}, [button, p])
  }
}