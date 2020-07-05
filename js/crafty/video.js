Crafty.c('Video', {
  // This function will be called when the component is added to an entity
  // So it sets up the things that both our entities had in common
  init: function () {
    this.addComponent('2D, DOM')
    const videoEl = document.createElement('video')
    videoEl.autoplay = true
    videoEl.muted = true
    videoEl.playsInline = true
    videoEl.translate
    this
      // .attr({
      //   x: 0,
      //   y: 100,
      //   w: 640,
      //   h: 480,
      // })
      .DOM(videoEl)
      // mirror the video
      .css('transform', 'rotateY(180deg)')
    // Video is already transformed by mirroring it.
    // By default, the positioning uses transform, too.
    // Thereby, the mirroring would be overwritten.
    this.avoidCss3dTransforms = true
  },
  /**
   * @returns {HTMLVideoElement}
   */
  getVideoElement() {
    return this._element
  },
  setVideoSourceObject(srcObject) {
    this.getVideoElement().srcObject = srcObject
  },
  async useUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    this.setVideoSourceObject(stream)
    return stream
  },
})
