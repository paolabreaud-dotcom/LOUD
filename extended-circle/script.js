const toast = document.querySelector("#toast");
let dismissTimer;

for (const card of document.querySelectorAll("[data-artist]")) {
  card.addEventListener("click", () => {
    toast.textContent = `#${card.dataset.rank} — ${card.dataset.artist}`;
    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => { toast.textContent = ""; }, 2600);
  });
}
