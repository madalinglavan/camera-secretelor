const openBtn = document.getElementById("openBtn");
const box = document.getElementById("box");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const closeOverlay = document.getElementById("closeOverlay");
const switchBtn = document.getElementById("switchPlayer");

let currentPlayer = "he";

/* STORAGE */
function getStats() {
  return JSON.parse(localStorage.getItem("mysteryStats")) || { he: 0, she: 0 };
}

function saveStats(stats) {
  localStorage.setItem("mysteryStats", JSON.stringify(stats));
}

function updateScore() {
  const s = getStats();
  document.getElementById("scoreHe").textContent = s.he;
  document.getElementById("scoreShe").textContent = s.she;
}

/* ITEMS */
const rewards = [
  { text: "💋 Sărut pasional 30 sec", type: "challenge" },
  { text: "💆‍♀️ Masaj lent 45 sec", type: "challenge" },
  { text: "🔥 Poziție aleasă de partener", type: "challenge" },
  { text: "➕ +1 punct pentru tine", type: "bonus" },
  { text: "🔄 Schimbare de jucător", type: "switch" },
  { text: "🎡 Roata decide!", type: "redirect", target: "../wheel-game/index.html" }
];

/* OPEN BOX */
openBtn.onclick = () => {
  box.classList.add("shake");

  setTimeout(() => {
    box.classList.remove("shake");

    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    overlayText.textContent = reward.text;

    const stats = getStats();

    if (reward.type === "bonus") {
      currentPlayer === "he" ? stats.he++ : stats.she++;
      saveStats(stats);
      updateScore();
    }

    if (reward.type === "switch") {
      currentPlayer = currentPlayer === "he" ? "she" : "he";
      updateSwitchIcon();
    }

    if (reward.type === "redirect") {
      setTimeout(() => location.href = reward.target, 1500);
    }

    overlay.classList.remove("hidden");
  }, 1200);
};

closeOverlay.onclick = () => overlay.classList.add("hidden");

/* SWITCH PLAYER */
switchBtn.onclick = () => {
  currentPlayer = currentPlayer === "he" ? "she" : "he";
  updateSwitchIcon();
};

function updateSwitchIcon() {
  switchBtn.innerHTML =
    currentPlayer === "he"
      ? '<i class="fa-solid fa-mars"></i>'
      : '<i class="fa-solid fa-venus"></i>';
}

/* INIT */
updateScore();
updateSwitchIcon();
