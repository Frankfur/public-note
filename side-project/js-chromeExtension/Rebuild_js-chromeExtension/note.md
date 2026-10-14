# 2026-10-13｜JavaScript 基础功能与数据持久化

keyTakeaway:

1. js代码结构，顶部定义变量，底部调用函数。
2. 函数function loadSavedLeads()， 体现了这个函数体现了**"防御性编程"**思想——不信任任何外部数据，做好最坏的打算，保证程序永远稳定运行
3. 数据持久化，使用localStorage存储数据：过程是 读取数组 - 转化为字符串 - 存储到localStorage - 从localStorage读取字符串 - 转化为数组

**基础语法速查**:

1. JSON.stringify(): 将对象/数组转换为 JSON 字符串。
2. JSON.parse(): 将 JSON 字符串转换为对象。
3. localStorage.setItem(): 存储数据到本地存储。
4. localStorage.getItem(): 从本地存储读取数据。
5. localStorage.removeItem(): 删除本地存储中的数据。
6. Array.isArray(): 检查变量是否为数组。
7. typeof lead === "string": 检查变量是否为为字符串。

## 一、项目模块回顾

项目分为三个主要部分：

1. **HTML**：定义页面结构和元素，例如输入框、按钮、状态提示区和清单。
2. **CSS**：负责页面布局、样式和交互状态。
3. **JavaScript**：读取和处理输入、更新数据，并将数据渲染到页面。本节课重点练习了这一部分。

---

## 二、JavaScript：从静态渲染开始

### 1. 绑定页面元素

使用 `document.querySelector()` 根据 HTML 中的 `id` 找到对应元素，例如输入框、状态提示区和清单。

这些选择器依赖 HTML 中的 `id`。如果修改了 HTML 的 `id`，JavaScript 中对应的选择器也要一起更新。

### 2. 准备数据和渲染函数

使用数组 `savedLeads` 保存清单数据，并编写 `render(leads)`，根据传入的数组更新页面。

渲染过程：

1. 使用 `ulEl.replaceChildren()` 清空清单中的旧内容。
2. 如果数组为空，创建一个 `<li>`，显示空状态提示，然后用 `return` 结束函数。
3. 如果数组非空，遍历数组，为每条记录创建 `<li>` 和 `<span>`，再添加到 `<ul>` 中。

把用户或数组中的文本赋给 `text.textContent`，可以按纯文本显示，避免把输入内容当作 HTML 解析。

### 3. 初始化渲染

在脚本末尾调用：

```js
render(savedLeads);
```

````

这是一次**主动调用**：页面加载并运行脚本时，立即根据当前数组显示清单或空状态。

仅仅定义 `render()` 不会运行函数体。函数需要被调用，例如初始化时直接调用，或在用户操作触发的代码中调用。

---

## 三、点击按钮保存手动输入

### 1. 绑定按钮事件

使用 `addEventListener("click", saveInput)` 监听 Save Input 按钮点击。

这里是直接给按钮绑定事件，不是事件委托。注册监听器不会立即执行 `saveInput()`；用户点击按钮时，监听器才会调用它（即addEventListener比 onClick更佳。）。

HTML 和 JavaScript 不要同时为同一个按钮设置点击处理器，否则一次点击可能调用两次保存逻辑，造成重复添加。

### 2. 实现 `saveInput()` 的基本流程

点击 Save Input 后，执行以下步骤：

1. 读取 `inputEl.value`，并用 `.trim()` 去掉首尾空格。
2. 如果结果为空：
   - 用 `msgEl.textContent` 显示提示；
   - 使用 `return` 结束本次函数执行；
   - 不添加数组数据，也不重新渲染。
3. 如果输入有效：
   - 用 `savedLeads.push(newLead)` 把记录加入数组；
   - 显示成功提示；
   - 清空输入框；
   - 调用 `render(savedLeads)`，根据更新后的数组重绘清单。

`return` 只会结束当前函数，不会停止整个页面或 JavaScript 程序。

---

## 四、按 Enter 保存

给输入框添加 `keydown` 监听器，并检查事件对象中的 `event.key`：

```js
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveInput();
  }
});
```

执行过程：

1. 用户在输入框按下按键时，浏览器触发 `keydown`。
2. 监听函数收到浏览器传入的 `event` 事件对象。
3. `event.key` 表示按下的键。
4. 只有当 `event.key === "Enter"` 时，才调用 `saveInput()`。

这样点击按钮和按 Enter 会复用同一套保存逻辑，不需要复制两份代码。

---

## 五、阻止重复内容

在空值检查之后、`push()` 之前，使用：

```js
savedLeads.includes(newLead);
```

检查数组中是否已存在该内容。

如果已经存在：

