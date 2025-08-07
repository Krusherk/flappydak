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

let game_state = 'Start';
message.classList.add('messageStyle');

let bird_dy = 0;
let gameStarted = false;

// Avoid attaching multiple listeners
function flap() {
  if (game_state === 'Play') {
    img.src = 'images/Bird-2.png';
    bird_dy = -7.6;
  }
}

// Restart game
function restartGame() {
  document.querySelectorAll('.pipe_sprite').forEach(e => e.remove());
  img.style.display = 'block';
  bird.style.top = '40vh';
  bird_dy = 0;
  game_state = 'Play';
  score_val.innerHTML = '0';
  score_title.innerHTML = 'Score : ';
  message.innerHTML = '';
  message.classList.remove('messageStyle');
  play();
}

// Start/restart handlers
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && game_state !== 'Play') restartGame();
  if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') flap();
});

document.addEventListener('touchstart', () => {
  if (game_state !== 'Play') restartGame();
  else flap();
});

// Prevent pinch-zoom
document.addEventListener('gesturestart', (e) => e.preventDefault());

function submitScore() {
  const finalScore = parseInt(score_val.innerHTML, 10);
  const address = localStorage.getItem("flappy_wallet");
  if (!address || finalScore <= 0) return;

  fetch("http://localhost:3000/api/submit-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, score: finalScore }),
  }).catch(err => console.error("Score submit failed:", err));
}

function play() {
  function move() {
    if (game_state !== 'Play') return;

    let pipes = document.querySelectorAll('.pipe_sprite');
    pipes.forEach((element) => {
      let pipe_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_props.right <= 0) {
        element.remove();
      } else {
        // Collision detection
        if (
          bird_props.left < pipe_props.left + pipe_props.width &&
          bird_props.left + bird_props.width > pipe_props.left &&
          bird_props.top < pipe_props.top + pipe_props.height &&
          bird_props.top + bird_props.height > pipe_props.top
        ) {
          game_state = 'End';
          submitScore();
          message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
          message.classList.add('messageStyle');
          img.style.display = 'none';
          sound_die.play();
          return;
        } else {
          // Scoring
          if (
            pipe_props.right < bird_props.left &&
            pipe_props.right + move_speed >= bird_props.left &&
            element.increase_score === '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_props.left - move_speed + 'px';
        }
      }
    });

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  function apply_gravity() {
    if (game_state !== 'Play') return;

    bird_dy += gravity;

    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();

    // Bird hits top or bottom
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = 'End';
      submitScore();
      message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
      message.classList.add('messageStyle');
      img.style.display = 'none';
      sound_die.play();
      return;
    }

    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_separation = 0;
  const pipe_gap = 35;

  function create_pipe() {
    if (game_state !== 'Play') return;

    if (pipe_separation > 115) {
      pipe_separation = 0;
      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      // Upper pipe
      let pipe_top = document.createElement('div');
      pipe_top.className = 'pipe_sprite';
      pipe_top.style.top = pipe_posi - 70 + 'vh';
      pipe_top.style.left = '100vw';
      document.body.appendChild(pipe_top);

      // Lower pipe
      let pipe_bottom = document.createElement('div');
      pipe_bottom.className = 'pipe_sprite';
      pipe_bottom.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_bottom.style.left = '100vw';
      pipe_bottom.increase_score = '1';
      document.body.appendChild(pipe_bottom);
    }

    pipe_separation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}

// Leaderboard fetch
function fetchLeaderboard() {
  fetch("http://localhost:3000/api/leaderboard")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("leaderboardList");
      if (!list) return;
      list.innerHTML = "";
      data.forEach((entry, index) => {
        const shortAddr = entry.address.slice(0, 6) + "..." + entry.address.slice(-4);
        const item = document.createElement("li");
        item.textContent = `${index + 1}. ${shortAddr} - ${entry.score}`;
        list.appendChild(item);
      });
    })
    .catch(err => console.error("Failed to fetch leaderboard:", err));
}

fetchLeaderboard();
