const updateForm = document.getElementById("updateForm");
const updateResult = document.getElementById("updateResult");

updateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  updateResult.textContent = "";

  const id = document.getElementById("updateId").value.trim();
  const name = document.getElementById("updateName").value.trim();

  if (!id) {
    updateResult.textContent = "ID requis.";
    return;
  }
  if (!name) {
    updateResult.textContent = "Nouveau nom requis.";
    return;
  }

  try {
    const res = await fetch(`/api/v1/musics/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    updateResult.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    updateResult.textContent = String(err);
  }
});
