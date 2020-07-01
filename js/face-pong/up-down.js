import '../crafty/bounce.js'
import { doCirclesOverlap } from '../crafty/circle.js'
import '../crafty/face-detection.js'
import '../crafty/score.js'
import '../crafty/video.js'

export class FacePong {
  constructor(boardWidth, boardHeight) {
    this._boardWidth = boardWidth
    this._boardHeight = boardHeight
    this._ballConfig = {
      initialPosition: {
        x: boardWidth / 2,
        y: boardHeight / 2,
      },
      radius: boardWidth / 20,
      speed: 150,
      acceleration: 3,
    }
    this._faceConfig = {
      radius: boardWidth * 0.15,
      maxRadius: boardWidth * 0.15,
      lineWidth: 4,
    }
    this._videoConfig = {
      width: 640,
      height: 480,
    }
    this._ballWithHeadCollision = new BallWithHeadCollision()
  }

  init(element) {
    Crafty.init(this._boardWidth, this._boardHeight, element)
    Crafty.background('rgb(127,127,127)')
    this.createOpponent()
    this.createPlayer()
    this.createBall()
    this.createScoreBoards()
    this.addControls()
    this.addLogic()

    // "The canvas element (and hence all Canvas entities) is always
    // rendered below any DOM entities."
    // @see http://craftyjs.com/api/Canvas.html
    // Change z-index of canvas to draw above video elements
    document.querySelector('canvas').style.zIndex = '40'
  }

  createOpponent() {
    const videoAttr = {
      x: 0,
      y: 0,
      w: this._videoConfig.width,
      h: this._videoConfig.height,
    }
    this.opponentVideo = Crafty.e('Video, 2D, DOM').attr(videoAttr)
    this.opponentFace = Crafty.e('Circle')
      .circle({
        x: videoAttr.x + videoAttr.w / 2,
        y: videoAttr.y + videoAttr.h / 2,
        radius: this._faceConfig.radius,
      })
      .attr({
        strokeStyle: 'red',
        lineWidth: this._faceConfig.lineWidth,
      })
  }

  createPlayer() {
    const videoAttr = {
      x: 0,
      y: this._boardHeight - this._videoConfig.height,
      w: this._videoConfig.width,
      h: this._videoConfig.height,
    }
    this.playerVideo = Crafty.e('Video, 2D, DOM').attr(videoAttr)
    this.playerFace = Crafty.e('Circle')
      .circle({
        x: videoAttr.x + videoAttr.w / 2,
        y: videoAttr.y + videoAttr.h / 2,
        radius: this._faceConfig.radius,
      })
      .attr({
        strokeStyle: 'blue',
        lineWidth: this._faceConfig.lineWidth,
      })
  }

  createBall() {
    this.ball = Crafty.e('Circle')
      .circle({
        x: this._ballConfig.initialPosition.x,
        y: this._ballConfig.initialPosition.y,
        radius: this._ballConfig.radius,
      })
      .attr({
        fillStyle: 'black',
      })
  }

  createScoreBoards() {
    this.opponentScore = Crafty.e('Score').attr({
      x: 20,
      y: 20,
    })
    this.playerScore = Crafty.e('Score').attr({
      x: 20,
      y: this._boardHeight - 40,
    })
  }

  addControls() {
    this.addOpponentControls()
    this.addPlayerControls()
  }

  addOpponentControls() {
    this.opponentFace.addComponent('Multiway').multiway(200, { A: 180, D: 0 })
  }

  addPlayerControls() {
    // this.playerFace
    //   .addComponent('Multiway')
    //   .multiway(this._paddleConfig.speed, { LEFT_ARROW: 180, RIGHT_ARROW: 0 })
    this.playerVideo
      .addComponent('FaceDetection')
      .bind('FaceDetection', detection => {
        const { x, y, width, height } = detection.absoluteBox
        const radius = Math.min(
          this._faceConfig.maxRadius,
          Math.max(width, height) / 2
        )
        this.playerFace.circle({
          x: x + width / 2,
          y: y + height / 2,
          radius: radius,
        })
      })
  }

  addLogic() {
    this.ball.addComponent('Bounce, Collision')
    this.ball.resetPosition = () =>
      this.ball.circle({
        x: this._ballConfig.initialPosition.x,
        y: this._ballConfig.initialPosition.y,
      })
    this.ball.randomDirection = () => {
      const velocity = this.ball.velocity()
      velocity
        .setValues(Crafty.math.randomInt(2, 5), Crafty.math.randomInt(2, 5))
        .normalize()
      this.ball
        .acceleration()
        .setValues(velocity)
        .scale(this._ballConfig.acceleration)
      velocity.scale(this._ballConfig.speed)
    }
    this.ball.randomDirection()
    this.ball.bind('UpdateFrame', () => {
      this.checkCollisions()
      this.onUpdateFrame()
    })
  }

  onUpdateFrame() {}

  checkCollisions() {
    if (doCirclesOverlap(this.ball, this.playerFace)) {
      this._ballWithHeadCollision.calculate(this.ball, this.playerFace)
    } else if (doCirclesOverlap(this.ball, this.opponentFace)) {
      this._ballWithHeadCollision.calculate(this.ball, this.opponentFace)
    }
    if (this._isCollisionBallWithLeftWall()) {
      this.ball.bounceRight()
    } else if (this._isCollisionBallWithRightWall()) {
      this.ball.bounceLeft()
    }
    if (this._isCollisionBallWithRoof()) {
      this.ball.resetPosition()
      this.ball.randomDirection()
      this.playerScore.points++
    } else if (this._isCollisionBallWithFloor()) {
      this.ball.resetPosition()
      this.ball.randomDirection()
      this.opponentScore.points++
    }
  }

  _isCollisionBallWithRoof() {
    return this.ball.y < -this.ball.h
  }

  _isCollisionBallWithFloor() {
    return this.ball.y > this._boardHeight
  }

  _isCollisionBallWithLeftWall() {
    return this.ball.x <= 0
  }

  _isCollisionBallWithRightWall() {
    return this.ball.x >= this._boardWidth - this.ball.w
  }
}

class BallWithHeadCollision {
  constructor() {
    this._playerHead = new Crafty.math.Vector2D(0, 0)
  }

  calculate(ball, playerHead) {
    const velocity = ball.velocity()
    const acceleration = ball.acceleration()
    const speed = velocity.magnitude()
    const accelerationFactor = acceleration.magnitude()
    velocity
      .setValues(ball.centerX, ball.centerY)
      .subtract(
        this._playerHead.setValues(playerHead.centerX, playerHead.centerY)
      )
      .normalize()
    acceleration.setValues(velocity).scale(accelerationFactor)
    velocity.scale(speed)
  }
}
