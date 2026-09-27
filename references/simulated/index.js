// Grants one-time entry into a simulated test page (guard.js consumes this flag).
const ENTRY_KEY = "sekant-simulated-entry";

document.querySelectorAll("button[data-target]").forEach((button) => {
  button.addEventListener("click", () => {
    sessionStorage.setItem(ENTRY_KEY, "1");
    window.location.href = button.dataset.target;
  });
});
