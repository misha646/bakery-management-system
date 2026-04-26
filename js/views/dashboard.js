// js/views/dashboard.js
import { state, refreshGlobalState } from "../state.js";
import { renderOrders, bindOrderActions } from "./orders.js";
import { renderInventory, bindInventoryActions } from "./inventory.js";
import { renderProduction, bindProductionActions } from "./production.js";
import { renderUsers, bindUserActions } from "./users.js";

/* =====================================================
    1. THE MASTER RENDERER (Sidebar & Shell)
   ===================================================== */
export function renderDashboard() {
    const user = state.user || {};
    const activeRole = (user.role || user.designation || "").toLowerCase();

    return `
        <div class="app-container" style="display:flex; height:100vh; background:#fdfaf9; font-family: 'Poppins', sans-serif;">
            <aside style="width:260px; background:#3e2723; color:white; display:flex; flex-direction:column; box-shadow: 2px 0 10px rgba(0,0,0,0.1); z-index:10;">
                <div style="padding:30px 20px; font-weight:bold; font-size:1.4rem; border-bottom:1px solid #5d4037; color:#d2691e; display:flex; align-items:center; gap:10px;">
                    <span>🍞</span> BakeryOS Pro
                </div>
                
                <nav style="flex:1; padding:20px 10px;">
                    ${renderNavButton('home', 'dashboard', 'Dashboard', ['admin', 'manager', 'branch manager'])}
                    ${renderNavButton('pos', 'shopping_cart', 'Sales / POS', ['admin', 'manager', 'staff', 'service staff', 'branch manager'])}
                    ${renderNavButton('inventory', 'inventory_2', 'Inventory', ['admin', 'manager', 'branch manager'])}
                    ${renderNavButton('production', 'restaurant', 'Kitchen Hub', ['admin', 'baker', 'manager', 'branch manager'])}
                    ${renderNavButton('staff', 'groups', 'Staff Management', ['admin'])}
                </nav>

                <div style="padding:20px; background:#2d1d1a; border-top:1px solid #5d4037;">
                    <div style="font-size:0.9rem; font-weight:600; color:#fff;">${user.full_name || user.user_name}</div>
                    <div style="font-size:0.75rem; color:#a1887f;">${activeRole.toUpperCase()} | ${user.branch_name || 'Global'}</div>
                </div>
            </aside>

            <main style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
                <header style="height:65px; background:white; border-bottom:1px solid #e0d7d5; display:flex; align-items:center; padding:0 30px; justify-content:space-between;">
                    <h2 id="current-view-title" style="margin:0; font-size:1.2rem; color:#3e2723; font-weight:700;">Global Analytics</h2>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <span id="last-sync-time" style="font-size:0.75rem; color:#8d6e63;">Synced: Just now</span>
                        <button onclick="handleLogout()" style="background:#efebe9; border:none; padding:8px 15px; border-radius:6px; cursor:pointer; color:#3e2723; font-weight:600; font-size:0.85rem;">Logout</button>
                    </div>
                </header>
                
                <div id="module-content" style="flex:1; overflow-y:auto; padding:25px; background:#fdfaf9;">
                    ${loadGlobalDashboard()}
                </div>
            </main>
        </div>
    `;
}

function renderNavButton(id, icon, label, allowedRoles) {
    const user = state.user || {};
    const userRole = (user.role || user.designation || "").toLowerCase();
    if (!allowedRoles.includes(userRole)) return '';
    
    return `
        <button onclick="switchTab('${id}')" id="nav-${id}" class="nav-btn" style="width:100%; display:flex; align-items:center; gap:12px; padding:12px 15px; margin-bottom:5px; background:none; border:none; color:#d7ccc8; cursor:pointer; text-align:left; border-radius:8px; transition:0.2s;">
            <i class="material-icons" style="font-size:20px;">${icon}</i>
            <span style="font-weight:500;">${label}</span>
        </button>
    `;
}

/* =====================================================
    2. ANALYTICS LOGIC (Home View with Live Stats)
   ===================================================== */
