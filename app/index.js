/* global PIXI */ import 'pixi.js'

require('./style.css')

// Create the renderer
let renderer = PIXI.autoDetectRenderer(256, 256)

// Create a container object called the `stage`
let stage = new PIXI.Container()

PIXI.loader
  .add('img/cat.png', require('./img/cat.png'))
  .load(setup)

// Tell the `renderer` to `render` the `stage`
renderer.render(stage)

function setup () {
  let sprite = new PIXI.Sprite(
    PIXI.loader.resources['img/cat.png'].texture
  )

  stage.addChild(sprite)

  renderer.render(stage)
}

// Add the canvas to the HTML document
document.body.appendChild(renderer.view)
