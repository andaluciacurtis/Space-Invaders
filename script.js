const grid = document.querySelector('.grid');
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let goingRight = true;
const resultsDisplay = document.querySelector('.results');
let aliensRemoved = [];
let score = 0;

for (let i = 0; i < 225; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

const squares = document.querySelectorAll('.grid div');

const alienInvaders =  [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader');
    }
  }
  resultsDisplay.innerHTML = `Score: ${score}`;
}

draw();

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader');
  }
}

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter');
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) {
        currentShooterIndex--;
        break;
      }
    case 'ArrowRight':
      if (currentShooterIndex % width < width - 1) {
        currentShooterIndex++;
        break;
      }
  }
  squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
    }
    goingRight = false;
  }

  if (leftEdge && !goingRight) {
    for ( i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
    }
    goingRight = true;
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  draw();

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      resultsDisplay.innerHTML = 'GAME OVER';
      clearInterval(invadersId);
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > 210) {
      resultsDisplay.innerHTML = 'GAME OVER';
      clearInterval(invadersId);
    }
  }
}

let invadersId = setInterval(moveInvaders, 500);

let laserId;
let currentLaserIndex;

function shoot(e) {
  console.log('shoot');
  switch(e.key) {
    case 'ArrowUp':
      currentLaserIndex = currentShooterIndex;
      laserId = setInterval(moveLaser, 100);
  }

}

function moveLaser() {
  squares[currentLaserIndex].classList.remove('laser');

  if (currentLaserIndex >= width) {
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add('laser');
  } else {
    clearInterval(laserId);
  }
  
  if (squares[currentLaserIndex].classList.contains('invader')) {
    squares[currentLaserIndex].classList.remove('laser');
    squares[currentLaserIndex].classList.remove('invader');
    clearInterval(laserId);

    const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
    aliensRemoved.push(alienRemoved);
    score++;
  }

  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN!';
  }
}

document.addEventListener('keydown', shoot);