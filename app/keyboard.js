function keyboard (code) {
  const key = {}
  key.code = code
  key.isDown = false
  key.isUp = true
  key.press = undefined
  key.release = undefined

  key.downHandler = function (e) {
    if (e.keyCode === key.code) {
      if (key.isUp && key.press) { key.press() }
      key.isDown = true
      key.isUp = false
      e.preventDefault()
    }
  }

  key.upHandler = function (e) {
    if (e.keyCode === key.code) {
      if (key.isDown && key.release) { key.release() }
      key.isDown = false
      key.isUp = true
      e.preventDefault()
    }
  }

  window.addEventListener('keydown', key.downHandler.bind(key), false)
  window.addEventListener('keyup', key.upHandler.bind(key), false)

  return key
}

export default keyboard
