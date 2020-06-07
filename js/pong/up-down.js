export class Pong {
  constructor(boardWidth, boardHeight) {
    this._boardWidth = boardWidth;
    this._boardHeight = boardHeight;
    this._ballConfig = {
      initialPosition: {
        x: boardWidth / 2,
        y: boardHeight / 2,
      },
      width: 10,
      height: 10,
    };
    this._paddleConfig = {
      distanceToWall: this._ballConfig.height * 2,
      width: 100,
      height: 10,
      speed: 200,
    };
  }

  init() {
    Crafty.init(this._boardWidth, this._boardHeight);
    Crafty.background('rgb(127,127,127)');
    this.createUpsidePaddle();
    this.createDownsidePaddle();
    this.createBall();
    this.createScoreBoards();
  }

  createUpsidePaddle() {
    this._upsidePaddle =
      Crafty.e("Paddle, 2D, DOM, Color, Multiway")
        .color('rgb(255,0,0)')
        .attr({
          x: (this._boardWidth - this._paddleConfig.width) / 2,
          y: this._paddleConfig.distanceToWall,
          w: this._paddleConfig.width,
          h: this._paddleConfig.height,
        })
        .multiway(this._paddleConfig.speed, {A: 180, D: 0});
  }

  createDownsidePaddle() {
    this._downsidePaddle =
      Crafty.e("Paddle, 2D, DOM, Color, Multiway")
        .color('rgb(255,255,0)')
        .attr({
          x: (this._boardWidth - this._paddleConfig.width) / 2,
          y: this._boardHeight - this._paddleConfig.distanceToWall,
          w: this._paddleConfig.width,
          h: this._paddleConfig.height,
        })
        .multiway(this._paddleConfig.speed, {LEFT_ARROW: 180, RIGHT_ARROW: 0});
  }

  createBall() {
    const game = this;
    this._ball =
      Crafty.e("2D, DOM, Color, Collision")
        .color('rgb(0,0,255)')
        .attr({
          x: this._ballConfig.initialPosition.x,
          y: this._ballConfig.initialPosition.y,
          w: this._ballConfig.width,
          h: this._ballConfig.height,
          dX: Crafty.math.randomInt(2, 5),
          dY: Crafty.math.randomInt(2, 5)
        })
        .bind('UpdateFrame', function () {
          // hit left or right boundary
          if (this.x <= 0 || this.x >= game._boardWidth - this.w) {
            this.dX *= -1;
          }

          //hit floor or roof
          if (this.y > game._boardHeight) {
            this.y = game._ballConfig.initialPosition.y;
            Crafty("LeftPoints").each(function () {
              this.text(++this.points + " Points")
            });
          }
          if (this.y < this.w) {
            this.y = game._ballConfig.initialPosition.y;
            Crafty("RightPoints").each(function () {
              this.text(++this.points + " Points")
            });
          }

          this.x += this.dX;
          this.y += this.dY;
        })
        .onHit('Paddle', function () {
          this.dY *= -1;
        });
  }

  createScoreBoards() {
    //Score boards
    Crafty.e("LeftPoints, DOM, 2D, Text")
      .attr({x: 20, y: 20, w: 100, h: 20, points: 0})
      .text("0 Points");
    Crafty.e("RightPoints, DOM, 2D, Text")
      .attr({x: 20, y: this._boardHeight - 40, w: 100, h: 20, points: 0})
      .text("0 Points");
  }
}

