// set up player info:
let player = {
  name: "Sheng",
  chips: 1000,
};

let playerEl = document.getElementById("player-el");
playerEl.textContent = player.name + ": $" + player.chips;

// 2 cards: array + sum
let cards = [];
let sum = 0;

// set up Non-BlackJack condition
let hasBlackJack = false;
// set up alive condition
let isAlive = false;

// set up stage for the top reminder:
let message = "";
let messageEl = document.getElementById("message-el");

// set up stages for cards + sum info
let sumEl = document.getElementById("sum-el");
let cardsEl = document.getElementById("cards-el");

// Func00: get a random card,return a number between 1 and 13
// 规则1：1点为11点，11-3点为10点，其它点数为面值；
function getRandomCard() {
  let randomNumber = Math.floor(Math.random() * 13) + 1;
  if (randomNumber > 10) {
    return 10;
  } else if (randomNumber === 1) {
    return 11;
  } else {
    return randomNumber;
  }
}

// func01: overall game-start stage
function startGame() {
  //set up initial status
  isAlive = true;
  hasBlackJack = false;
  sum = 0;
  cards = [];
  // 2 initial cards enclosed in the startGame function:
  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  cards = [firstCard, secondCard];
  sum = firstCard + secondCard;
  renderGame();
}

// func02: overall game render;
function renderGame() {
  // cards info:
  // initial cards info:
  cardsEl.textContent = "Cards: ";
  // updated cards info
  for (let i = 0; i < cards.length; i++) {
    cardsEl.textContent += cards[i] + " ";
  }

  // Sum + msg info:
  sumEl.textContent = "Sum: " + sum;
  // 条件1： 点数小于20，则询问： 是否要牌？
  if (sum < 21) {
    message = "Do you want to draw a new card?";
    // 条件2： 点数等于21，则询问：通吃！
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    hasBlackJack = true;
    // 条件3： 点数大过21点，出局！！
  } else {
    message = "You're out of the game!";
    isAlive = false;
  }
  // 根据以上3个条件，渲染html页面；
  messageEl.textContent = message;
}

// func03: add a new card:
// 1. 将新卡加入到卡单中
// 2. 默认start game,报出游戏结果
function newCard() {
  if (isAlive === true && hasBlackJack === false) {
    let card = getRandomCard();
    sum += card;
    cards.push(card);
    console.log(cards);
    renderGame();
  } else {
    alert("Game Over!");
  }
}
