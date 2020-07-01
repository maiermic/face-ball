export class FaceDetection {
  /**
   * @param videoElement HTMLVideoElement
   */
  constructor(videoElement) {
    this._videoElement = videoElement
    this._tinyFaceDetectorOptions = new faceapi.TinyFaceDetectorOptions()
    this.detection = null
  }

  start() {
    // noinspection JSIgnoredPromiseFromCall
    this._run()
  }

  async _run() {
    if (this._videoElement.paused || this._videoElement.ended) {
      return setTimeout(() => this._run())
    }
    const result = await faceapi.detectSingleFace(
      this._videoElement,
      this._tinyFaceDetectorOptions
    )
    if (result) {
      this.detection = result
      this.onDetection(this.detection)
    }
    setTimeout(() => this._run())
  }

  onDetection(detection) {}
}
