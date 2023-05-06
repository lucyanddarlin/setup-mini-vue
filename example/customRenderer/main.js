import { createRenderer } from "../../lib/setup-mini-vue.esm.js"
import { App } from './App.js'

const game = new PIXI.Application({ width: 500, height: 500 })
document.body.appendChild(game.view)

const renderer = createRenderer({
  createElement (type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics()
      rect.beginFill(0x1d9ce0)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()
      return rect
    }
  },
  patchProps (el, key, val) {
    el[key] = val
  },
  insert (el, container) {
    container.addChild(el)
  }
})

renderer.createApp(App).mount(game.stage)
