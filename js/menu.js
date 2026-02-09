const globalHeEl = document.getElementById("globalHe");
const globalSheEl = document.getElementById("globalShe");
const bigBox = document.getElementById("bigBox");

const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const closeOverlay = document.getElementById("closeOverlay");

/* UPDATE UI */
function updateGlobalUI() {
  const stats = getGlobalStats();

  globalHeEl.textContent = stats.he.score;
  globalSheEl.textContent = stats.she.score;

  if (stats.bigBoxUnlocked) {
    bigBox.classList.remove("hidden");
  } else {
    bigBox.classList.add("hidden");
  }
}

/* OPEN BIG BOX */
bigBox.onclick = () => {
  const stats = getGlobalStats();
  const gift = getRandomBigGift();

  const winner =
    stats.bigBoxWinner === "he" ? "EL" : "EA";

  overlayText.innerHTML = `
    🎉 ${winner} a ajuns la 10 puncte!<br><br>
    🎁 <strong>${gift}</strong>
  `;

  overlay.classList.remove("hidden");

  resetGlobalScore();
  updateGlobalUI();
};

closeOverlay.onclick = () => {
  overlay.classList.add("hidden");
};

/* INIT */
updateGlobalUI();
