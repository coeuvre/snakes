/* global PIXI, requestAnimationFrame */

require('./style.css')

import 'pixi.js'

import keyboard from './keyboard'
import mouse from './mouse'
import Vec2 from './vec2'

// Aliases
const Container = PIXI.Container
const Renderer = PIXI.autoDetectRenderer
const loader = PIXI.loader
const resources = PIXI.loader.resources
const Sprite = PIXI.Sprite
const TextureCache = PIXI.utils.TextureCache
const Graphics = PIXI.Graphics

const left = keyboard(37)
const up = keyboard(38)
const right = keyboard(39)
const down = keyboard(40)

// Create the renderer
const renderer = Renderer()

// Add the canvas to the HTML document
document.body.appendChild(renderer.view)

// Create a container object called the `stage`
const stage = new Container()

// Tell the `renderer` to `render` the `stage`
renderer.render(stage)

function asset (name) {
  return {
    name: name,
    url: require(`./${name}`)
  }
}

const imgNode = 'img/node.png'

loader
  .add(asset(imgNode))
  .load(setup)

let state = {}

function setup () {
  state.mouse = {
    pos: new Vec2(mouse.x, mouse.y)
  }

  state.snake = new Snake(stage)

  for (let i = 0; i < 20; ++i) {
    state.snake.grow()
  }

  console.log(state.snake)
  gameLoop()
}

function gameLoop () {
  requestAnimationFrame(gameLoop, state)

  update(state)
  render(state, stage)

  renderer.render(stage)
}

function update (state) {
  state.mouse.pos.x = mouse.x
  state.mouse.pos.y = mouse.y

  state.snake.update(state)
}

function render (state, stage) {
  state.snake.render(stage)
}

class SnakeNode {
  constructor (stage) {
    this.pos = new Vec2(0, 0)
    this.prev = undefined
    this.next = undefined

    this.sprite = new Sprite(TextureCache[imgNode])
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 0.5
    stage.addChild(this.sprite)
  }

  render (stage) {
    this.sprite.x = this.pos.x
    this.sprite.y = this.pos.y
  }
}

const SNAKE_NODE_MAX_DISTANCE = 16

class Snake {
  constructor (stage) {
    this.head = new SnakeNode(stage)
    this.tail = this.head
    this.size = 1
    this.vel = 3.0
    this.dir = new Vec2(0, 0)
    this.stage = stage
  }

  grow (stage) {
    const node = new SnakeNode(this.stage)
    node.pos = this.tail.pos

    node.prev = this.tail
    this.tail.next = node
    this.tail = node
  }

  update (state) {
    this.head.pos = state.mouse.pos
    adjustSnakeNode(this.head.next)
  }

  render () {
    let node = this.head
    while (node) {
      node.render(stage)
      node = node.next
    }
  }
}

function adjustSnakeNode (node) {
  if (!node) {
    return
  }

  const prev = node.prev

  if (prev.prev) {
    const pprev = prev.prev
    const v1 = pprev.pos.sub(prev.pos)
    const v2 = node.pos.sub(prev.pos)
    const SNAKE_NODE_MIN_DEGREE = 120
    const SNAKE_NODE_MIN_RADIAN = SNAKE_NODE_MIN_DEGREE / 180.0 * Math.PI
    if (v1.degree(v2) < SNAKE_NODE_MIN_DEGREE) {
      const xaxis = v1.normalize()
      const yaxis = xaxis.perp()

      let rad = SNAKE_NODE_MIN_RADIAN
      if (v1.cross(v2) < 0) {
        rad = -SNAKE_NODE_MIN_RADIAN
      }
      const newV2 = xaxis.mul(Math.cos(rad))
                         .add(yaxis.mul(Math.sin(rad)))
      node.pos = prev.pos.add(newV2.mul(v2.length()))
    }
    // console.log(v1.degree(v2))
  }

  if (prev) {
    const distance = node.pos.sub(prev.pos)
    if (distance.length() > SNAKE_NODE_MAX_DISTANCE) {
      const dir = distance.normalize()
      node.pos = prev.pos.add(dir.mul(SNAKE_NODE_MAX_DISTANCE))
    }
  }

  adjustSnakeNode(node.next)
}
