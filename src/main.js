
function sketch(s) {

  const GAME = {
    width: 900,
    height: 400,
    gameOver: false,
    win: false,
    pause: false,
  }
  GAME.halfWidth = GAME.width / 2
  GAME.halfHeight = GAME.height / 2
  let gameLoaded = false;
  let canvas;

  // Images
  let ballImage = null;
  let paddleImage = null;
  let hitSound = null;

  // Actors

  const actors = [];

  const ball = {
    x: GAME.halfWidth,
    y: GAME.halfHeight,
    width: 20,
    height: 20,
    speed: 9,
    direction: 45
  };

  const player = {
    x: 10,
    y: GAME.halfHeight - 30,
    width: 10,
    height: 60,
    speed: 3.2,
    points: 0
  };

  const rival = {
    x: GAME.width - 20,
    y: GAME.halfHeight - 30,
    width: 10,
    height: 60,
    speed: 5.8,
    points: 0
  };

  actors.push(ball, player, rival)

  s.preload = () => {
    ballImage = s.loadImage('assets/ball.png')
    paddleImage = s.loadImage('assets/paddle.png')
    hitSound = s.loadSound('assets/sounds/Table-tennis-paddle-ball-hit.wav')
  }

  s.setup = () => {
    canvas = s.createCanvas(GAME.width, GAME.height)
    canvas.parent('sketch-canvas')

    s.background('black')

    setTimeout(() => {
      document.querySelector('canvas')?.focus()
    }, 500);
  }

  s.draw = () => {
    isLoading()

    if (gameLoaded) {
      s.background('black')
      s.image(ballImage, ball.x, ball.y, ball.width, ball.height)
      s.image(paddleImage, player.x, player.y, player.width, player.height)
      s.image(paddleImage, rival.x, rival.y, rival.width, rival.height)

      showPoints()

      if (GAME.pause === false) {
        collideBallWall()
        collideBallPlayer()
        collideBallRival()
        moveBall()
        movePlayer()
        moveRival()
      }

    } else {
      if (canvas) {
        showLoading()
      }
    }
  }

  function isLoading() {
    if (ballImage && paddleImage && hitSound) {
      gameLoaded = true;
    }
  }

  function showLoading() {
    s.textSize(15)
    s.fill('white')
    s.textAlign('center')
    s.text('Loading', GAME.halfWidth, GAME.halfHeight)
  }

  function showPoints() {
    s.textSize(20)
    s.fill('white')
    s.textAlign('center')
    s.text(`${player.points}`, GAME.halfWidth - 100, 30)
    s.text(`${rival.points}`, GAME.halfWidth + 100, 30)
  }

  function moveBall() {
    ball.x += ball.speed * s.cos(s.radians(ball.direction));
    ball.y -= ball.speed * s.sin(s.radians(ball.direction));
  }

  function movePlayer() {
    if (s.keyIsDown(s.UP_ARROW)) {
      player.y -= player.speed;
    }

    if (s.keyIsDown(s.DOWN_ARROW)) {
      player.y += player.speed;
    }
  }

  function moveRival() {
    const diff = ball.y - rival.y
    const rivalSpeed = diff > 0 ? rival.speed : -(rival.speed)
    rival.y += rivalSpeed
  }

  function collideBallPlayer() {
    let hit = s.collideRectCircle(player.x, player.y, player.width, player.height, ball.x, ball.y, ball.width / 2)

    if (hit) {
      bounceBall({ left: true })
      hitSound.play()
    }
  }

  function collideBallRival() {
    const middleX = ball.x + ball.width / 2
    const middleY = ball.y + ball.height / 2
    let hit = s.collideRectCircle(rival.x, rival.y, rival.width, rival.height, middleX, middleY, ball.width / 2)

    if (hit) {
      bounceBall({ right: true })
      hitSound.play()
    }
  }

  function collideBallWall() {
    // walls
    const right = ball.x > GAME.width - ball.width;
    const left = ball.x < 0;
    const top = ball.y < 0;
    const bottom = ball.y > GAME.height - ball.height;

    if (right || left) {
      GAME.pause = true;

      if (right) {
        playerMakePoint()
      }
      else if (left) {
        rival.points += 1;
      }

      setTimeout(() => {
        startAgain()
      }, 1000)

    } else {
      bounceBall({ top, bottom })
    }

  }

  function bounceBall({ top, bottom, left, right }) {
    // Quadrantes
    const squad1 = ball.direction > 0 && ball.direction < 90;
    const squad2 = ball.direction > 90 && ball.direction < 180;
    const squad3 = ball.direction > 180 && ball.direction < 270;
    const squad4 = ball.direction > 270 && ball.direction < 360;

    if (top) {
      if (squad1) ball.direction += 270
      if (squad2) ball.direction += 90
    }

    if (bottom) {
      if (squad3) ball.direction -= 90
      if (squad4) ball.direction -= 270
    }

    if (right) {
      if (squad1) ball.direction += 90
      if (squad4) ball.direction -= 90
    }

    if (left) {
      if (squad3) ball.direction += 90
      if (squad2) ball.direction -= 90
    }
  }

  function playerMakePoint() {
    player.points += 1;
  }

  function startAgain() {
    GAME.pause = false;
    ball.x = GAME.halfWidth;
    ball.y = GAME.halfHeight;
    ball.direction = 45;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  new p5((s) => sketch(s))
})

