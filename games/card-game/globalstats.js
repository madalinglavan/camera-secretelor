/*************************
 * GLOBAL STATS MANAGER
 *************************/

const GLOBAL_STORAGE_KEY = "globalStats";
const WIN_SCORE = 10;

/* STRUCTURA DEFAULT */
function getDefaultGlobalStats() {
  return {
    he: {
      score: 0,
      wins: {
        card: 0,
        wheel: 0,
        xo: 0
      }
    },
    she: {
      score: 0,
      wins: {
        card: 0,
        wheel: 0,
        xo: 0
      }
    },
    bigBoxUnlocked: false,
    bigBoxWinner: null
  };
}

/* GET */
function getGlobalStats() {
  const raw = localStorage.getItem(GLOBAL_STORAGE_KEY);
  if (!raw) {
    const fresh = getDefaultGlobalStats();
    saveGlobalStats(fresh);
    return fresh;
  }
  return JSON.parse(raw);
}

/* SAVE */
function saveGlobalStats(stats) {
  localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(stats));
}

/* ADD POINT */
function addGlobalPoint(player, game) {
  const stats = getGlobalStats();

  if (!stats[player]) return;

  stats[player].score++;
  stats[player].wins[game]++;

  if (stats[player].score >= WIN_SCORE) {
    stats.bigBoxUnlocked = true;
    stats.bigBoxWinner = player;
  }

  saveGlobalStats(stats);
}

/* RESET GLOBAL SCORE (după Big Box) */
function resetGlobalScore() {
  const stats = getGlobalStats();

  stats.he.score = 0;
  stats.she.score = 0;
  stats.bigBoxUnlocked = false;
  stats.bigBoxWinner = null;

  saveGlobalStats(stats);
}

/* BIG BOX GIFTS */
const BIG_GIFTS = [
  "🔥 Noapte fără reguli",
  "💆 Masaj erotic complet",
  "💃 Dans privat + strip tease",
  "😈 Control total timp de 24h",
  "💋 Provocare secretă aleasă de câștigător"
];

/* RANDOM BIG GIFT */
function getRandomBigGift() {
  return BIG_GIFTS[Math.floor(Math.random() * BIG_GIFTS.length)];
}
