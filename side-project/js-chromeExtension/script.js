//首轮只做静态的渲染，随后再接入数据。这是基本的思路！ 页面元素绑定、数据数组和安全渲染. 首先，测试数组渲染是否ok？带数据与空数据都测试；
// ============DOM元素========
const STORAGE_KEY = "saveLeads";
const inputEl = document.querySelector("#input-el");
const msgEl = document.querySelector("#msg-el");
const ulEl = document.querySelector("#ul-el");
const inputBtn = document.querySelector("#input-btn");
const tabBtn = document.querySelector("#tab-btn");
const deleteBtn = document.querySelector("#delete-btn");

//===========核心功能函数定义： 1. 页面初始化（loadSavedLeads）
// ============从localStorage读取数据并转化为数组，供后面render()使用.========
function loadSavedLeads() {
  try {
    //从localStorage读取数据，Key: STORAGE_KEY
    const storedLeads = localStorage.getItem(STORAGE_KEY);
    //如果localStorage中没有数据，返回空数组
    if (storedLeads === null) {
      return [];
    }

    const parsedLeads = JSON.parse(storedLeads);
    if (
      //如果读取到的数据是数组，且数组中的每个元素都是字符串，才返回数组
      Array.isArray(parsedLeads) &&
      parsedLeads.every((lead) => typeof lead === "string")
    ) {
      return parsedLeads;
    }
    //如果读取到的数据不是数组，或者数组中的元素不是字符串，返回空数组
    console.error("Invalid leads format: ", parsedLeads);
    msgEl.textContent = "Invalid leads format.";
    return []; //这一步是用来承接异常输入，避免程序崩溃。
  } catch (error) {
    console.error("Error loading leads:", error);
    msgEl.textContent = "Error loading leads.";
    return [];
  }
}

function toHttpUrl(text) {
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(text);
  const looksLikeDomain = !/\s/.test(text) && text.includes(".");
  const candidate = hasScheme ? text : looksLikeDomain ? "https://" + text : null;

  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

// ============渲染数组.========
function render(leads) {
  ulEl.replaceChildren(); //清空列表.相比.textContent=""更安全也更合语义，因为会清空所有子元素，包括文本节点。

  if (leads.length === 0) {
    // 如果没有保存的记录，显示提示信息
    const emptyItem = document.createElement("li"); //贴遥控标签（外壳）
    emptyItem.className = "empty"; //给壳添加class
    emptyItem.textContent = "No leads saved yet."; //给壳填内容
    ulEl.append(emptyItem); //把壳放到ul元素的列表里，并显示出来；
    return; //返回,不执行后续操作
  }

  for (const [index, lead] of leads.entries()) {
    const item = document.createElement("li");

    const href = toHttpUrl(lead);
    const label = document.createElement(href ? "a" : "span");
    if (href) {
      label.href = href;
      label.target = "_blank";
      label.rel = "noopener noreferrer";
    }
    label.textContent = lead;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Delete";
    removeBtn.setAttribute("aria-label", "Delete " + lead);
    removeBtn.addEventListener("click", () => {
      removeLead(index);
    });

    item.append(label, removeBtn);
    ulEl.append(item);
  }
}

function persistSavedLeads() {
  try {
    //持久化保存数据，Key: STORAGE_KEY;输出的结果（true/false会在后面的函数inputBtn.addEventListener中使用）
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLeads)); //将数组转换为字符串，再存储到localStorage，key为STORAGE_KEY
    return true;
  } catch (error) {
    console.error("Error saving leads:", error);
    msgEl.textContent = "Error saving leads.";
    return false;
  }
}

// ============点击按钮保存手动输入========

function addLead(raw) {
  const newLead = raw.trim();

  if (newLead === "") {
    msgEl.textContent = "Please enter a lead.";
    return false;
  }

  if (savedLeads.includes(newLead)) {
    msgEl.textContent = "This lead already exists.";
    return false;
  }

  savedLeads.push(newLead);
  if (!persistSavedLeads()) {
    savedLeads.pop();
    return false;
  }

  msgEl.textContent = "You saved: " + newLead;
  render(savedLeads);
  return true;
}

function saveInput() {
  if (addLead(inputEl.value)) {
    inputEl.value = "";
  }
}

function removeLead(index) {
  if (!Number.isInteger(index) || index < 0 || index >= savedLeads.length) {
    return false;
  }

  const [removedLead] = savedLeads.splice(index, 1);

  if (!persistSavedLeads()) {
    savedLeads.splice(index, 0, removedLead);
    return false;
  }

  render(savedLeads);
  msgEl.textContent = "Lead deleted.";
  return true;
}

function deleteAllLeads() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error deleting leads:", error);
    msgEl.textContent = "Error deleting leads.";
    return;
  }

  savedLeads.length = 0;
  render(savedLeads);
  msgEl.textContent = "All leads deleted.";
}

// ============加载数据 & 初始化调用（需要单列）作为加载或空数组的渲染。========
const savedLeads = loadSavedLeads();
render(savedLeads);

inputBtn.addEventListener("click", saveInput);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveInput();
  }
});

tabBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs && tabs[0] && tabs[0].url;
    if (chrome.runtime.lastError || !url) {
      console.error("Error reading active tab:", chrome.runtime.lastError);
      msgEl.textContent = "Couldn't read this tab's address.";
      return;
    }

    addLead(url);
  });
});

deleteBtn.addEventListener("click", deleteAllLeads);
