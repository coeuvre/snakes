class Mouse {
  constructor () {
    this.x = 0
    this.y = 0

    document.onmousemove = (e) => {
      this.x = e.x
      this.y = e.y
    }
  }
}

const mouse = new Mouse()

export default mouse
