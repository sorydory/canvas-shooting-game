// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");

// 2d를 ctx에 가져오기
ctx = canvas.getContext("2d");

// 캔버스 사이즈 정하기
canvas.width = 600;
canvas.height = 800;

// canvas를 html의 body에 넣어주기
document.body.appendChild(canvas);

// 변수세팅
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameoverImage;
let gameOver = false; // true면 게임 끝, false면 게임 계속
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

// 총알들을 저장하는 리스트
let bulletList = [];

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 20;
    this.y = spaceshipY;
    this.alive = true; // true면 살아있는 총알 false면 죽은 총알
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        score++;
        this.alive = false; // 죽은 총알
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 50);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 5; // 적군의 속도 조절
    if (this.y >= canvas.height - 50) {
      gameOver = true;
      console.log("gameover");
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/bg.png";
  spaceshipImage = new Image();
  spaceshipImage.src = "images/u.png";
  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";
  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";
  gameoverImage = new Image();
  gameoverImage.src = "images/gameover.png";
}

let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
    if (event.keyCode == 32) {
      createBullet(); // 총알 생성 함수
    }
  });
}

function createBullet() {
  console.log("총알생성");
  let newbullet = new Bullet();
  newbullet.init();
  console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000); // setInterval(호출하고 싶은 함수, 시간)
}
function update() {
  if (39 in keysDown) {
    spaceshipX += 5; // 우주선 속도 조절
  } // 오른쪽 클릭
  if (37 in keysDown) {
    spaceshipX -= 5;
  } // 왼쪽 클릭
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 57) {
    spaceshipX = canvas.width - 57;
  }
  // 우주선의 좌표값이 무한대로 업데이트 되는 게 아니라 배경 안에서만 있게 하기
  // 총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}
// 이미지 보여주는 함수
function render() {
  //drawImage(image, dx, dy, dWidth, dHeight)
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score:${score}`, 10, 30);
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update(); // 좌표 값 업데이트
    render();
    // main을 계속 호출해서 background에 기속적으로 나타날 수 있도록
    requestAnimationFrame(main);
  } else {
    // gameover 이미지 뜨게하기
    ctx.drawImage(gameoverImage, 100, 250, 380, 200);
  }
}
loadImage();
setupKeyboardListener();
createEnemy();
main();

// 방향키를 누르면 우주선의 xy좌표가 바뀌고 다시 render를 그려줌

// 총알만들기

// 1. 스페이스를 누르면 총알 발사

// 2. 총알이 발사 = 총알의 y값이 -- , 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표

// 3. 발사된 총알들은 총알 배열에 저장함.

// 4. 총알들은 x,y 좌표값이 있어야 함.

// 5. 총알 배열을 가지고 render를 그려줌.

// 적군 만들기

// 위치 랜덤, 1초마다 하나씩 생기며 아래로 내려옴(=y좌표 증가)

// 적군의 우주선이 바닥에 닿으면 게임오버

// 적군에 총알이 닿으면 우주선이 사라지고 점수 1점 획득

// 적군 죽이기

// 총알.y <= 적군.y And 총알.x <= 적군.x And 총알.x >= 적군.x + 적군의 넓이