function loadGlobalDashboard() {
    // These stats now come directly from the Backend DashboardStatsView
    const stats = state.dashboardStats || {
        total_revenue: 0,
        orders_count: 0,
        completed_production: 0,
        low_stock_alerts: 0
    };
    
    const orders = state.orders || [];

    return `
        <div style="animation: fadeIn 0.3s ease-in;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: #fff; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-left: 5px solid #2e7d32;">
                    <div style="color: #8d6e63; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Revenue (Today)</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: #1b5e20; margin-top: 10px;">₹${parseFloat(stats.total_revenue).toLocaleString('en-IN')}</div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">${stats.orders_count} Sales Generated</div>
                </div>

                <div class="${stats.low_stock_alerts > 0 ? 'pulse-border' : ''}" style="background: #fff; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-left: 5px solid ${stats.low_stock_alerts > 0 ? '#d32f2f' : '#ccc'};">
                    <div style="color: ${stats.low_stock_alerts > 0 ? '#d32f2f' : '#8d6e63'}; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Inventory Alerts</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: #3e2723; margin-top: 10px;">${stats.low_stock_alerts} <span style="font-size:1rem; font-weight:400;">Items Low</span></div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">Needs Restocking</div>
                </div>

                <div style="background: #fff; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border-left: 5px solid #d2691e;">
                    <div style="color: #8d6e63; font-size: 0.85rem; font-weight: 700; text-transform: uppercase;">Kitchen Activity</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: #3e2723; margin-top: 10px;">${stats.completed_production} <span style="font-size:1rem; font-weight:400;">Batches</span></div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">Completed Today</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 25px;">
                <div style="background:white; padding:20px; border-radius:15px; border:1px solid #e0d7d5; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <h3 style="margin-top:0; color:#3e2723; font-size:1rem; display:flex; align-items:center; gap:8px;">
                        <i class="material-icons" style="font-size:18px; color:#d2691e;">history</i> Live Sales Feed
                    </h3>
                    <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
                        <thead>
                            <tr style="text-align:left; color:#8d6e63; border-bottom:1px solid #eee;">
                                <th style="padding:10px 0;">Order No.</th>
                                <th>Amount</th>
                                <th>Branch</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.length === 0 ? '<tr><td colspan="4" style="padding:20px; text-align:center; color:#999;">Waiting for transactions...</td></tr>' : 
                              orders.slice(0, 5).map(o => `
                                <tr style="border-bottom:1px solid #fafafa;">
                                    <td style="padding:12px 0; font-family:monospace; font-weight:600;">#${o.order_number || o.id}</td>
                                    <td style="font-weight:600; color:#2e7d32;">₹${parseFloat(o.net_amount || o.total_amount).toLocaleString('en-IN')}</td>
                                    <td style="color:#666;">${o.branch_name || 'Store'}</td>
                                    <td><span style="background:#e8f5e9; color:#2e7d32; padding:3px 8px; border-radius:4px; font-size:0.75rem; font-weight:600;">PAID</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="background:#3e2723; padding:25px; border-radius:15px; color:white; box-shadow: 0 4px 15px rgba(62, 39, 35, 0.2);">
                    <h3 style="margin-top:0; color:#d2691e; font-size:1rem; letter-spacing:1px;">SHORTCUTS</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button onclick="switchTab('pos')" class="action-btn">
                            <i class="material-icons">add_shopping_cart</i> Launch POS
                        </button>
                        <button onclick="switchTab('production')" class="action-btn">
                            <i class="material-icons">restaurant</i> Kitchen Hub
                        </button>
                        <button onclick="switchTab('inventory')" class="action-btn">
                            <i class="material-icons">inventory_2</i> View Stock
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* =====================================================
    3. THE TAB SWITCHER (Zero-Reload Logic)
   ===================================================== */
window.switchTab = async (tabId) => {
    const container = document.getElementById('module-content');
    const title = document.getElementById('current-view-title');
    const syncText = document.getElementById('last-sync-time');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.style.background = 'none';
        btn.style.color = '#d7ccc8';
    });

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.style.background = 'rgba(210, 105, 30, 0.2)';
        activeBtn.style.color = 'white';
    }
    
    container.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#8d6e63;">
            <div class="spinner"></div>
            <p style="margin-top:15px; font-weight:600; letter-spacing:0.5px;">SYNCING LIVE DATA...</p>
        </div>
    `;
    
    // Sync all tables from Backend
    await refreshGlobalState();
    syncText.innerText = `Synced: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;

    switch(tabId) {
        case 'home':
            title.innerText = "Global Analytics";
            container.innerHTML = loadGlobalDashboard();
            break;
        case 'pos':
            title.innerText = "Point of Sale";
            container.innerHTML = renderOrders();
            bindOrderActions();
            break;
        case 'inventory':
            title.innerText = "Inventory Management";
            container.innerHTML = renderInventory();
            bindInventoryActions();
            break;
        case 'production':
            title.innerText = "Kitchen Hub";
            container.innerHTML = renderProduction();
            bindProductionActions();
            break;
        case 'staff':
            title.innerText = "Staff Directory";
            container.innerHTML = renderUsers();
            bindUserActions();
            break;
    }
};

