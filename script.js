const trackButtons = document.querySelectorAll(".track-button");
const navLinks = document.querySelectorAll(".nav-link");
const statusMessage = document.querySelector(".status-message");

trackButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trackButtons.forEach((track) => track.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    const title = button.querySelector(".track-title").textContent;
    statusMessage.textContent = `Now playing ${title}`;
  });
});

navLinks.forEach((button) => {
  button.addEventListener("click", () => {
    navLinks.forEach((link) => {
      link.classList.remove("is-active");
      link.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    statusMessage.textContent = `${button.textContent} selected`;
  });
});
