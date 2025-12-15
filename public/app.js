// ---------- Nav (2 pages: upload/list)
const tabs = document.querySelectorAll(".tab");
const viewUpload = document.getElementById("view-upload");
const viewList = document.getElementById("view-list");

function setView(name) {
  tabs.forEach(t => t.classList.toggle("active", t.dataset.view === name));
  viewUpload.classList.toggle("hidden", name !== "upload");
  viewList.classList.toggle("hidden", name !== "list");

  if (name === "list") loadMusics();
}

tabs.forEach(t => t.addEventListener("click", () => setView(t.dataset.view)));


// ---------- Upload (POST)
const form = document.getElementById("musicForm");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const uploadResult = document.getElementById("uploadResult");

let selectedFile = null;

dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0] || null;
  updateDropzone();
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  selectedFile = e.dataTransfer.files[0] || null;
  updateDropzone();
});

function updateDropzone() {
  const p = dropzone.querySelector("p");
  p.textContent = selectedFile ? `📁 ${selectedFile.name}` : "Glissez-déposez un fichier MP3 ici";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  uploadResult.textContent = "";

  const name = document.getElementById("name").value.trim();
  if (!name || !selectedFile) {
    uploadResult.textContent = "Nom et fichier requis.";
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", selectedFile);

  try {
    const res = await fetch("/api/v1/musics", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      uploadResult.textContent = JSON.stringify(data, null, 2);
      return;
    }

    uploadResult.textContent = JSON.stringify(data, null, 2);

    // option: reset
    form.reset();
    selectedFile = null;
    updateDropzone();
  } catch (err) {
    uploadResult.textContent = String(err);
  }
});


// ---------- List (GET)
const refreshBtn = document.getElementById("refreshBtn");
const listStatus = document.getElementById("listStatus");
const musicList = document.getElementById("musicList");

refreshBtn.addEventListener("click", loadMusics);

async function loadMusics() {
  listStatus.textContent = "Chargement...";
  musicList.innerHTML = "";

  try {
    const res = await fetch("/api/v1/musics");
    const musics = await res.json();

    if (!res.ok) {
      listStatus.textContent = "Erreur GET musics";
      return;
    }

    listStatus.textContent = `${musics.length} musique(s)`;
    musics.forEach(m => musicList.appendChild(renderMusicCard(m)));
  } catch (err) {
    listStatus.textContent = `Erreur: ${String(err)}`;
  }
}

function renderMusicCard(m) {
  const li = document.createElement("li");
  li.className = "card";

  const name = document.createElement("div");
  name.innerHTML = `<strong>${escapeHtml(m.name ?? "(sans nom)")}</strong>`;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `id: ${m._id} | url: ${m.fileUrl ?? "-"}`;

  const audio = document.createElement("audio");
  audio.controls = true;
  if (m.fileUrl) audio.src = m.fileUrl;

  li.append(name, meta, audio);
  return li;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
