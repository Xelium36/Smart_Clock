const form = document.getElementById("musicForm");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const result = document.getElementById("result");

let selectedFile = null;

// Click → open file picker
dropzone.addEventListener("click", () => fileInput.click());

// File selected via input
fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  updateDropzone();
});

// Drag & drop
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

  const file = e.dataTransfer.files[0];
  if (file) {
    selectedFile = file;
    updateDropzone();
  }
});

function updateDropzone() {
  dropzone.querySelector("p").textContent =
    selectedFile ? `📁 ${selectedFile.name}` : "Glissez un fichier MP3 ici";
}

// Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();

  if (!name || !selectedFile) {
    alert("Nom et fichier requis");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", selectedFile);

  try {
    const res = await fetch("/api/v1/musics", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    result.textContent = err.toString();
  }
});