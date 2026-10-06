let homeScore = 0;
let guestScore = 0;
let homeScoreDisplay = document.getElementById("home-score");
let guestScoreDisplay = document.getElementById("guest-score");

function homeAddScoreOne() {
  homeScore += 1;
  homeScoreDisplay.textContent = homeScore;
}
function homeAddScoreTwo() {
  homeScore += 2;
  homeScoreDisplay.textContent = homeScore;
}
function homeAddScoreThree() {
  homeScore += 3;
  homeScoreDisplay.textContent = homeScore;
}
// 客场得分
function guestAddScoreOne() {
  guestScore += 1;
  guestScoreDisplay.textContent = guestScore;
}
function guestAddScoreTwo() {
  guestScore += 2;
  guestScoreDisplay.textContent = guestScore;
}
function guestAddScoreThree() {
  guestScore += 3;
  guestScoreDisplay.textContent = guestScore;
}
