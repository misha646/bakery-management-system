// js/components/sidebar.js
import { state, clearState } from "../state.js"; 
import { renderLogin } from "../auth.js";
import { navigate, ROLE_ROUTES } from "../router.js";

/**
 * Globally accessible navigation handler
 * Syncs the router with the sidebar's visual active state
 */
window.handleNav = (page) => {
  // Update UI active state
  const items = document.querySelectorAll(".sidebar li");
  items.forEach(li => li.classList.remove("active"));
  
  const activeItem = document.getElementById(`nav-${page}`);
  if (activeItem) activeItem.classList.add("active");

  // Trigger the actual router navigation
  navigate(page);
};

/**
 * Renders the Fixed Sidebar and Layout structure
 */
export function mountApp() {
  // Inject CSS for orange highlighting (in case no external CSS file)
  if (!document.getElementById('sidebar-active-style')) {
    const style = document.createElement('style');
    style.id = 'sidebar-active-style';
    style.textContent = `
      .sidebar li.active {
        background-color: #ff9800;
        color: white;
      }
      .sidebar li.active .nav-label {
        color: white;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  }

  document.body.className = "dashboard-bg";
  const app = document.getElementById("app");

  if (!state.user) {
    renderLogin();
    return;
  }

  // Normalize role: lowercase and replace underscores with spaces
  let role = (state.user.role || state.user.designation || '').toLowerCase();
  role = role.replace(/_/g, ' ');
  
  // Retrieve allowed pages from the synchronized ROLE_ROUTES in router.js
  let pages = ROLE_ROUTES[role] || [];
  // Fallback for any role containing 'manager' but not found
  if (pages.length === 0 && role.includes('manager')) {
    pages = ROLE_ROUTES["branch manager"] || [];
  }

  app.innerHTML = `
    <header class="navbar">
      <div class="logo-section">
        <span class="logo">🍰 BMS</span>
        <span class="branch-tag">${state.user.branch || 'Global'}</span>
      </div>
      <div class="user-section">
        <span class="user-badge">${role.toUpperCase()}</span>
        <span class="user-name">${state.user.fullName || state.user.username}</span>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-content">
          <ul id="menu-list">
            ${pages.map(p => {
              // Default label: camelCase to Title Case
              let label = p.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              // Apply specific mapping rules for various roles
              if (p === "users") {
                label = "Staff Management";
              } else if (p === "productionPlanning") {
                label = "Production Plans";
              } else if (p === "production") {
                label = "Production Tracking";
              } else if (p === "orders" && (role === "staff" || role === "service staff")) {
                label = "POS";
              }
              // Capitalize each word for consistency
              label = label.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

              return `
                <li id="nav-${p}" onclick="window.handleNav('${p}')">
                  <span class="nav-label">${label}</span>
                </li>
              `;
            }).join("")}
          </ul>
        </div>
      </aside>

      <main id="view-root">
        </main>
    </div>
  `;

  // Handle Logout functionality
  document.getElementById("logoutBtn").onclick = () => {
    clearState();
    location.reload(); 
  };

  // Automatic Landing Page Logic:
  // If 'dashboard' is available, use it; otherwise, land on the first permitted page.
  const startPage = pages.includes("dashboard") ? "dashboard" : pages[0];
  window.handleNav(startPage);
}