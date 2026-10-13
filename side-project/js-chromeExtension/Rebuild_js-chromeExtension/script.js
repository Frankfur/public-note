//首轮只做静态的渲染，随后再接入数据。这是基本的思路！ 页面元素绑定、数据数组和安全渲染. 首先，测试数组渲染是否ok？带数据与空数据都测试；
// ============页面元素绑定、数据数组和安全渲染.========
const inputEl = document.querySelector("#input-el"); //对应input元素，下同；
const msgEl = document.querySelector("#msg-el");
const ulEl = document.querySelector("#ul-el");
const savedLeads = loadSavedLeads();
//===========数据持久化，使用localStorage存储数据========
const STORAGE_KEY = "saveLeads";
function loadSavedLeads() {
  try {
    const storedLeads = localStorage.getItem(STORAGE_KEY);
    if (storedLeads === null) {
      return [];
    }
    const parsedLeads = JSON.parse(storedLeads);
    if (
      Array.isArray(parsedLeads) &&
      parsedLeads.every((lead) => typeof lead === "string")
    ) {
      return parsedLeads;
    }
    console.error("Invalid leads format: ", parsedLeads);
    msgEl.textContent = "Invalid leads format. ";
    return []; //这一步是用来承接异常输入的，避免程序崩溃。
  } catch (error) {
    console.error("Error loading leads:", error);
    msgEl.textContent = "Error loading leads.";
    return [];
  }
}

// ============点击按钮保存手动输入.========
const inputBtn = document.querySelector("#input-btn");
inputBtn.addEventListener("click", saveInput);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveInput();
  }
});
// ============渲染数组.========
function render(leads) {
  ulEl.replaceChildren(); //清空列表.相比.textContent=""更安全也更合语义，因为会清空所有子元素，包括文本节点。
  if (leads.length === 0) {
    // 如果没有保存的记录，显示提示信息
    const emptyItem = document.createElement("li"); //贴遥控标签（外壳）
    emptyItem.className = "empty"; //给壳添加class
    emptyItem.textContent = "No leads saved yet."; //给壳填内容
    ulEl.append(emptyItem); //把壳放到ul元素的列表里
    return; //返回,不执行后续操作
  }
  for (const lead of leads) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    //加入 <span> 就像给文字穿了一件“独立外套”
    //现在：让文字和列表容器的样式解耦。
    //未来：方便在文字旁边添加按钮、图标或其他交互元素。这是一个“为了以后不重构”的前瞻性写法。

    text.textContent = lead;
    item.append(text); //把span元素挂到列表项里；
    ulEl.append(item); //把列表项挂到ul元素里（列表容器）；
  }
}
// ============点击按钮保存手动输入========
function saveInput() {
  const newLead = inputEl.value.trim();
  if (newLead === "") {
    msgEl.textContent = "Please enter a lead.";
    return;
  }
  // 去重：如果数组中已存在相同内容，不重复添加。
  if (savedLeads.includes(newLead)) {
    msgEl.textContent = "This lead already exists.";
    return;
  }
  savedLeads.push(newLead);
  // 保存到localStorage
  if (!persistSavedLeads()) {
    savedLeads.pop();
    return;
  }
  msgEl.textContent = "You saved: " + newLead;
  inputEl.value = "";
  render(savedLeads); // 调用 render 函数进行渲染
}
render(savedLeads); // 初始化调用，需要单列，作为加载或空数组的渲染。
// ============数据持久化，使用localStorage存储数据========
function persistSavedLeads() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLeads));
    return true;
  } catch (error) {
    console.error("Error saving leads:", error);
    msgEl.textContent = "Error saving leads.";
    return false;
  }
}
