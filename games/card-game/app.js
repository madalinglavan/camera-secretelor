/***********************
 * UTILS
 ***********************/
function getStats() {
  const raw = JSON.parse(localStorage.getItem("stats")) || {};
  return {
    he: raw.he || 0,
    she: raw.she || 0,
    cardsOpened: raw.cardsOpened || 0,
    openedCards: Array.isArray(raw.openedCards) ? raw.openedCards : []
  };
}

function saveStats(stats) {
  localStorage.setItem("stats", JSON.stringify(stats));
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/***********************
 * ELEMENTE DOM
 ***********************/
const board = document.getElementById("board");
const loader = document.getElementById("loader");
const menu = document.getElementById("playerMenu");

const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlay-img");
const overlayText = document.getElementById("overlay-text");
const closeOverlay = document.getElementById("closeOverlay");

const scoreHeEl = document.getElementById("scoreHe");
const scoreSheEl = document.getElementById("scoreShe");

const resetBtn = document.getElementById("reset");
const randomBtn = document.getElementById("randomCard");
const resetScoreBtn = document.getElementById("resetScore");

const resetConfirm = document.getElementById("resetConfirm");
const confirmReset = document.getElementById("confirmReset");
const cancelReset = document.getElementById("cancelReset");
const resetText = document.getElementById("resetText");

const switchBtn = document.getElementById("switchPlayer");
const switchMessage = document.getElementById("switchMessage");

const endPanel = document.getElementById("endPanel");
const restartGameBtn = document.getElementById("restartGame");

/***********************
 * DATE CARTI
 ***********************/
const cardsData = [
  { img: "img/1.jpg", text: "Misionar 😘❤️" },
  { img: "img/2.jpg", text: "Doggy style 🍑🔥" },
  { img: "img/3.jpg", text: "Călăreț clasic 🐎💋" },
  { img: "img/4.jpg", text: "Lingurița 🥄💞" },
  { img: "img/5.jpg", text: "Față în față pe scaun 🪑🔥" },
  { img: "img/6.jpg", text: "69, ea deasupra 👄🍑" },
  { img: "img/7.jpg", text: "69, el deasupra 👅🔥" },
  { img: "img/8.jpg", text: "Oral ei 👄💖" },
  { img: "img/9.jpg", text: "Oral lui 👅❤️" },
  { img: "img/10.jpg", text: "Lotus 🪷💞" },
  { img: "img/11.jpg", text: "Pe marginea patului 🛏️🔥" },
  { img: "img/12.jpg", text: "Sprijin lateral 🛌💋" },
  { img: "img/13.jpg", text: "Față în față culcați 😘💏" },
  { img: "img/14.jpg", text: "Poziția răsucită 🔄🔥" },
  { img: "img/15.jpg", text: "Îmbrățișare din genunchi 🙆‍♀️💞" },
  { img: "img/16.jpg", text: "Poziția scaunului 🪑💋" }
];

/***********************
 * INIT STORAGE
 ***********************/
if (!localStorage.getItem("stats")) {
  saveStats({ he: 0, she: 0, cardsOpened: 0, openedCards: [] });
}

let currentPlayer = null;

/***********************
 * UI BLOCK
 ***********************/
function isUIBlocked() {
  return (
    !overlay.classList.contains("hidden") ||
    !resetConfirm.classList.contains("hidden") ||
    !endPanel.classList.contains("hidden")
  );
}

/***********************
 * SCORE
 ***********************/
function updateScore() {
  const stats = getStats();
  scoreHeEl.textContent = stats.he;
  scoreSheEl.textContent = stats.she;
}

/***********************
 * RENDER BOARD
 ***********************/
function renderBoard(data = cardsData) {
  board.innerHTML = "";
  const stats = getStats();

  data.forEach((cardData, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = String(index);

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    front.textContent = "❓";

    const back = document.createElement("div");
    back.className = "card-back";

    const img = document.createElement("img");
    img.src = cardData.img;

    back.appendChild(img);
    inner.append(front, back);
    card.appendChild(inner);

    const saved = stats.openedCards.find(c => c.id === card.dataset.id);
    if (saved) {
      card.dataset.opened = "true";
      card.classList.add("used", saved.player);
    }

    card.onclick = () => {
      if (!currentPlayer || isUIBlocked()) return;
      if (card.dataset.opened) return;

      stats.openedCards.push({ id: card.dataset.id, player: currentPlayer });
      stats.cardsOpened++;
      currentPlayer === "he" ? stats.he++ : stats.she++;

      saveStats(stats);
      updateScore();
      // 🌍 GLOBAL STATS (CARD GAME)
      addGlobalPoint(currentPlayer, "card");

      card.dataset.opened = "true";
      card.classList.add("flipped", currentPlayer);

      setTimeout(() => {
        overlayImg.src = cardData.img;
        overlayText.textContent = cardData.text;
        overlay.classList.remove("hidden");
        checkEndGame();
      }, 600);
    };

    board.appendChild(card);
  });
}

/***********************
 * FINAL DE RUNDA
 ***********************/
function checkEndGame() {
  const cards = document.querySelectorAll(".card");
  const opened = [...cards].filter(c => c.dataset.opened === "true");
  if (opened.length === cards.length) {
    setTimeout(showEndPanel, 800);
  }
}

function showEndPanel() {
  endPanel.classList.remove("hidden");
  launchConfetti();
}

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
 * BUTTONS
 ***********************/
closeOverlay.onclick = () => {
  overlay.classList.add("hidden");

  showThankPopup(
    ["😏 bună alegere!", "🔥 interesant…", "🫣 curajos!", "💋 spicy!"][
      Math.floor(Math.random() * 4)
    ]
  );
};


randomBtn.onclick = () => {
  if (!currentPlayer || isUIBlocked()) return;
  const cards = [...document.querySelectorAll(".card")].filter(
    c => !c.dataset.opened
  );
  if (!cards.length) return;
  cards[Math.floor(Math.random() * cards.length)].click();
};

resetBtn.onclick = () => {
  if (isUIBlocked()) return;
  renderBoard(shuffleArray(cardsData));
};

const resetMessages = [
  "😏 Sigur vrei să ștergem scorul?",
  "🔥 Ești sigur/ă?",
  "🙈 Decizie asumată?",
  "💣 Resetăm scorul?"
];

resetScoreBtn.onclick = () => {
  resetText.textContent =
    resetMessages[Math.floor(Math.random() * resetMessages.length)];
  resetConfirm.classList.remove("hidden");
};

confirmReset.onclick = () => {
  saveStats({ he: 0, she: 0, cardsOpened: 0, openedCards: [] });
  updateScore();
  renderBoard();
  resetConfirm.classList.add("hidden");
};

cancelReset.onclick = () => resetConfirm.classList.add("hidden");

/***********************
 * SWITCH PLAYER
 ***********************/
const switchMessages = {
  he: ["😏 EL preia controlul", "🎩 Gentleman mode"],
  she: ["💃 EA conduce", "💄 Queen mode"]
};

switchBtn.onclick = () => {
  if (!currentPlayer || isUIBlocked()) return;
  currentPlayer = currentPlayer === "he" ? "she" : "he";
  switchBtn.innerHTML =
  currentPlayer === "he"
    ? '<i class="fa-solid fa-mars"></i>'
    : '<i class="fa-solid fa-venus"></i>';

  const msg =
    switchMessages[currentPlayer][
      Math.floor(Math.random() * switchMessages[currentPlayer].length)
    ];
  switchMessage.textContent = msg;
  switchMessage.classList.add("show");
  setTimeout(() => switchMessage.classList.remove("show"), 1300);
};

/***********************
 * RESTART RUNDA (NU SCOR)
 ***********************/
restartGameBtn.onclick = () => {
  const stats = getStats();
  stats.openedCards = [];
  stats.cardsOpened = 0;
  saveStats(stats);
  endPanel.classList.add("hidden");
  renderBoard(shuffleArray(cardsData));
};

/***********************
 * LOADER + PLAYER MENU
 ***********************/
window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.display = "none";
    menu.style.display = "flex";
    updateScore();
    renderBoard();
  }, 2000);
});

document.getElementById("chooseHe").onclick = () => {
  currentPlayer = "he";
  menu.style.display = "none";
};

document.getElementById("chooseShe").onclick = () => {
  currentPlayer = "she";
  menu.style.display = "none";
};


/***********************
 * THANK POPUP
 ***********************/
const thankPopup = document.getElementById("thankPopup");

/**
 * Afișează popup-ul de confirmare
 * @param {string} text - mesaj opțional
 * @param {number} duration - cât timp rămâne (ms)
 */
function showThankPopup(text = "🫣 hmm.. 😏 bună alegere!", duration = 1500) {
  if (!thankPopup) return;

  thankPopup.textContent = text;
  thankPopup.classList.add("show");

  if (navigator.vibrate) {
    navigator.vibrate(20);
  }

  setTimeout(() => {
    thankPopup.classList.remove("show");
  }, duration);
}

document.querySelector(".back-menu").onclick = () => {
  if (isUIBlocked()) return;
  location.href = "../../index.html";
};
