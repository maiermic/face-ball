Crafty.c('Circle', {
  init() {
    this.requires('2D, Canvas')
    this.ready = true
    this.bind('Draw', function ({ ctx }) {
      ctx.beginPath()
      const lineWidth = this.lineWidth || 0
      ctx.arc(
        this.centerX,
        this.centerY,
        this.radius - lineWidth / 2,
        0,
        Math.PI * 2
      )
      ctx.closePath()
      if (this.strokeStyle) {
        ctx.strokeStyle = this.strokeStyle
        ctx.lineWidth = this.lineWidth
        ctx.stroke()
      }
      if (this.fillStyle) {
        ctx.fillStyle = this.fillStyle
        ctx.fill()
      }
    })
  },
  circle({ x, y, radius }) {
    if (typeof x === 'undefined') {
      x = this.x
    }
    if (typeof y === 'undefined') {
      y = this.y
    }
    if (typeof radius === 'undefined') {
      radius = this.radius
    }
    this.radius = radius
    this.x = x - radius
    this.y = y - radius
    const size = 2 * radius
    this.w = size
    this.h = size
    return this
  },
  properties: {
    centerX: {
      get() {
        return this.x + this.radius
      },
    },
    centerY: {
      get() {
        return this.y + this.radius
      },
    },
  },
})

export function doCirclesOverlap(
  { centerX: x1, centerY: y1, radius: r1 },
  { centerX: x2, centerY: y2, radius: r2 }
) {
  const squaredDistance = Crafty.math.squaredDistance(x1, y1, x2, y2)
  const squaredRadii = Math.pow(r1 + r2, 2)
  return squaredRadii > squaredDistance
}
