//prettier-ignore
const characters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9","~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?",
"/"];

const capitalLetters = characters.slice(0, 26);
const smallLetters = characters.slice(26, 52);
const numbers = characters.slice(52, 62);
const symbols = characters.slice(62, characters.length);
// 生成随机密码长度， 范围是8到21个字符。尽可能减少不必要的变量声明；
// 但是有一个问题，即随机选取字符的话，可能导致密码中不能涵盖4类字符：数字，大，小写字母和特殊字符。如何解决这个问题呢？一个方案：先随机取4类字符，但用正常的方式提取即可。
const passwordOne = document.getElementById("password-1");
const passwordTwo = document.getElementById("password-2");
function generatePassword() {
  generatePW(passwordOne);
  // 第二组密码生成
  generatePW(passwordTwo);
}

function fourTypesCharacters() {
  //首先从前面4类字符中，各随机取一个字符，以确保密码中包含完整的4类字符
  let password = "";
  password +=
    capitalLetters[Math.floor(Math.random() * capitalLetters.length)] +
    smallLetters[Math.floor(Math.random() * smallLetters.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    symbols[Math.floor(Math.random() * symbols.length)];

  return password;
}

function generatePW(pw) {
  // 第一组密码生成
  const fourCharactersOne = fourTypesCharacters();
  let randomPwLength = Math.floor(Math.random() * 14) + 4;
  let password = "";
  for (let i = 0; i < randomPwLength; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }
  let newPassword = fourCharactersOne + password;
  let finalPassword = shuffleString(newPassword);

  pw.value = finalPassword;
}

// Fisher–Yates 洗牌算法
// Fisher–Yates 洗牌算法是一种洗牌算法，用于随机打乱数组中的元素。
// 它通过遍历数组，从数组的末尾开始，随机选择一个元素，并将其与当前元素交换。这个过程会不断重复，直到整个数组被打乱。
function shuffleString(str) {
  let arr = str.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}
