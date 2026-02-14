/***********************
 * DOM
 ***********************/
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const giftBox = document.getElementById("giftBox");

const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const closeOverlay = document.getElementById("closeOverlay");

const switchBtn = document.getElementById("switchPlayer");
const resetScoreBtn = document.getElementById("resetScore");

const scoreHeEl = document.getElementById("scoreHe");
const scoreSheEl = document.getElementById("scoreShe");

/***********************
 * STATE
 ***********************/
let currentPlayer = "he";
let gameActive = true;
let board = Array(9).fill(null);

/***********************
 * STORAGE
 ***********************/
function getStats() {
  return JSON.parse(localStorage.getItem("xoStats")) || { he: 0, she: 0 };
}

function saveStats(stats) {
  localStorage.setItem("xoStats", JSON.stringify(stats));
}

function updateScore() {
  const stats = getStats();
  scoreHeEl.textContent = stats.he;
  scoreSheEl.textContent = stats.she;
}

/***********************
 * ICONS
 ***********************/
const icons = {
  he: '<i class="fa-solid fa-xmark"></i>',
  she: '<i class="fa-solid fa-o"></i>'
};

/***********************
 * GIFTS
 ***********************/
const gifts = [
  "💆 Masaj senzual timp de 5 minute",
  "💃 Un dans lent, doar pentru tine",
  "💋 Sărutări fără grabă",
  "😏 Răsfăț ales de partener",
  "🔥 Provocare romantică surpriză"
];

/***********************
 * INIT
 ***********************/
function init() {
  boardEl.innerHTML = "";
  board.fill(null);
  gameActive = true;

  // 🔒 ASCUNDE FORȚAT CADOUL
  giftBox.classList.add("hidden");
  giftBox.style.display = "none";

  restartBtn.classList.add("hidden");

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.onclick = handleMove;
    boardEl.appendChild(cell);
  }

  updateStatus();
  updateScore();
}
function updateStatus() {
  const names = getCoupleNames();

  statusEl.textContent =
    currentPlayer === "he"
      ? "Rândul lui " + names.he
      : "Rândul ei " + names.she;
}

/***********************
 * MOVE
 ***********************/
function handleMove(e) {
  if (!gameActive) return;

  const index = e.currentTarget.dataset.index;
  if (board[index]) return;

  board[index] = currentPlayer;
  e.currentTarget.innerHTML = icons[currentPlayer];
  e.currentTarget.classList.add("used", currentPlayer);

  if (checkWin()) {
  handleWin();

  if (typeof addGlobalPoint === "function") {
    addGlobalPoint(currentPlayer, "xo");
  }

  return;
}

  if (board.every(Boolean)) {
    gameActive = false;
    statusEl.textContent = "🤝 Egalitate!";
    restartBtn.classList.remove("hidden");
    return;
  }

  currentPlayer = currentPlayer === "he" ? "she" : "he";
  updateStatus();
}

function handleWin() {
  gameActive = false;

  const { he, she } = getCoupleNames();
  const winnerName = currentPlayer === "he" ? he : she;

  statusEl.textContent = `🎉 Felicitări ${winnerName}!`;

  const stats = getStats();
  currentPlayer === "he" ? stats.he++ : stats.she++;
  saveStats(stats);
  updateScore();

  launchConfetti();

  setTimeout(() => {
    giftBox.style.display = "flex";
    giftBox.classList.remove("hidden");
  }, 900);

  restartBtn.classList.remove("hidden");
}


/***********************
 * WIN CHECK
 ***********************/
function checkWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo =>
    combo.every(i => board[i] === currentPlayer)
  );
}

/***********************
 * GIFT
 ***********************/
giftBox.onclick = () => {
  const gift = gifts[Math.floor(Math.random() * gifts.length)];
  overlayText.textContent = gift;
  overlay.classList.remove("hidden");

  // 🎁 dispare definitiv după deschidere
  giftBox.classList.add("hidden");
  giftBox.style.display = "none";
};

closeOverlay.onclick = () => {
  overlay.classList.add("hidden");
};

/***********************
 * SWITCH PLAYER
 ***********************/
switchBtn.onclick = () => {
  currentPlayer = currentPlayer === "he" ? "she" : "he";
  switchBtn.innerHTML =
    currentPlayer === "he"
      ? '<i class="fa-solid fa-mars"></i>'
      : '<i class="fa-solid fa-venus"></i>';
  updateStatus();
};

/***********************
 * RESET SCORE
 ***********************/
resetScoreBtn.onclick = () => {
  if (!confirm("Sigur vrei să resetezi scorul? 😏")) return;
  saveStats({ he: 0, she: 0 });
  updateScore();
};

/***********************
 * CONFETTI
 ***********************/
function launchConfetti() {
  for (let i = 0; i < 120; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = `hsl(${Math.random() * 360},80%,60%)`;
    c.style.animationDuration = 2 + Math.random() * 2 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/***********************
 * RESTART
 ***********************/
restartBtn.onclick = init;

/***********************
 * START
 ***********************/
init();



