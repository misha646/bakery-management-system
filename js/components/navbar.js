// js/components/navbar.js
import { state, commit } from "../state.js";
import { renderLogin } from "../auth.js";

export function navbar(role, username) {
  return `
    <nav class="navbar">
      <div class="logo">CRIS</div>
      <div class="role">${role} Dashboard</div>
      <div class="user">👤 ${username}</div>
      <button class="logout-btn" id="logoutBtn">Logout</button>
    </nav>
  `;
}

export function bindNavbar() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // 1️⃣ Clear session
    state.user = null;
    commit();

    // 2️⃣ Render login page (index.html view)
    renderLogin();
  });
}
