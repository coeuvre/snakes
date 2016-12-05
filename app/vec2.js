class Vec2 {
  constructor (x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  neg () {
    return new Vec2(-this.x, -this.y)
  }

  add (rhs) {
    return new Vec2(this.x + rhs.x, this.y + rhs.y)
  }

  sub (rhs) {
    return new Vec2(this.x - rhs.x, this.y - rhs.y)
  }

  mul (rhs) {
    return new Vec2(this.x * rhs, this.y * rhs)
  }

  dot (rhs) {
    return this.x * rhs.x + this.y * rhs.y
  }

  cross (rhs) {
    return this.x * rhs.y - this.y * rhs.x
  }

  perp () {
    return new Vec2(-this.y, this.x)
  }

  normalize () {
    const length = this.length()
    return new Vec2(this.x / length, this.y / length)
  }

  length () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  radian (rhs) {
    if (rhs) {
      return Math.acos(this.dot(rhs) / (this.length() * rhs.length()))
    } else {
      return Math.atan2(this.y, this.x)
    }
  }

  degree (rhs) {
    return this.radian(rhs) / Math.PI * 180.0
  }

  rotate (rad) {
    const xaxis = this.normalize()
    const yaxis = xaxis.perp()
    return xaxis.mul(Math.cos(rad)).add(yaxis.mul(Math.sin(rad)))
  }

  rotateDegree (degree) {
    return this.rotate(degree / 180.0 * Math.PI)
  }

  eq (rhs) {
    return Math.abs(this.x - rhs.x) < 0.00001 && Math.abs(this.y - rhs.y) < 0.00001
  }
}

export default Vec2