window.handleLogout = () => {
    if(confirm("Sign out of BakeryOS?")) {
        localStorage.clear();
        location.reload();
    }
};

// CSS Extensions for Animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(211, 47, 47, 0); } 100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); } }
    
    .spinner { 
        width:40px; height:40px; border:4px solid #efebe9; 
        border-top:4px solid #d2691e; border-radius:50%; 
        animation: spin 1s linear infinite; 
    }
    
    .pulse-border {
        animation: pulseRed 2s infinite;
        border: 2px solid #d32f2f !important;
    }

    .nav-btn:hover { background: rgba(255,255,255,0.05) !important; color: white !important; }
    
    .action-btn {
        display: flex; align-items: center; gap: 10px;
        background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); 
        color: white; padding: 14px; border-radius: 10px; 
        text-align: left; cursor: pointer; font-size: 0.9rem; transition: 0.3s;
    }
    
    .action-btn:hover {
        background: #d2691e;
        transform: translateX(5px);
        border-color: transparent;
    }
`;
document.head.appendChild(style);



// import { state } from "../state.js";
// import { navigate } from "../router.js";

// /* =====================================================
//     1. CORE LOGIC & REDIRECTION
//    ===================================================== */

// /**
//  * Main Entry Point: Decides which dashboard to render or where to redirect
//  */
// export function renderDashboard() {
//     const role = (state.user?.role || "").toLowerCase();
//     const branchId = state.user?.fk_branch_id || "";

//     // RBAC Redirect for roles with no dashboard access
//     if (["baker", "staff", "service staff"].includes(role)) {
//         return redirectNoDashboard(role);
//     }

//     if (role === "admin") {
//         return loadGlobalDashboard();
//     } else if (role === "manager" || role === "branch manager") {
//         return loadBranchDashboard(branchId);
//     }

//     return `<div class="p-4">Unauthorized Access</div>`;
// }

// function redirectNoDashboard(role) {
//     setTimeout(() => {
//         if (role === "baker") navigate("production");
//         else navigate("orders");
//     }, 1500);

//     return `
//         <div class="no-access-container">
//             <div class="info-card">
//                 <i class="material-icons">info_outline</i>
//                 <h2>Dashboard Restricted</h2>
//                 <p>Dashboards are for Administrative use. Redirecting you to your workspace...</p>
//             </div>
//         </div>
//     `;
// }

// /* =====================================================
//     2. DATA AGGREGATION ENGINE
//    ===================================================== */

// const getAggregatedMetrics = (branchId = "All") => {
//     const isGlobal = branchId === "All";
    
//     // Filter functions
//     const filterByBranch = (list) => isGlobal ? list : list.filter(i => i.fk_branch_id === branchId || i.branch === branchId);

//     const orders = filterByBranch(state.orders || []);
//     const items = state.order_items || [];
//     const customers = filterByBranch(state.customers || []);
//     const inventory = filterByBranch(state.inventory || []);
//     const issues = filterByBranch(state.issue_mst || []);

//     return {
//         totalSales: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
//         orderCount: orders.length,
//         customerCount: customers.length,
//         lowStockCount: inventory.filter(i => i.quantity < 10).length,
//         pendingIssues: issues.filter(i => i.status !== 'Resolved').length,
//         recentOrders: orders.slice(-5).reverse()
//     };
// };

// /* =====================================================
//     3. UI RENDERERS
//    ===================================================== */

