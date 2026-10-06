// 2026-10-04   ----->Scrimba JS - Passenger Counter。

const countEl = document.getElementById("count-el");
// 使用const，因为引用不变，而非值不变！！！
const entryLogEl = document.getElementById("entry-log");
// 缓存，而非每次执行时重新计算；

let count = 0;

// 计数器：增加乘客数量
function increment() {
  count += 1;
  countEl.textContent = count;
}

// 计数器：保存乘客数量
function save() {
  if (count !== 0) {
    // 添加一个判断条件，即空值时不显示；
    entryLogEl.textContent += count + " - ";
  }
  count = 0; // 清空乘客数量
  countEl.textContent = count; // 清空乘客数量显示
}

function clearEntries() {
  entryLogEl.textContent = "";
  count = 0;
  countEl.textContent = count;
}

//DOM 查询很贵，缓存起来不浪费
//const 默认 let 备用，var 永远说再见
//相等比较用三等，类型安全不踩坑
