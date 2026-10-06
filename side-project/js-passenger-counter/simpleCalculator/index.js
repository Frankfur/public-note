// 以下是最完整和工程优化后的代码 2026-10-04 21:34:31
function getNumbers() {
  const num1Str = document.getElementById("num1-input").value.trim();
  const num2Str = document.getElementById("num2-input").value.trim();
  const num1 = parseFloat(num1Str);
  const num2 = parseFloat(num2Str);
  if (Number.isNaN(num1) || Number.isNaN(num2)) {
    // 2 occasions of NaN: empty input or NaN value. Below 3 actions: output empty,alert, and return null.
    document.getElementById("result").textContent = "";
    alert("Please enter valid numbers.");
    return null;
  }
  return [num1, num2];
}

function add() {
  const inputs = getNumbers();
  if (!inputs) return;
  document.getElementById("result").textContent =
    "Result: " + (inputs[0] + inputs[1]);
}

function subtract() {
  const inputs = getNumbers();
  if (!inputs) return;
  document.getElementById("result").textContent =
    "Result: " + (inputs[0] - inputs[1]);
}

function multiply() {
  const inputs = getNumbers();
  if (!inputs) return;
  document.getElementById("result").textContent =
    "Result: " + inputs[0] * inputs[1];
}

function divide() {
  const inputs = getNumbers();
  if (!inputs) return;

  if (inputs[1] === 0) {
    document.getElementById("result").textContent = "Error: Division by zero.";
    alert("Error: Division by zero.");
    return;
  }
  document.getElementById("result").textContent =
    "Result: " + inputs[0] / inputs[1];
}

function clearInput() {
  document.getElementById("num1-input").value = "";
  document.getElementById("num2-input").value = "";
  document.getElementById("result").textContent = "Result: ";
}

// function add() {
//   let num1 = document.getElementById("num1-input").value.trim();
//   let num2 = document.getElementById("num2-input").value.trim();
//   let result = parseInt(num1) + parseInt(num2);
//   document.getElementById("result").textContent = "result: " + result;
// }

// function subtract() {
//   let num1 = document.getElementById("num1-input").value.trim();
//   let num2 = document.getElementById("num2-input").value.trim();
//   let result = parseFloat(num1) - parseFloat(num2);
//   document.getElementById("result").textContent = "Result: " + result;
// }

// function multiply() {
//   let num1 = document.getElementById("num1-input").value.trim();
//   let num2 = document.getElementById("num2-input").value.trim();
//   let result = parseFloat(num1) * parseFloat(num2);
//   document.getElementById("result").textContent = "Result: " + result;
// }

// function divide() {
//   let num1 = document.getElementById("num1-input").value.trim();
//   let num2 = document.getElementById("num2-input").value.trim();
//   if (num2 === "0") {
//     document.getElementById("result").textContent = "Error: Division by zero";
//   } else {
//     let result = parseFloat(num1) / parseFloat(num2);
//     document.getElementById("result").textContent = "Result: " + result;
//   }
// }
// function clearInput() {
//   document.getElementById("num1-input").value = "";
//   document.getElementById("num2-input").value = "";
//   document.getElementById("result").textContent = "Result: ";
// }
