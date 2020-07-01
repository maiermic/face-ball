Crafty.c('Bounce', {
  init() {
    this.requires('Motion')
  },
  bounceLeft() {
    this.vx = -Math.abs(this.vx)
    this.ax = -Math.abs(this.ax)
  },
  bounceRight() {
    this.vx = Math.abs(this.vx)
    this.ax = Math.abs(this.ax)
  },
  bounceUp() {
    this.vy = -Math.abs(this.vy)
    this.ay = -Math.abs(this.ay)
  },
  bounceDown() {
    this.vy = Math.abs(this.vy)
    this.ay = Math.abs(this.ay)
  },
})
