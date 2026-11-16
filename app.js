/*
  PicLinker V1
  Storage: Cloudinary (free tier) — permanent image URLs.

  Setup (one time, free):
  1. https://cloudinary.com پر مفت اکاؤنٹ بنائیں۔
  2. Dashboard سے "Cloud name" کاپی کریں۔
  3. Settings > Upload > Upload presets میں جا کر ایک preset بنائیں،
     Signing Mode = "Unsigned"، اور اس کا نام کاپی کریں۔
  4. نیچے CLOUD_NAME اور UPLOAD_PRESET میں یہ دونوں قدریں لکھ دیں۔
*/
const CONFIG = {
  CLOUD_NAME: "YOUR_CLOUD_NAME",
  UPLOAD_PRESET: "YOUR_UNSIGNED_PRESET",
  MAX_BYTES: 3 * 1024 * 1024,
  ALLOWED: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"],
};

const HISTORY_KEY = "piclinker_history_v1";

const $ = (id) => document.getElementById(id);
const dropzone = $("dropzone");
const fileInput = $("fileInput");
const preview = $("preview");
const previewImg = $("previewImg");
const urlOutput = $("urlOutput");
const statusEl = $("status");
const downloadBtn = $("downloadBtn");
const openBtn = $("openBtn");

// ---------- Tabs ----------
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    $(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "history") renderHistory();
  });
});

// ---------- Upload handling ----------
$("chooseBtn").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

["dragenter", "dragover"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  })
);
["dragleave", "drop"].forEach((ev) =>
  dropzone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  })
);
dropzone.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

function setStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = "status " + type;
}

async function handleFile(file) {
  if (!file) return;

  if (!CONFIG.ALLOWED.includes(file.type)) {
    setStatus("یہ فائل فارمیٹ سپورٹ نہیں ہے۔", "error");
    return;
  }
  if (file.size > CONFIG.MAX_BYTES) {
    setStatus("فائل 3 MB سے بڑی ہے۔", "error");
    return;
  }

  // Local preview right away
  const localUrl = URL.createObjectURL(file);
  previewImg.src = localUrl;
  preview.classList.remove("hidden");
  urlOutput.value = "";
  setStatus("اپ لوڈ ہو رہا ہے…");

  if (CONFIG.CLOUD_NAME === "YOUR_CLOUD_NAME") {
    setStatus("پہلے app.js میں CLOUD_NAME اور UPLOAD_PRESET لکھیں۔", "error");
    return;
  }

  try {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CONFIG.UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CONFIG.CLOUD_NAME}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload failed");

    const url = data.secure_url;
    urlOutput.value = url;
    downloadBtn.href = url;
    downloadBtn.setAttribute("download", data.public_id.split("/").pop() + "." + data.format);
    openBtn.href = url;
    setStatus("لنک تیار ہے ✔", "ok");
    saveHistory({ url, thumb: url, name: file.name, date: new Date().toISOString() });
  } catch (err) {
    setStatus("خرابی: " + err.message, "error");
  }
}

// ---------- Copy ----------
$("copyBtn").addEventListener("click", async () => {
  if (!urlOutput.value) return;
  try {
    await navigator.clipboard.writeText(urlOutput.value);
  } catch {
    urlOutput.select();
    document.execCommand("copy");
  }
  setStatus("لنک کاپی ہو گیا۔", "ok");
});

// ---------- History (localStorage) ----------
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}
function saveHistory(item) {
  const list = loadHistory();
  list.unshift(item);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));
  } catch {
    /* storage unavailable — ignore */
  }
}
function renderHistory() {
  const list = loadHistory();
  const ul = $("historyList");
  ul.innerHTML = "";
  $("emptyHistory").classList.toggle("hidden", list.length > 0);

  list.forEach((item) => {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = item.thumb;
    img.alt = item.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = item.url;
    const small = document.createElement("small");
    small.textContent = new Date(item.date).toLocaleString();
    meta.append(a, small);

    const copy = document.createElement("button");
    copy.className = "btn";
    copy.textContent = "Copy";
    copy.addEventListener("click", () => navigator.clipboard?.writeText(item.url));

    li.append(img, meta, copy);
    ul.appendChild(li);
  });
}
