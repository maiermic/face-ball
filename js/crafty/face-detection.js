import { FaceDetection } from '../face-detection.js'

Crafty.c('FaceDetection', {
  // This function will be called when the component is added to an entity
  // So it sets up the things that both our entities had in common
  init: function () {
    this.addComponent('Video')
    this._faceDetection = new FaceDetection(this.getVideoElement())
    this._faceDetection.onDetection = detection => {
      const { x, y, width, height } = detection.box
      detection.absoluteBox = {
        // Video is mirrored horizontally.
        // Hence, x-coordinate has to be mirrored, too.
        x: this.x + this.w - x - width,
        y: this.y + y,
        width,
        height,
      }
      return this.trigger('FaceDetection', detection)
    }
    this.getVideoElement().onloadedmetadata = () => this._faceDetection.start()
  },
  getFaceDetectionResult() {
    return this._faceDetection.detection
  },
})
