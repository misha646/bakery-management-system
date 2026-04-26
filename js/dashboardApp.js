import { renderAdmin } from "./views/dashboard/admin.js";
import { renderManager } from "./views/dashboard/manager.js";
import { renderBaker } from "./views/dashboard/baker.js";
import { renderStaff } from "./views/dashboard/staff.js";

function getRoleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("role");
}

window.addEventListener("load", () => {
  const role = getRoleFromUrl();
  const container = document.getElementById("app");

  switch (role) {
    case "admin":   renderAdmin(container); break;
    case "manager": renderManager(container); break;
    case "baker":   renderBaker(container); break;
    case "staff":   renderStaff(container); break;
    default:        container.innerHTML = "<h2>Invalid role</h2>";
  }
});