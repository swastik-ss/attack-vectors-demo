// Blocks direct/deep-linking into a simulated test page - visitors must start at index.html.
const ENTRY_KEY = "sekant-simulated-entry";

if (sessionStorage.getItem(ENTRY_KEY) !== "1") {
  window.location.replace("../index.html");
} else {
  // Single-use: force back through the index page for the next scenario too.
  sessionStorage.removeItem(ENTRY_KEY);
}
