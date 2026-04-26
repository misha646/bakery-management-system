// js/app.js - Final Integration Version (Strict RBAC & Filtering)
import { state, clearState, initState, refreshGlobalState } from "./state.js";
import { renderLogin } from "./auth.js";
import { navigate } from "./router.js";

// Inject CSS for active sidebar highlighting (orange)
if (!document.getElementById('sidebar-active-style')) {
  const style = document.createElement('style');
  style.id = 'sidebar-active-style';
  style.textContent = `
    .sidebar li.active {
      background-color: #ff9800;
      color: white;
    }
    .sidebar li.active .sidebar-link {
      color: white;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
}

export async function mountApp() {
  const persistentToken = localStorage.getItem("bmsToken");
  if (!state.user || !persistentToken || persistentToken === "activation_pending") {
    renderLogin();
    return;
  }

  const app = document.getElementById("app");
  if (!app) return;

  document.body.className = "dashboard-bg";

  const role = (state.user.role || state.user.designation || 'Staff').toLowerCase();
  
  app.innerHTML = `
      <header class="navbar">
        <div class="logo-section">
          <span class="logo">Bakery System</span>
          <span class="branch-tag">${state.user.branch_name || 'Global Operations'}</span>
        </div>
        <div class="user-section">
          <span class="user-badge">${role.toUpperCase()}</span>
          <span class="user-name">${state.user.fullName || state.user.username}</span>
          <button id="logoutBtn" class="logout-btn">Logout</button>
        </div>
      </header>
      <div class="layout">
        <aside class="sidebar" id="sidebar" style="overflow-y: auto; max-height: 100vh;">
          <ul id="menu-list"></ul>
        </aside>
        <main id="view-root"></main>
      </div>
  `;

  document.getElementById("logoutBtn").onclick = () => {
    clearState();
    location.reload(); 
  };

  renderSidebar();
  
  // Set initial page based on role
  if (role === "admin" || role.includes("manager")) {
      await navigate("dashboard");
  } else if (role === "baker") {
      await navigate("production planning");
  } else {
      await navigate("orders");
  }
}

function renderSidebar() {
  const menuList = document.getElementById("menu-list");
  if (!menuList) return;
  menuList.innerHTML = "";

  const role = (state.user.role || state.user.designation || '').toLowerCase();
  let pages = ["profile"];

  if (role === "admin") {
    pages = [
      "dashboard",
      "branches",
      "users",
      "suppliers",
      "categories",
      "products",
      "production planning",
      "production",
      "inventory",
      "orders",
      "customers",
      "issues",
      "reports",
      "profile"
    ];
  } 
  else if (role.includes("manager")) {
    // ✅ Branch manager now has access to "users" (Staff Management)
    pages = [
      "dashboard",
      "users",               // <-- ADDED
      "suppliers",
      "categories",
      "products",
      "production planning",
      "production",
      "inventory",
      "orders",
      "customers",
      "issues",
      "reports",
      "profile"
    ];
  } 
  else if (role === "baker") {
    pages = ["production planning", "production", "inventory", "issues", "profile"];
  } 
  else { // staff
    pages = ["orders", "customers", "issues", "profile"];
  }

  pages.forEach(page => {
    const li = document.createElement("li");
    const displayName = page.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    li.textContent = displayName;
    li.className = "sidebar-link";
    li.setAttribute("data-page", page);   // for router to identify active page
    li.onclick = () => {
      // Remove active class from all items, add to this one
      document.querySelectorAll(".sidebar li").forEach(item => item.classList.remove("active"));
      li.classList.add("active");
      navigate(page);
    };
    menuList.appendChild(li);
  });

  // Expose function for router to update active class (without re-rendering)
  window.updateSidebarActive = (page) => {
    document.querySelectorAll(".sidebar li").forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("data-page") === page) {
        item.classList.add("active");
      }
    });
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("App starting...");
  
  await initState();

  window.state = state;

  const persistentToken = localStorage.getItem("bmsToken");

  if (state.user && persistentToken && persistentToken !== "undefined" && persistentToken !== "activation_pending") {
    try {
      console.log("User found:", state.user.user_name || state.user.username);
      console.log("Refreshing data from server...");
      
      const syncSuccess = await refreshGlobalState();
      
      if (!syncSuccess) {
          console.warn("Sync had issues, but continuing with available data");
      }
      
      console.log("Categories after refresh:", state.categories.length);
      
      await mountApp();
      
    } catch (err) {
      console.error("Sync process error:", err);
      if (err.message === "UNAUTHORIZED" || err.message.includes("401") || err.message.includes("403")) {
          clearState();
          renderLogin();
      } else {
          await mountApp();
      }
    }
  } else {
    console.log("No valid session found, showing login");
    renderLogin();
  }
});