Crafty.c('Score', {
  init() {
    this.requires('DOM, Text')
    this._points = 0
    this.text('0 Points')
    this.textAlign('center')
    this.css({
      backgroundColor: 'white',
      whiteSpace: 'nowrap',
      padding: '8px',
    })
    this.bind('Draw', () => {
      this.css({
        width: 'fit-content',
        height: 'auto',
      })
    })
  },
  properties: {
    points: {
      set(points) {
        this._points = points
        this.text(this._points + ' Points')
      },
      get() {
        return this._points
      },
    },
  },
})
