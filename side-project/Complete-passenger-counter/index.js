const countEl = document.getElementById("count-el");
const totalEl = document.getElementById("total-el");
const entryLogEl = document.getElementById("entry-log");
const incrementButtonEl = document.getElementById("increment-btn");
const decrementButtonEl = document.getElementById("decrement-btn");
const saveButtonEl = document.getElementById("save-btn");
const clearButtonEl = document.getElementById("clear-btn");
const exportButtonEl = document.getElementById("export-btn");
const statusMessageEl = document.getElementById("status-message");
const soundToggleBtn = document.getElementById("sound-toggle-btn");
const vibeToggleBtn = document.getElementById("vibe-toggle-btn");
const storageKey = "passenger-counter-state-v1";

let state = {
  count: 0,
  entries: [],
};

function setStatusMessage(message) {
  statusMessageEl.textContent = message;
}

/* ---------- 用户偏好（声音 / 振动开关，独立 localStorage key） ---------- */
const PrefsKey = "passenger-counter-prefs-v1";
const prefs = { sound: true, vibe: true };

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PrefsKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.sound === "boolean") prefs.sound = parsed.sound;
    if (parsed && typeof parsed.vibe === "boolean") prefs.vibe = parsed.vibe;
  } catch {
    /* ignore */
  }
}

function persistPrefs() {
  try {
    localStorage.setItem(PrefsKey, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

function syncToggleButtons() {
  if (soundToggleBtn)
    soundToggleBtn.setAttribute("aria-pressed", String(prefs.sound));
  if (vibeToggleBtn)
    vibeToggleBtn.setAttribute("aria-pressed", String(prefs.vibe));
}

function bindToggles() {
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      prefs.sound = !prefs.sound;
      persistPrefs();
      syncToggleButtons();
      if (prefs.sound) beep({ freq: 880, duration: 0.08 });
    });
  }
  if (vibeToggleBtn) {
    vibeToggleBtn.addEventListener("click", () => {
      prefs.vibe = !prefs.vibe;
      persistPrefs();
      syncToggleButtons();
      vibrate(30);
    });
  }
}

function bindActions() {
  incrementButtonEl.addEventListener("click", increment);
  decrementButtonEl.addEventListener("click", decrement);
  saveButtonEl.addEventListener("click", save);
  clearButtonEl.addEventListener("click", clearEntries);
  exportButtonEl.addEventListener("click", exportCsv);
}

/* ---------- 声音：Web Audio 单文件 beep（无外部音频资源） ---------- */
const AudioCtxImpl = window.AudioContext || window.webkitAudioContext;
const audioCtx = AudioCtxImpl ? new AudioCtxImpl() : null;

function unlockAudio() {
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
}
window.addEventListener("pointerdown", unlockAudio, { passive: true });
window.addEventListener("keydown", unlockAudio);

function beep({
  freq = 660,
  duration = 0.08,
  type = "sine",
  gain = 0.15,
} = {}) {
  if (!prefs.sound) return;
  if (!audioCtx || audioCtx.state !== "running") return;
  try {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const now = audioCtx.currentTime;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  } catch {
    /* ignore */
  }
}

function playSequence(notes) {
  if (!prefs.sound) return;
  notes.forEach((note, i) =>
    setTimeout(() => beep(note), i * (note.duration * 1000 + 25)),
  );
}

/* ---------- 振动：仅移动端生效，桌面调用不报错 ---------- */
function vibrate(pattern) {
  if (!prefs.vibe) return;
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

/* ---------- 各操作的声音/振动反馈定义 ---------- */
const fb = {
  inc: () => {
    beep({ freq: 880, duration: 0.08 });
    vibrate(20);
  },
  dec: () => {
    beep({ freq: 440, duration: 0.08 });
    vibrate(20);
  },
  saveOk: () => {
    playSequence([
      { freq: 660, duration: 0.08 },
      { freq: 880, duration: 0.1 },
    ]);
    vibrate([40, 60, 40]);
  },
  saveNo: () => {
    beep({ freq: 220, duration: 0.12 });
  },
  clear: () => {
    playSequence([
      { freq: 880, duration: 0.07 },
      { freq: 660, duration: 0.07 },
      { freq: 440, duration: 0.09 },
    ]);
    vibrate([80, 80, 80, 80]);
  },
  export: () => {
    playSequence([
      { freq: 660, duration: 0.08 },
      { freq: 880, duration: 0.1 },
    ]);
  },
};

function isValidState(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    Number.isInteger(value.count) &&
    value.count >= 0 &&
    Array.isArray(value.entries) &&
    value.entries.every(
      (entry) =>
        entry !== null &&
        typeof entry === "object" &&
        Number.isInteger(entry.count) &&
        entry.count > 0 &&
        typeof entry.savedAt === "string" &&
        !Number.isNaN(Date.parse(entry.savedAt)),
    )
  );
}

