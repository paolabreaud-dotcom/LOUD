const trackButtons = document.querySelectorAll(".track-button");
const statusMessage = document.querySelector(".status-message");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

trackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trackButtons.forEach((track) => track.setAttribute("aria-pressed", String(track === button)));
    statusMessage.textContent = `Selected ${button.querySelector(".track-title").textContent}`;
  });
});

document.querySelectorAll(".more-button").forEach((button) => {
  button.addEventListener("click", () => {
    const track = button.closest(".track");
    const title = track.querySelector(".track-title").textContent;
    const artist = track.querySelector(".track-artist").textContent;
    const query = encodeURIComponent(`${title} ${artist}`);
    window.location.href = `https://open.spotify.com/search/${query}`;
  });
});

document.querySelectorAll("[data-artist]").forEach((button) => {
  button.addEventListener("click", () => showToast(`#${button.dataset.rank} — ${button.dataset.artist}`));
});
