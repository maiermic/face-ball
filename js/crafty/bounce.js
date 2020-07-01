Crafty.c('Bounce', {
  init() {
    this.requires('Motion')
  },
  bounceLeft() {
    this.vx = -Math.abs(this.vx)
  },
  bounceRight() {
    this.vx = Math.abs(this.vx)
  },
  bounceUp() {
    this.vy = -Math.abs(this.vy)
  },
  bounceDown() {
    this.vy = Math.abs(this.vy)
  },
})