1. 用 `msgEl.textContent` 显示重复提示；
2. 用 `return` 结束本次保存；
3. 不修改数组，也不执行后续的成功保存流程。

当前规则是：经过 `.trim()` 清理后，字符串完全相同才算重复。字符串比较区分大小写，因此 `"Hello"` 和 `"hello"` 当前会被视为不同内容。

---

## 六、使用 localStorage 持久化数据

### 1. 为什么需要转换数据格式

`localStorage` 只能存储字符串，而 `savedLeads` 是数组。因此：

- 保存时用 `JSON.stringify()` 把数组转换为 JSON 字符串；
- 读取时用 `JSON.parse()` 把 JSON 字符串还原为 JavaScript 数据。

当前使用的存储键名是：

```js
const STORAGE_KEY = "saveLeads";
```

保存和读取都要使用相同的键名。

### 2. 页面初始化时读取数据

`loadSavedLeads()` 的流程：

1. 使用 `localStorage.getItem(STORAGE_KEY)` 读取数据。
2. 如果结果是 `null`，表示还没有保存过数据，返回空数组。
3. 使用 `JSON.parse()` 解析读取到的字符串。
4. 检查解析结果是否为数组，并且数组中的每项都是字符串。
5. 如果数据格式有效，返回解析后的数组。
6. 如果数据格式无效，记录错误、向用户提示，并返回空数组。
7. 如果读取或解析过程中发生异常，在 `catch` 中记录错误、向用户提示，并返回空数组。

使用空数组作为失败时的返回值，可以避免错误数据直接导致清单渲染中断。

### 3. 用读取结果初始化数据

将数据数组初始化为：

```js
const savedLeads = loadSavedLeads();
```

然后在脚本末尾调用 `render(savedLeads)`。这样页面初始化时会尝试显示之前保存的内容，而不是每次都从空数组开始。

### 4. 保存数据与处理写入失败

`persistSavedLeads()` 使用：

```js
localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLeads));
```

把当前数组写入本地存储。

在 `saveInput()` 中，成功写入存储之后，才显示成功提示、清空输入框并更新清单。如果写入失败：

1. 记录错误并向用户显示保存失败提示；
2. `persistSavedLeads()` 返回 `false`；
3. `saveInput()` 用 `savedLeads.pop()` 撤销刚才加入数组的那一项；
4. 用 `return` 结束流程，不显示保存成功，也不清空输入框。

这样可以避免存储失败时，页面内存中的数组和本地持久化数据不一致。

---

## 七、本节练习形成的主要执行流程

### 页面初始化

```text
读取 localStorage
→ 校验数据
→ 得到 savedLeads 数组
→ 调用 render(savedLeads)
→ 显示清单或空状态
```

### 点击按钮或按 Enter 保存

```text
触发事件监听器
→ 调用 saveInput()
→ 读取并 trim 输入
→ 空值检查
→ 重复检查
→ 将新内容 push 到 savedLeads
→ 尝试保存到 localStorage
→ 保存失败则 pop 回滚并结束
→ 保存成功则显示提示、清空输入框、调用 render()
```

---

## 八、本节关键收获

1. **区分定义和调用**：定义函数不会自动运行；调用函数才会执行函数体。
2. **先校验，再修改数据**：空输入和重复内容都应在 `push()` 之前拦截。
3. **数据与视图分工**：数组保存数据，`render()` 负责把数组显示到页面。
4. **复用处理逻辑**：按钮点击和 Enter 键都调用 `saveInput()`。
5. **安全渲染文本**：使用 `textContent` 显示记录内容。
6. **处理持久化异常**：记录错误、提示用户，并在写入失败时撤销本次数组修改。
7. **保持 HTML 与 JavaScript 一致**：HTML 的 `id` 与 JavaScript 的选择器需要对应；同一按钮不要重复绑定点击处理器。

---

## 九、后续可以继续学习的内容

- 保存当前活动标签页的 URL（Save Tab）。
- 删除单条记录和清空全部记录。
- 让每条记录显示为可点击链接。
- 将练习版的 `localStorage` 改为 Chrome 扩展提供的 `chrome.storage`。

```

补充说明：我把原笔记中的“`console.error()` 系统提示”改成了“记录错误”。`console.error()` 是开发调试时写入浏览器控制台的错误信息；面向用户的页面提示则由 `msgEl.textContent` 显示。
```
整体代码的结构如下: 配置：STORAGE_KEY
DOM 元素引用：输入框、提示区、清单和按钮
应用数据：调用 loadSavedLeads() 初始化 savedLeads
存储函数：读取和写入 localStorage
渲染函数：render(leads)
操作函数：saveInput()
事件绑定与初始化渲染：点击、Enter 和首次调用 render()
````
