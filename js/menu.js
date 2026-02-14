/*************************
 * DOM
 *************************/
const globalHeEl = document.getElementById("globalHe");
const globalSheEl = document.getElementById("globalShe");
const bigBox = document.getElementById("bigBox");

const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const closeOverlay = document.getElementById("closeOverlay");

const editBtn = document.getElementById("editNamesBtn");
const namesOverlay = document.getElementById("namesOverlay");
const saveBtn = document.getElementById("saveNames");
const nameHeInput = document.getElementById("nameHe");
const nameSheInput = document.getElementById("nameShe");

/*************************
 * UPDATE GLOBAL UI
 *************************/
function updateGlobalUI() {
  const stats = getGlobalStats();
  const names = getCoupleNames();

  globalHeEl.textContent = stats.he.score;
  globalSheEl.textContent = stats.she.score;

  // Actualizare etichete cu nume
  document.querySelector(".score.he").childNodes[0].textContent =
    names.he + " ";
  document.querySelector(".score.she").childNodes[0].textContent =
    names.she + " ";

  if (stats.bigBoxUnlocked) {
    bigBox.classList.remove("hidden");
  } else {
    bigBox.classList.add("hidden");
  }
}

/*************************
 * BIG BOX CLICK
 *************************/
bigBox.onclick = () => {
  const stats = getGlobalStats();
  const names = getCoupleNames();
  const gift = getRandomBigGift();

  if (!stats.bigBoxUnlocked || !stats.bigBoxWinner) return;

  const winnerName =
    stats.bigBoxWinner === "he"
      ? names.he
      : names.she;

  overlayText.innerHTML = `
    👑 ${winnerName} este campionul absolut al pasiunii!<br>
    🏆 Victorie supremă!<br><br>
    🎁 <strong>${gift}</strong>
  `;

  overlay.classList.remove("hidden");
};

/*************************
 * CLOSE BIG BOX OVERLAY
 *************************/
closeOverlay.onclick = () => {
  overlay.classList.add("hidden");

  // reset global scor
  resetGlobalScore();

  updateGlobalUI();
};

/*************************
 * COUPLE SETTINGS
 *************************/
editBtn.onclick = () => {
  const names = getCoupleNames();

  nameHeInput.value = names.he === "EL" ? "" : names.he;
  nameSheInput.value = names.she === "EA" ? "" : names.she;

  namesOverlay.classList.remove("hidden");
};

saveBtn.onclick = () => {
  saveCoupleNames(
    nameHeInput.value.trim(),
    nameSheInput.value.trim()
  );

  namesOverlay.classList.add("hidden");

  updateGlobalUI();
};

/*************************
 * INIT
 *************************/
updateGlobalUI();
