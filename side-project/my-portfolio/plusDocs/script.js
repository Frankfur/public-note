function greet() {
  console.log("Hello, world!");
}
greet();

// 定义一个函数, 用于计算两个数的乘积
function multiply(a, b) {
  return a * b;
}

// arrow function:  箭头函数, 用于定义匿名函数
// 语法:  (参数1, 参数2, ...) => 函数体
const multiplyResult = (a, b) => a * b;

console.log(multiply(3, 4));
console.log(multiplyResult(5, 6));

// 定义一个函数, 用于计算一个数的平方, 语法:  参数 => 函数体. 参数两边无须用括号.
const squareNum = num => num * num;
console.log(squareNum(5));

// 没有参数时，必须保留括号
const sayHi = () => "Hi!";
console.log(sayHi()); // Hi!

//数组： Array 
  //创建数组
let fruits = ["Apple", "Banana", "Cherry"];
console.log(fruits);

  //访问数组
console.log(fruits[0]); // apple

  //数组长度
console.log(fruits.length); // 3

  //修改数组元素
fruits[0] = "Orange";
console.log(fruits); // ["orange", "banana", "Cherry"]

  //遍历数组元素
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

for (let fruit of fruits) {
  console.log("I like " + fruit);
}
//数组方法： push, map, filter, reduce, every, some, find, findIndex
  //push():  向数组末尾添加一个或多个元素, 并返回新的数组长度.
let numbers = [1, 2, 3, 4, 5];
numbers.push(8);
console.log(numbers); // [1, 2, 3, 4, 5, 8]
  //pop():  删除数组最后一个元素, 并返回该元素.
numbers.pop();
console.log(numbers); // [1, 2, 3, 4, 5]
  //map():  对数组中的每个元素执行一个函数, 并返回一个新的数组.
let doubleNum = numbers.map(num => num * 2);
console.log("doubleNum: " + doubleNum); // [2, 4, 6, 8, 10]
  //filter():  筛选对数组中的每个元素执行一个函数, 并返回一个新的数组.
let evenNum = numbers.filter(num => num % 2 === 0);
console.log("Even numbers: " + evenNum); // [2, 4]
  //reduce():  对数组中的每个元素执行一个函数, 并返回一个累计值.
let sum = numbers.reduce((acc, cur) => acc + cur, 0);
console.log("sum: " + sum); // 15

//用数组存储项目数据，每个项目数据包含项目名称、项目描述、项目图片、项目链接。
const projects = [
  {
    name: "Project 1",
    description: "This is a brief description of Project 1."
  },
  {
    name: "Project 2",
    description: "This is a brief description of Project 2."
  },
  {
    name: "Project 3",
    description: "This is a brief description of Project 3."
  }
];
  // means template literal,意思是模板字面值, 可以在模板字符串中嵌入变量. .join("")是将数组中的元素用空字符串连接起来
  // 用map方法遍历projects数组, 对每个项目数据执行一个函数, 并返回一个新的数组.
  //留意： => {...}返回多行字符串需要return 关键字来返回值，而隐式返回是 => ... 则直接返回表达式的结果； 
const projectCardsHTML = projects.map(project => {
  return `
    <article class="project-card">
      <h3>${project.name}</h3>
      <p>${project.description}</p>
    </article>`;
}).join(""); 

  //选定项目卡片-container元素, 并将项目卡片HTML内容添加到该元素中.
  const container = document.getElementById("project-container");
  container.innerHTML = projectCardsHTML;

  console.log("Projects rendered successfully!");

//footer年份不写死. 关注：  if (footerYear) 是defensive programming写法，确保footerYear元素存在时才执行.
      // 否则会报错, 因为footerYear元素不存在, 无法调用innerHTML属性.
// ====== 动态更新页脚年份 ======
const footerYear = document.querySelector("footer p");
if (footerYear) {
  const year = new Date().getFullYear();
  footerYear.innerHTML = `&copy; ${year} My Portfolio. All rights reserved.`;
};

