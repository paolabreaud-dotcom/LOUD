const filters = document.querySelector(".filters");
const buttons = [...filters.querySelectorAll("[data-filter]")];

filters.hidden = false;

for (const button of buttons) {
  button.addEventListener("click", () => {
    for (const option of buttons) {
      const isSelected = option === button;
      option.setAttribute("aria-pressed", String(isSelected));
      document.getElementById(option.dataset.filter).hidden = !isSelected;
    }
  });
}

const preview = document.querySelector("dialog");
const title = document.getElementById("preview-title");
const details = document.getElementById("preview-details");

for (const trigger of document.querySelectorAll("[data-preview]")) {
  trigger.addEventListener("click", () => {
    title.textContent = trigger.dataset.preview;
    details.textContent = trigger.dataset.details;
    preview.showModal();
  });
}
