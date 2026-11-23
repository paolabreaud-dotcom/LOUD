const playLink = document.querySelector(".play");
const playStatus = document.querySelector("#play-status");

playLink.addEventListener("click", () => {
  playStatus.textContent = "Opening the Spotify search for Chemical by Post Malone in a new tab.";
});
