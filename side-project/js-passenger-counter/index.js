// 2026-10-04   ----->Scrimba JS - Passenger Counter
let countEl = document.getElementById("count-el");
let count = 0;

// 计算器：增加乘客数量
function increment() {
  count += 1;
  countEl.textContent = count;
}

// 计算器：保存乘客数量
function save() {
  countEl.textContent = 0;
  if (count != 0) {
    // 添加一个判断条件，即空值时不显示；
    let count_update = count + " - "; // 保存乘客数量到entry-log
    document.getElementById("entry-log").textContent += count_update;
  }
  count = 0;
}
