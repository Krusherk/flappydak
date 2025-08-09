let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let highscore = parseInt(localStorage.getItem("flappy_highscore") || "0");
score_title.innerHTML = `Score : <br>High : ${highscore}`;

let game_state = 'Start';
message.classList.add('messageStyle');

let score = 0;
let bird_dy = 0;
let pipe_separation = 0;
let pipe_gap = 35;
let pipes = [];
let animationFrames = [];

function resetGame() {
  document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
  img.style.display = 'block';
  bird.style.top = '40vh';
  bird_dy = 0;
  score = 0;
  pipe_separation = 0;
  pipes = [];
  game_state = 'Play';
  score_val.innerHTML = '0';
  score_title.innerHTML = `Score : <br>High : ${highscore}`;
  message.innerHTML = '';
  message.classList.remove('messageStyle');
  bird_props = bird.getBoundingClientRect();
  animationFrames.forEach(cancelAnimationFrame);
  animationFrames = [];
  startGame();
}

function endGame() {
  game_state = 'End';
  img.style.display = 'none';
  message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
  message.classList.add('messageStyle');
  sound_die.play();
  submitScore();
}
function endGame() {
  // ... your existing game over logic ...

  // Deduct a play on every game end
  let plays = parseInt(localStorage.getItem("flappy_plays") || "0");
  plays = Math.max(plays - 1, 0);
  localStorage.setItem("flappy_plays", plays);

  if (plays <= 0) {
    localStorage.removeItem("flappy_paid");
    alert("❌ No plays left. Please pay 0.2 MON to continue.");
    window.location.href = "index.html";
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && game_state !== 'Play') {
    resetGame();
  }
  if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
    bird_dy = -7.6;
  }
});

document.addEventListener('touchstart', () => {
  if (game_state === 'Start') {
    resetGame();
  } else if (game_state === 'Play') {
    bird_dy = -7.6;
  }
});

function startGame() {
  function movePipes() {
    if (game_state !== 'Play') return;
    pipes.forEach(pipe => {
      const pipe_rect = pipe.getBoundingClientRect();
      if (pipe_rect.right <= 0) {
        pipe.remove();
      } else {
        pipe.style.left = pipe_rect.left - move_speed + 'px';

        if (pipe.increase_score && pipe_rect.right < bird_props.left) {
          score++;
          score_val.innerHTML = score;
          sound_point.play();
          pipe.increase_score = false;
        }

        bird_props = bird.getBoundingClientRect();
        if (
          bird_props.left < pipe_rect.left + pipe_rect.width &&
          bird_props.left + bird_props.width > pipe_rect.left &&
          bird_props.top < pipe_rect.top + pipe_rect.height &&
          bird_props.top + bird_props.height > pipe_rect.top
        ) {
          endGame();
          return;
        }
      }
    });
    animationFrames.push(requestAnimationFrame(movePipes));
  }

  function applyGravity() {
    if (game_state !== 'Play') return;
    bird_dy += gravity;
    let newTop = bird.offsetTop + bird_dy;

    if (newTop <= 0 || newTop + bird.clientHeight >= background.height) {
      endGame();
      return;
    }

    bird.style.top = newTop + 'px';
    bird_props = bird.getBoundingClientRect();
    animationFrames.push(requestAnimationFrame(applyGravity));
  }

  function generatePipes() {
    if (game_state !== 'Play') return;

    if (pipe_separation > 115) {
      pipe_separation = 0;
      const pipe_pos = Math.floor(Math.random() * 43) + 8;

      const pipe_top = document.createElement('div');
      pipe_top.className = 'pipe_sprite';
      pipe_top.style.top = pipe_pos - 70 + 'vh';
      pipe_top.style.left = '100vw';

      const pipe_bottom = document.createElement('div');
      pipe_bottom.className = 'pipe_sprite';
      pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
      pipe_bottom.style.left = '100vw';
      pipe_bottom.increase_score = true;

      document.body.appendChild(pipe_top);
      document.body.appendChild(pipe_bottom);

      pipes.push(pipe_top, pipe_bottom);
    }

    pipe_separation++;
    animationFrames.push(requestAnimationFrame(generatePipes));
  }

  animationFrames.push(requestAnimationFrame(movePipes));
  animationFrames.push(requestAnimationFrame(applyGravity));
  animationFrames.push(requestAnimationFrame(generatePipes));
}

function submitScore() {
  const wallet = localStorage.getItem("flappy_wallet");
  if (!wallet || score <= 0) return;
  if (typeof saveScoreToFirebase === "function") {
    saveScoreToFirebase(score);
  }
}
if (score > highscore) {
  highscore = score;
  localStorage.setItem("flappy_highscore", highscore.toString());
}
