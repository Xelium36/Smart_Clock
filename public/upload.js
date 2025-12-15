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
  dropzone.querySelector("p").textContent =
    selectedFile ? `📁 ${selectedFile.name}` : "Glissez-déposez un fichier MP3 ici";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  uploadResult.textContent = "";

  const name = document.getElementById("name").value.trim();
  if (!name || !selectedFile) {
    uploadResult.textContent = "Nom et fichier requis.";
    return;
  }

  const fd = new FormData();
  fd.append("name", name);
  fd.append("file", selectedFile);

  try {
    const res = await fetch("/api/v1/musics", { method: "POST", body: fd });
    const data = await res.json();
    uploadResult.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    uploadResult.textContent = String(err);
  }
});