// function loadGlobalDashboard() {
//     const metrics = getAggregatedMetrics("All");
//     const branches = state.branches || [];

//     return `
//         <div class="dashboard-view">
//             <header class="dashboard-header">
//                 <div>
//                     <h1>Global Analytics</h1>
//                     <p>Aggregated data across ${branches.length} branches</p>
//                 </div>
//                 <div class="dashboard-filters">
//                     <select id="dashBranchFilter" onchange="window.updateDashboardScope()">
//                         <option value="All">All Branches</option>
//                         ${branches.map(b => `<option value="${b.branch_id}">${b.branch_name}</option>`).join('')}
//                     </select>
//                     <input type="date" id="dashStartDate">
//                     <input type="date" id="dashEndDate">
//                 </div>
//             </header>

//             ${renderStatsGrid(metrics)}

//             <div class="charts-container">
//                 <div class="chart-card">
//                     <h3>Sales Trend (Global)</h3>
//                     <div class="chart-placeholder"></div>
//                 </div>
//                 <div class="chart-card">
//                     <h3>Branch Performance</h3>
//                     <div class="chart-placeholder"></div>
//                 </div>
//             </div>

//             <div class="table-card mt-4">
//                 <h3>System-wide Pending Issues</h3>
//                 ${renderIssuesSummary(state.issue_mst || [])}
//             </div>
//         </div>
//     `;
// }

// function loadBranchDashboard(branchId) {
//     const metrics = getAggregatedMetrics(branchId);
//     const branchName = state.user?.branch || "Current Branch";

//     return `
//         <div class="dashboard-view">
//             <header class="dashboard-header">
//                 <div>
//                     <h1>${branchName} Dashboard</h1>
//                     <p>Local performance and inventory metrics</p>
//                 </div>
//                 <div class="dashboard-filters">
//                     <input type="date" id="dashStartDate">
//                     <input type="date" id="dashEndDate">
//                 </div>
//             </header>

//             ${renderStatsGrid(metrics)}

//             <div class="charts-container">
//                 <div class="chart-card">
//                     <h3>Inventory Status</h3>
//                     <div class="chart-placeholder"></div>
//                 </div>
//                 <div class="chart-card">
//                     <h3>Production vs Plan</h3>
//                     <div class="chart-placeholder"></div>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function renderStatsGrid(m) {
//     return `
//         <div class="stats-grid">
//             <div class="stat-card gold">
//                 <label>Total Revenue</label>
//                 <div class="value">₹${m.totalSales.toLocaleString()}</div>
//                 <div class="trend">Total from ${m.orderCount} orders</div>
//             </div>
//             <div class="stat-card brown">
//                 <label>Total Customers</label>
//                 <div class="value">${m.customerCount}</div>
//             </div>
//             <div class="stat-card red">
//                 <label>Low Stock Alerts</label>
//                 <div class="value">${m.lowStockCount} Items</div>
//             </div>
//             <div class="stat-card">
//                 <label>Active Issues</label>
//                 <div class="value">${m.pendingIssues}</div>
//             </div>
//         </div>
//     `;
// }

// function renderIssuesSummary(issues) {
//     if (issues.length === 0) return `<p class="p-4">No logged issues.</p>`;
//     return `
//         <table class="bakery-table">
//             <thead>
//                 <tr><th>Severity</th><th>Issue</th><th>Status</th><th>Branch</th></tr>
//             </thead>
//             <tbody>
//                 ${issues.slice(0, 5).map(i => `
//                     <tr>
//                         <td><span class="severity-${i.severity?.toLowerCase()}">${i.severity}</span></td>
//                         <td>${i.description}</td>
//                         <td>${i.status}</td>
//                         <td>${i.fk_branch_id}</td>
//                     </tr>
//                 `).join('')}
//             </tbody>
//         </table>
//     `;
// }

// // Global scope update handler
// window.updateDashboardScope = () => {
//     const branchId = document.getElementById('dashBranchFilter').value;
//     const root = document.getElementById('view-root');
//     if (branchId === "All") {
//         root.innerHTML = loadGlobalDashboard();
//     } else {
//         root.innerHTML = loadBranchDashboard(branchId);
//     }
// };