function loadState() {
  try {
    const savedState = localStorage.getItem(storageKey);
    if (savedState === null) {
      return true;
    }

    const parsedState = JSON.parse(savedState);
    if (!isValidState(parsedState)) {
      throw new Error("Saved data has an invalid format.");
    }

    state = {
      count: parsedState.count,
      entries: parsedState.entries,
    };
    return true;
  } catch {
    setStatusMessage(
      "Could not load saved data. The current view starts at zero; stored data was not changed.",
    );
    return false;
  }
}

function persistState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/* 统一 persist 结果提示：成功->业务成功消息/清空；失败->在业务消息后追加警示，不覆盖业务消息 */
function notePersistResult(fallbackSuccessMsg) {
  if (persistState()) {
    setStatusMessage(fallbackSuccessMsg ?? "");
  } else {
    window.__persistFailedShown = true;
    setStatusMessage(
      (fallbackSuccessMsg || "操作成功") + " ⚠ 未成功写入本地存储",
    );
  }
}

function render() {
  countEl.textContent = state.count;
  const savedTotal = state.entries.reduce(
    (total, entry) => total + entry.count,
    0,
  );
  totalEl.textContent = savedTotal + state.count;
  decrementButtonEl.disabled = state.count === 0;
  entryLogEl.replaceChildren();

  state.entries.forEach((entry) => {
    const itemEl = document.createElement("li");
    const savedAt = new Date(entry.savedAt).toLocaleString();
    itemEl.textContent = `${entry.count} - ${savedAt}`;
    entryLogEl.appendChild(itemEl);
  });
}

function increment() {
  state.count += 1;
  render();
  fb.inc();
  notePersistResult("");
}

function decrement() {
  if (state.count === 0) {
    return;
  }

  state.count -= 1;
  render();
  fb.dec();
  notePersistResult("");
}

function save() {
  if (state.count === 0) {
    fb.saveNo();
    setStatusMessage("There is no count to save.");
    return;
  }

  state.entries.push({
    count: state.count,
    savedAt: new Date().toISOString(),
  });
  state.count = 0;
  render();
  fb.saveOk();
  notePersistResult("Batch saved.");
}

function exportCsv() {
  const rows = [
    ["Batch", "Passenger count", "Saved at"],
    ...state.entries.map((entry, index) => [
      `Batch ${index + 1}`,
      entry.count,
      entry.savedAt,
    ]),
  ];
  if (state.count > 0) {
    rows.push(["Current (unsaved)", state.count, ""]);
  }
  const csvContent = `\uFEFF${rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const linkEl = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  linkEl.href = downloadUrl;
  linkEl.download = `passenger-count-${date}.csv`;
  linkEl.click();
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  fb.export();
  setStatusMessage("CSV exported.");
}

function clearEntries() {
  const confirmed = window.confirm(
    "Clear the current count and all saved entries? This cannot be undone.",
  );
  if (!confirmed) {
    return;
  }

  state = {
    count: 0,
    entries: [],
  };
  render();
  fb.clear();
  notePersistResult("All entries were cleared.");
}

loadPrefs();
const loadStateOk = loadState();
render();
syncToggleButtons();
bindToggles();
bindActions();
const shouldInitPersist = loadStateOk;
if (shouldInitPersist && !persistState()) {
  setStatusMessage(
    "Local storage is not available in this browser; unsaved data may be lost after refresh.",
  );
}
