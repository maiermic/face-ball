const boardWidth = 480;
const boardHeight = 640;
const ballConfig = {
  initialPosition: {
    x: boardWidth / 2,
    y: boardHeight / 2,
  },
  width: 10,
  height: 10,
};
const paddleConfig = {
  distanceToWall: ballConfig.height * 2,
  width: 100,
  height: 10,
};
Crafty.init(boardWidth, boardHeight);
Crafty.background('rgb(127,127,127)');

//Paddles
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
  .color('rgb(255,0,0)')
  .attr({
    x: (boardWidth - paddleConfig.width) / 2,
    y: paddleConfig.distanceToWall,
    w: paddleConfig.width,
    h: paddleConfig.height,
  })
  .multiway(200, { A: 180, D: 0 });
Crafty.e("Paddle, 2D, DOM, Color, Multiway")
  .color('rgb(255,255,0)')
  .attr({
    x: (boardWidth - paddleConfig.width) / 2,
    y: boardHeight - paddleConfig.distanceToWall,
    w: paddleConfig.width,
    h: paddleConfig.height,
  })
  .multiway(200, { LEFT_ARROW: 180, RIGHT_ARROW: 0 });

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
    // hit left or right boundary
    if (this.x <= 0 || this.x >= boardWidth - this.w) {
      this.dX *= -1;
    }

    //hit floor or roof
    if (this.y > boardHeight) {
      this.y = ballConfig.initialPosition.y;
      Crafty("LeftPoints").each(function () {
        this.text(++this.points + " Points") });
    }
    if (this.y < this.w) {
      this.y = ballConfig.initialPosition.y;
      Crafty("RightPoints").each(function () {
        this.text(++this.points + " Points") });
    }

    this.x += this.dX;
    this.y += this.dY;
  })
  .onHit('Paddle', function () {
    this.dY *= -1;
  });

//Score boards
Crafty.e("LeftPoints, DOM, 2D, Text")
  .attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
  .text("0 Points");
Crafty.e("RightPoints, DOM, 2D, Text")
  .attr({ x: 20, y: boardHeight - 40, w: 100, h: 20, points: 0 })
  .text("0 Points");
