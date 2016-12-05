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

  for (let i = 0; i < 100; ++i) {
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
    this.dir = new Vec2(0, 0)
    this.pivot = []
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

const SNAKE_NODE_MAX_DISTANCE = 8

class Snake {
  constructor (stage) {
    this.head = new SnakeNode(stage)
    this.tail = this.head
    this.size = 1
    this.vel = 3.0
    this.stage = stage
  }

  grow (stage) {
    const node = new SnakeNode(this.stage)
    node.pos = this.tail.pos.add(this.tail.dir.neg().mul(SNAKE_NODE_MAX_DISTANCE))

    node.prev = this.tail
    this.tail.next = node
    this.tail = node
  }

  update (state) {
    const distance = state.mouse.pos.sub(this.head.pos)
    if (distance.length() !== 0) {
      let dir = distance.normalize()

      const MAX_CHANGE_DEGREE = 6
      if (dir.degree(this.head.dir) > MAX_CHANGE_DEGREE || this.head.dir.neg().eq(dir)) {
        if (dir.cross(this.head.dir) > 0) {
          dir = this.head.dir.rotateDegree(-MAX_CHANGE_DEGREE)
        } else {
          dir = this.head.dir.rotateDegree(MAX_CHANGE_DEGREE)
        }
      }

      if (dir.radian() !== this.head.dir.radian()) {
        this.head.dir = dir
        this.head.pivot.push(this.head.pos)
      }
    }

    this.head.pos = this.head.pos.add(this.head.dir.mul(this.vel))

    adjustSnakeNode(this, this.head.next)
  }

  render () {
    let node = this.head
    while (node) {
      node.render(stage)
      node = node.next
    }
  }
}

function adjustSnakeNode (snake, node) {
  if (!node) {
    return
  }

  const forward = node.prev
  let dir
  let target

  if (forward.pivot.length > 0) {
    target = forward.pivot[0]
    dir = target.sub(node.pos).normalize()
  } else {
    target = forward.pos
    dir = target.sub(node.pos).normalize()
  }

  if (node.dir.radian() !== dir.radian()) {
    node.pivot.push(node.pos)
  }

  node.pos = node.pos.add(dir.mul(snake.vel))
  node.dir = dir

  if (forward.pivot.length > 0) {
    if (node.pos.sub(target).length() < snake.vel) {
      node.pos = target
      forward.pivot = forward.pivot.slice(1)
    }
  }

  adjustSnakeNode(snake, node.next)
}
