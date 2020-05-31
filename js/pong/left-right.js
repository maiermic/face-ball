
const boardWidth = 640;
const boardHeight = 480;
const ballConfig = {
  initialPosition: {
    x: boardWidth / 2,
    y: boardHeight / 2,
  },
  width: 10,
  height: 10,
};
const paddleConfig = {
  distanceToWall: ballConfig.width * 2,
  width: 10,
  height: 100,
};
Crafty.init(boardWidth, boardHeight);
Crafty.background('rgb(127,127,127)');

//Paddles
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
  .color('rgb(255,0,0)')
  .attr({
    x: paddleConfig.distanceToWall,
    y: (boardHeight - paddleConfig.height) / 2,
    w: paddleConfig.width,
    h: paddleConfig.height,
  })
  .multiway(200, { W: -90, S: 90 });
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
  .color('rgb(0,255,0)')
  .attr({
    x: boardWidth - paddleConfig.distanceToWall,
    y: (boardHeight - paddleConfig.height) / 2,
    w: paddleConfig.width,
    h: paddleConfig.height,
  })
  .multiway(200, { UP_ARROW: -90, DOWN_ARROW: 90 });

//Ball
Crafty.e("2D, DOM, Color, Collision")
  .color('rgb(0,0,255)')
  .attr({
    x: ballConfig.initialPosition.x,
    y: ballConfig.initialPosition.y,
    w: ballConfig.width,
    h: ballConfig.height,
    dX: Crafty.math.randomInt(2, 5),
    dY: Crafty.math.randomInt(2, 5) })
  .bind('UpdateFrame', function () {
    //hit floor or roof
    if (this.y <= 0 || this.y >= boardHeight - this.h) {
      this.dY *= -1;
    }

    // hit left or right boundary
    if (this.x > boardWidth) {
      this.x = ballConfig.initialPosition.x;
      Crafty("LeftPoints").each(function () {
        this.text(++this.points + " Points") });
    }
    if (this.x < this.w) {
      this.x = ballConfig.initialPosition.x;
      Crafty("RightPoints").each(function () {
        this.text(++this.points + " Points") });
    }

    this.x += this.dX;
    this.y += this.dY;
  })
  .onHit('Paddle', function () {
    this.dX *= -1;
  });

//Score boards
Crafty.e("LeftPoints, DOM, 2D, Text")
  .attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
  .text("0 Points");
Crafty.e("RightPoints, DOM, 2D, Text")
  .attr({ x: 515, y: 20, w: 100, h: 20, points: 0 })
  .text("0 Points");
