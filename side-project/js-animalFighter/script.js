//动物大乱斗
let fighters = [
  "🐉",
  "🐥",
  "🐊",
  "💩",
  "🦍",
  "🐢",
  "🐩",
  "🦭",
  "🦀",
  "🐝",
  "🤖",
  "🐘",
  "🐸",
  "🕷",
  "🐆",
  "🦕",
  "🦁",
];

let stageEl = document.getElementById("stage");
let fightButton = document.getElementById("fightButton");

fightButton.addEventListener("click", function () {
  // Challenge:
  // When the user clicks on the "Pick Fighters" button, pick two random
  // emoji fighters and display them as i.e. "🦀 vs 🐢" in the "stage" <div>.

  const randIntA = Math.floor(Math.random() * fighters.length);
  const randIntB = Math.floor(Math.random() * fighters.length);

  const randFightersA = fighters[randIntA];
  const randFightersB = fighters[randIntB];
  //以下无须在 stageEl前面加let.因已经完成声明，此处为赋值，故无须做声明.
  stageEl.textContent = randFightersA + " VS " + randFightersB;
});
