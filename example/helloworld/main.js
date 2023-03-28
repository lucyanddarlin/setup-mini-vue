import { createApp } from '../../lib/setup-mini-vue.esm.js'
import { App } from '../../example/helloworld/App.js'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)