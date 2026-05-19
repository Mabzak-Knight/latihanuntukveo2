const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart');

const tileCount = 20;
let tileSize = canvas.width / tileCount;

let snake = [];
let direction = {x:1,y:0};
let food = {x:5,y:5};
let score = 0;
let gameInterval = null;
let gameOver = false;
let speed = 120;

function reset() {
  tileSize = canvas.width / tileCount;
  snake = [ {x:9,y:10}, {x:8,y:10}, {x:7,y:10} ];
  direction = {x:1,y:0};
  placeFood();
  score = 0;
  gameOver = false;
  updateScore();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(tick, speed);
}

function placeFood(){
  do{
    food.x = Math.floor(Math.random()*tileCount);
    food.y = Math.floor(Math.random()*tileCount);
  } while(snake.some(s=>s.x===food.x && s.y===food.y));
}

function tick(){
  if (gameOver) return;
  const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

  // collisions
  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
    endGame(); return;
  }
  if (snake.some(s => s.x === head.x && s.y === head.y)) { endGame(); return; }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function updateScore(){ scoreEl.textContent = score; }

function endGame(){
  gameOver = true;
  clearInterval(gameInterval);
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // background grid
  ctx.fillStyle = '#051522';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // food
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(food.x*tileSize, food.y*tileSize, tileSize, tileSize);

  // snake
  for (let i=0;i<snake.length;i++){
    ctx.fillStyle = i===0 ? '#34d399' : '#10b981';
    ctx.fillRect(snake[i].x*tileSize, snake[i].y*tileSize, tileSize-1, tileSize-1);
  }

  if (gameOver){
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over — Tekan Mulai Ulang', canvas.width/2, canvas.height/2);
  }
}

window.addEventListener('keydown', e=>{
  const key = e.key;
  if (key === 'ArrowUp' || key === 'w' || key === 'W') setDirection(0,-1);
  if (key === 'ArrowDown' || key === 's' || key === 'S') setDirection(0,1);
  if (key === 'ArrowLeft' || key === 'a' || key === 'A') setDirection(-1,0);
  if (key === 'ArrowRight' || key === 'd' || key === 'D') setDirection(1,0);
});

function setDirection(x,y){
  // prevent reversing
  if (snake.length>1 && snake[0].x + x === snake[1].x && snake[0].y + y === snake[1].y) return;
  direction.x = x; direction.y = y;
}

// Mobile controls
document.getElementById('btn-up').addEventListener('click', ()=>setDirection(0,-1));
document.getElementById('btn-down').addEventListener('click', ()=>setDirection(0,1));
document.getElementById('btn-left').addEventListener('click', ()=>setDirection(-1,0));
document.getElementById('btn-right').addEventListener('click', ()=>setDirection(1,0));

restartBtn.addEventListener('click', ()=>{
  reset();
});

// Resize handler: keep tile size in sync if canvas scaled by CSS
window.addEventListener('resize', ()=>{
  tileSize = canvas.width / tileCount;
  draw();
});

// start
reset();
