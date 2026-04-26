// js/router.js - Central Navigation Logic (Strict RBAC Edition)
import { state, refreshGlobalState } from "./state.js";

// Inject CSS for sidebar active highlighting (ensures style exists)
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

/* Dashboards */
import { renderAdminDashboard } from "./views/dashboard/admin.js";
import { renderManagerDashboard } from "./views/dashboard/manager.js";
import { renderStaffDashboard } from "./views/dashboard/staff.js";

/* Core Feature Views */
import { renderProducts, bindProductActions } from "./views/products.js";
import { renderInventory, bindInventoryActions } from "./views/inventory.js";
import { renderOrders, bindOrderActions } from "./views/orders.js";
import { renderBranches, bindBranchActions } from "./views/branch.js";
import { renderUsers, bindUserActions } from "./views/users.js";
import { renderCustomers, bindCustomerActions } from "./views/customers.js";
import { renderProfile, bindProfileActions } from "./views/profile.js";

/* Bakery Operation Modules */
import { renderCategories, bindCategoryActions } from "./views/categories.js";
import { renderReports, bindReportActions } from "./views/reports.js";
import { renderProduction, bindProductionActions } from "./views/production.js";
import { renderProductionPlanning, bindProductionPlanningActions } from "./views/productionPlanning.js";

/* Support & Supply Modules */
import { renderSuppliers, bindSupplierActions } from "./views/suppliers.js";
import { renderIssues, bindIssueActions } from "./views/issues.js";

// =====================================================
// ROLE-BASED ACCESS CONTROL (MENU DEFINITIONS)
// =====================================================
export const ROLE_ROUTES = {
  admin: [
    "dashboard",
    "products",
    "inventory",
    "categories",
    "orders",
    "customers",
    "production-planning",
    "production",
    "suppliers",
    "issues",
    "users",
    "branches",
    "reports",
    "profile"
  ],
  "branch manager": [
    "dashboard",
    "products",
    "inventory",
    "categories",
    "orders",
    "customers",
    "production-planning",
    "production",
    "suppliers",
    "issues",
    "users",
    "reports",
    "profile"
  ],
  baker: [
    "production-planning",
    "production",
    "inventory",
    "issues",
    "profile"
  ],
  "service staff": [
    "orders",
    "customers",
    "issues",
    "profile"
  ]
};

// Track current view for cross-module refresh
let currentView = null;

export function getCurrentView() {
    return currentView;
}

/**
 * Handles navigation between views
 */
export async function navigate(page) {
  currentView = page;
  const root = document.getElementById("view-root");
  if (!root) return;

  // 1. Clear previous view & show loader
  root.innerHTML = `<div class="loader" style="text-align:center; padding:100px; color:#8d6e63; font-weight:bold;">
        <div style="margin-bottom:10px; font-size: 2rem;">🔄</div> Synchronizing....
    </div>`;

  // 2. Standardize page name for internal use (hyphenated)
  const targetPage = page.toLowerCase().replace(/\s+/g, '-');

  // RBAC Helper: Get normalized role from state
  const role = (state.user?.role || state.user?.designation || "").toLowerCase();
  const isAdmin = role === "admin";
  const isManager = role === "branch manager" || role.includes("manager");

  try {
    // --- CRITICAL DATA SYNC TRIGGER ---
    const modulesRequiringSync = ["orders", "inventory", "production", "production-planning", "dashboard", "users"];
    if (modulesRequiringSync.includes(targetPage)) {
        console.log(`📡 Entering transactional module [${targetPage}]: Triggering fresh data sync...`);
        await refreshGlobalState();
    }

    switch (targetPage) {
      case "dashboard":
        if (isAdmin) {
            root.innerHTML = renderAdminDashboard();
        } else if (isManager) {
            root.innerHTML = renderManagerDashboard();
        } else {
            console.warn(`🔐 Dashboard restricted for ${role}. Redirecting...`);
            const redirectPath = (role === "baker") ? "production-planning" : "orders";
            navigate(redirectPath);
            return;
        }
        break;

      case "products":
        root.innerHTML = renderProducts();
        bindProductActions?.(); 
        break;

      case "inventory":
        root.innerHTML = renderInventory();
        bindInventoryActions?.();
        break;

      case "orders":
        root.innerHTML = renderOrders();
        bindOrderActions?.();
        break;

      case "customers":
        root.innerHTML = renderCustomers();
        bindCustomerActions?.();
        break;

      case "users":
        if (!isAdmin && !isManager) return navigate("profile");
        root.innerHTML = renderUsers();
        bindUserActions?.();
        break;

      case "branches":
        if (!isAdmin && !isManager) return navigate("profile");
        root.innerHTML = renderBranches();
        bindBranchActions?.();
        break;

      case "profile":
        root.innerHTML = renderProfile();
        bindProfileActions?.();
        break;

      case "categories":
        root.innerHTML = renderCategories();
        bindCategoryActions?.();
        break;

      case "reports":
        if (isAdmin || isManager) {
            root.innerHTML = renderReports();
            if (typeof bindReportActions === "function") {
                bindReportActions();
            }
        } else {
            navigate("profile");
        }
        break;

      case "production":
      case "production-tracking":
        root.innerHTML = renderProduction();
        bindProductionActions?.();
        break;

      case "production-planning":
        root.innerHTML = renderProductionPlanning();
        bindProductionPlanningActions?.();
        break;

      case "suppliers":
        root.innerHTML = renderSuppliers();
        bindSupplierActions?.();
        break;

      case "issues":
        root.innerHTML = renderIssues();
        bindIssueActions?.();
        break;

      default:
        render404(root, page);
    }
  } catch (error) {
    console.error(`🚨 Navigation Error on ${page}:`, error);
    root.innerHTML = `<div style="padding:50px; text-align:center; color:#d32f2f;">
        <h3>Module Loading Failed</h3>
        <p>${error.message}</p>
        <button onclick="navigate('profile')" style="margin-top:20px; padding:10px 20px; background:#3e2723; color:white; border:none; border-radius:5px; cursor:pointer;">Return to Profile</button>
    </div>`;
  }

  // 3. Highlight current page in Sidebar (using the exposed function from app.js)
  if (typeof window.updateSidebarActive === "function") {
    window.updateSidebarActive(page);   // page is the original name (e.g., "production planning")
  } else {
    // Fallback: use dataset (if sidebar was rendered by app.js)
    document.querySelectorAll(".sidebar li").forEach(li => {
      li.classList.remove("active");
      if (li.getAttribute("data-page") === page) {
        li.classList.add("active");
      }
    });
  }
}

function render404(root, page) {
  root.innerHTML = `
    <div class="error-page" style="text-align:center; padding:100px; background:white; border-radius:12px; border:1px solid #e0d7d5;">
      <h1 style="color:#d32f2f; font-size:4rem; margin:0;">404</h1>
      <h2 style="color:#3e2723;">Module Not Found</h2>
      <p style="color:#8d6e63;">The module "${page}" could not be localized.</p>
      <button onclick="navigate('profile')" style="padding:12px 25px; background:#5d4037; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; margin-top:20px;">
        Return to Profile
      </button>
    </div>`;
}

// Attach to window for onclick support
window.navigate = navigate;