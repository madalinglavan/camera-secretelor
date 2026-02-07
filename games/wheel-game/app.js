/***********************
 * DATA
 ***********************/
const wheelItems = [
  { label: "Sărut", img: "img/kiss.jpg" },
  { label: "Masaj", img: "img/massage.jpg" },
  { label: "Poziție", img: "img/position.jpg" },
  { label: "Oral", img: "img/oral.jpg" },
  { label: "Mângâieri", img: "img/touch.jpg" },
  { label: "Surpriză", img: "img/surprise.jpg" }
];

/***********************
 * DOM
 ***********************/
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const resultEl = document.getElementById("result");
const switchBtn = document.getElementById("switchPlayer");

/***********************
 * STORAGE
 ***********************/
function getStats() {
  const raw = JSON.parse(localStorage.getItem("wheelStats")) || {};
  return {
    he: raw.he || 0,
    she: raw.she || 0
  };
}

function saveStats(stats) {
  localStorage.setItem("wheelStats", JSON.stringify(stats));
}

/***********************
 * STATE
 ***********************/
let currentPlayer = "he";
let currentRotation = 0;
let spinning = false;

/***********************
 * SCORE
 ***********************/
function updateScore() {
  const stats = getStats();
  document.getElementById("scoreHe").textContent = stats.he;
  document.getElementById("scoreShe").textContent = stats.she;
}

/***********************
 * WHEEL GEOMETRY
 ***********************/
const sliceAngle = 360 / wheelItems.length;
const skew = 90 - sliceAngle;
const scaleY = Math.tan((sliceAngle / 2) * Math.PI / 180);

/***********************
 * BUILD WHEEL
 ***********************/
const iconsContainer = document.getElementById("icons");

function buildWheel() {
  iconsContainer.innerHTML = "";

  const radius = 110;
  const center = 150;
  const sliceAngle = 360 / wheelItems.length;

  wheelItems.forEach((item, index) => {
    const icon = document.createElement("img");
    icon.src = item.img;
    icon.className = "wheel-icon";

    const angle = index * sliceAngle + sliceAngle / 2 - 90;

    const rad = angle * Math.PI / 180;

    const x = center + radius * Math.cos(rad) - 32;
    const y = center + radius * Math.sin(rad) - 32;

    icon.style.left = `${x}px`;
    icon.style.top = `${y}px`;
    icon.style.transform = `rotate(${angle + 90}deg)`;



    iconsContainer.appendChild(icon);
  });
}


/***********************
 * SPIN LOGIC
 ***********************/
spinBtn.onclick = () => {
  if (spinning) return;

  spinning = true;
  spinBtn.disabled = true;
  resultEl.classList.add("hidden");

  const stats = getStats();
  const index = Math.floor(Math.random() * wheelItems.length);

  const extraSpins = 360 * (3 + Math.floor(Math.random() * 3));
  const stopAngle = index * sliceAngle + sliceAngle / 2;

  currentRotation += extraSpins + (360 - stopAngle);
  wheel.style.transform = `rotate(${currentRotation}deg)`;
iconsContainer.style.transform = `rotate(${currentRotation}deg)`;


  setTimeout(() => {
    resultEl.textContent = wheelItems[index].label;
    resultEl.classList.remove("hidden");

    currentPlayer === "he" ? stats.he++ : stats.she++;
    saveStats(stats);
    updateScore();

    spinning = false;
    spinBtn.disabled = false;
  }, 4000);
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
};

/***********************
 * INIT
 ***********************/
window.addEventListener("load", () => {
  buildWheel();
  updateScore();

  switchBtn.innerHTML =
    currentPlayer === "he"
      ? '<i class="fa-solid fa-mars"></i>'
      : '<i class="fa-solid fa-venus"></i>';
});


window.addEventListener("load", () => {
  // init wheel
  buildWheel();
  updateScore();

  switchBtn.innerHTML =
    currentPlayer === "he"
      ? '<i class="fa-solid fa-mars"></i>'
      : '<i class="fa-solid fa-venus"></i>';

  // reset score logic
  const resetScoreBtn = document.getElementById("resetScore");
  const resetConfirm = document.getElementById("resetConfirm");
  const confirmReset = document.getElementById("confirmReset");
  const cancelReset = document.getElementById("cancelReset");

  resetScoreBtn.onclick = () => {
    resetConfirm.classList.remove("hidden");
  };

  confirmReset.onclick = () => {
    saveStats({ he: 0, she: 0 });
    updateScore();
    resetConfirm.classList.add("hidden");
  };

  cancelReset.onclick = () => {
    resetConfirm.classList.add("hidden");
  };
});
