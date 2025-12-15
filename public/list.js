const refreshBtn = document.getElementById("refreshBtn");
const listStatus = document.getElementById("listStatus");
const musicList = document.getElementById("musicList");

refreshBtn.addEventListener("click", loadMusics);
loadMusics();

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
    musics.forEach((m) => musicList.appendChild(renderMusicCard(m)));
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
