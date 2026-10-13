const STORAGE_KEY = "myLeads";

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const tabBtn = document.getElementById("tab-btn");
const deleteBtn = document.getElementById("delete-btn");
const ulEl = document.getElementById("ul-el");
const msgEl = document.getElementById("msg");

let myLeads = loadLeads();
render(myLeads);

// ---------- storage ----------

// Reads the saved list. Falls back to [] if nothing is saved or the data is corrupted.
function loadLeads() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved)
      ? saved.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function saveLeads() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(myLeads));
}

// ---------- helpers ----------

let messageTimer;
function showMessage(text) {
  msgEl.textContent = text;
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => {
    msgEl.textContent = "";
  }, 2500);
  return false;
}

// Returns a safe http(s) URL string, or null if the text shouldn't be a link.
// "example.com" becomes https://example.com; "hello world" and "javascript:..." return null.
function toHttpUrl(text) {
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(text);
  const looksLikeDomain = !/\s/.test(text) && text.includes(".");
  const candidate = hasScheme ? text : looksLikeDomain ? "https://" + text : null;
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

// ---------- actions ----------

// Validates, de-duplicates, saves and re-renders. Returns true only if something was added.
function addLead(raw) {
  const text = raw.trim();
  if (!text) return showMessage("Nothing to save. Type or paste something first.");
  if (myLeads.includes(text)) return showMessage("Already saved.");
  myLeads.push(text);
  saveLeads();
  render(myLeads);
  return true;
}

function removeLead(index) {
  myLeads = myLeads.filter((_, i) => i !== index);
  saveLeads();
  render(myLeads);
}

// ---------- rendering ----------

// Builds DOM nodes with textContent, so user input is never parsed as HTML.
function render(leads) {
  ulEl.replaceChildren();

  if (leads.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No saved leads yet.";
    ulEl.append(li);
    return;
  }

  leads.forEach((lead, index) => {
    const li = document.createElement("li");

    const href = toHttpUrl(lead);
    let label;
    if (href) {
      label = document.createElement("a");
      label.href = href;
      label.target = "_blank";
      label.rel = "noopener noreferrer";
    } else {
      label = document.createElement("span");
    }
    label.textContent = lead;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "×";
    removeBtn.setAttribute("aria-label", "Delete " + lead);
    removeBtn.addEventListener("click", function () {
      removeLead(index);
    });

    li.append(label, removeBtn);
    ulEl.append(li);
  });
}

// ---------- events ----------

inputBtn.addEventListener("click", function () {
  if (addLead(inputEl.value)) inputEl.value = "";
});

inputEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") inputBtn.click();
});

// chrome.tabs only exists inside the extension, not on a normal web page.
if (typeof chrome === "undefined" || !chrome.tabs) {
  tabBtn.disabled = true;
  tabBtn.title = "SAVE TAB only works when loaded as a Chrome extension";
} else {
  tabBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs && tabs[0] && tabs[0].url;
      if (chrome.runtime.lastError || !url) {
        showMessage("Couldn't read this tab's address.");
        return;
      }
      addLead(url);
    });
  });
}

// Double-click guards against wiping the list by accident.
deleteBtn.addEventListener("dblclick", function () {
  localStorage.removeItem(STORAGE_KEY);
  myLeads = [];
  render(myLeads);
});
