// board
let board;
let boardWidth = 720;
let boardHeight = 480;
let context;

let posUp = boardHeight/8;
let posDown = boardHeight/8 * 5;

// game mechanics
let gameOver = false;
let gameWon = false;
let score = 0;

// sound
let deathSound = new Audio("./assets/explosion.mp3");
let moveSound = new Audio("./assets/move.wav");
let winSound = new Audio("./assets/win.wav");
let theme = new Audio("./assets/Theme.mp3");

// player
let playerWidth = 200;
let playerHeight = 100;
let playerX = -200;
let playerY = boardHeight/8 * 5;
let playerImg;
let playerVelocity = 10;

let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight 
}

// enemies
let enemyArray = [];
let enemyWidth = 200;
let enemyHeight = 100;
let enemyX = boardWidth;
let enemyY;
let enemy1Img;
let enemy2Img;
let enemy3Img;
let enemyVelocity = -8;

// moving
let isMovingUp = false;
let isMovingDown = false;

window.onload = function() {
    theme.play();
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // load img
    playerImg = new Image();
    playerImg.src = "./assets/Player.png";
    playerImg.onload = function() {
        context.drawImage(playerImg,player.x,player.y,player.width,player.height);
    }
    enemy1Img = new Image();
    enemy1Img.src = "./assets/Enemy1.png";

    enemy2Img = new Image();
    enemy2Img.src = "./assets/Enemy2.png";

    enemy3Img = new Image();
    enemy3Img.src = "./assets/Enemy3.png";

    

    requestAnimationFrame(update);
    setInterval(newEnemy, 1500);
    document.addEventListener("keypress", movePlayer);
}
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    if (gameWon) {
        if (player.x + playerVelocity < boardWidth + playerWidth) {
            player.x += playerVelocity;
            enemyArray = [];
        } else {
            return;
        }
    }
    context.clearRect(0,0,board.width,board.height)
    
    // player
    if (isMovingUp && (player.y - playerVelocity >= posUp)) {
        player.y -= playerVelocity;
    }

    if (isMovingDown && (player.y + playerVelocity <= posDown)) {
        player.y += playerVelocity;
    }
    context.drawImage(playerImg,player.x,player.y,player.width,player.height);
    if (player.x < boardWidth/8) {
        player.x += 5;
    }
    
    // enemies
    for (let i=0;i<enemyArray.length;i++) {
        let current = enemyArray[i];
        current.x += enemyVelocity;
        context.drawImage(current.img,current.x,current.y,current.width,current.height);

        if (detectCollision(player,current)) {
            gameOver = true;
        }
    }

    while (enemyArray.length > 0 && enemyArray[0].x < -enemyWidth) {
        enemyArray.shift();
        score += 1;
        enemyVelocity *= 1.05;

    }
    let num = -enemyVelocity * 100;
    let newNum = Math.floor(num);
    newNum /= 100;
    // game stuff
    context.fillStyle = "red";
    context.font="32px sans-serif";
    context.fillText(score + " car(s) evaded ", 5, 45);
    context.fillText(newNum + " enemy speed", 350, 45);
    if (score >= 18) {
        gameWon = true;
        enemyArray = [];
        winSound.play();
    }
    if (gameOver && !gameWon) {
        context.fillText("GAME OVER", boardWidth/3, boardHeight/2+60);
        deathSound.play();
    }
    if (gameWon) {
        context.fillText("YOU WON THE GAME", boardWidth/4, boardHeight/2+60);
    }
}

function newEnemy() {
    let version = Math.floor(1 + Math.random() * 3);
    let enemyPos = Math.floor(1 + Math.random()* 3);
    if (enemyPos == 1) {
        enemyY = boardHeight/8;
    } else if (enemyPos == 2) {
        enemyY = boardHeight/8 * 5;
    } else {
        enemyY = boardHeight/8 * 3;
    }

    let enemy = {
        x: enemyX,
        y: enemyY,
        width: enemyWidth,
        height: enemyHeight,
        passed: false
    }

    if (version == 1) {
        enemy.img = enemy1Img;
    }
    else if (version == 2) {
        enemy.img = enemy2Img;
    }
    else {
        enemy.img = enemy3Img;
    }
    enemyArray.push(enemy);
}

function movePlayer(key) {
    if (key.code == "KeyW") {
        if (player.y - playerVelocity > posUp) {
            isMovingUp = true;
            isMovingDown = false;
            moveSound.play();
        }
        if (gameOver || gameWon) {
            player.y = playerY;
            player.x = playerX;
            enemyArray = [];
            score = 0;
            enemyVelocity = -8;
            gameOver = false;
            gameWon = false;
        }
    }
    if (key.code == "KeyS") {
        if (player.y + playerVelocity < posDown) {
            isMovingUp = false;
            isMovingDown = true;
            moveSound.play();
        }
        if (gameOver || gameWon) {
            player.y = playerY;
            player.x = playerX;
            enemyArray = [];
            score = 0;
            enemyVelocity = -8;
            gameOver = false;
            gameWon = false;
        }
    }
    
}

function detectCollision(a, b) {
    return a.x + 20 < b.x + b.width - 20 &&
           a.x + a.width - 20 > b.x + 20 &&
           a.y + 20 < b.y + b.height - 20 &&
           a.y + a.height - 20 > b.y + 20;
}