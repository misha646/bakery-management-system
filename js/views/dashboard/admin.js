// js/views/dashboard/admin.js
import { state } from "../../state.js";

export function renderAdminDashboard() {
  // 1. Core Data Mapping
  const users = state.users || [];
  const products = state.products || [];
  const inventory = state.inventory || [];
  const orders = state.orders || [];
  const branches = state.branches || [];

  // 2. Real-time Calculation Logic
  // Daily Revenue: Summing 'total_amount' from all orders
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  
  // Low Stock: Items under 10 units
  const lowStockItems = inventory.filter(item => parseFloat(item.quantity || 0) < 10);

  // 3. Chart Trigger
  setTimeout(initAdminCharts, 50);

  return `
    <section class="dashboard admin-dashboard" style="padding: 25px; background: #fdfaf9; min-height: 100vh; animation: fadeIn 0.4s ease;">
      
      <div class="cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <div class="card" style="background:white; padding:25px; border-radius:15px; border-left: 6px solid #5d4037; box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align:left;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0; letter-spacing:1px;">Global Staff</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#3e2723;">${users.length}</p>
          <div style="font-size:0.8rem; color:#aaa; font-weight:600;">Active Users</div>
        </div>

        <div class="card" style="background:white; padding:25px; border-radius:15px; border-left: 6px solid #2e7d32; box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align:left;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0; letter-spacing:1px;">Product Master</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#1b5e20;">${products.length}</p>
          <div style="font-size:0.8rem; color:#aaa; font-weight:600;">Catalog Items Registered</div>
        </div>

        <div class="card" style="background:white; padding:25px; border-radius:15px; border-left: 6px solid #d2691e; box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align:left;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0; letter-spacing:1px;">Total Revenue</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#bf360c;">₹${totalRevenue.toLocaleString('en-IN')}</p>
          <div style="font-size:0.8rem; color:#aaa; font-weight:600;">Gross Sales (All Branches)</div>
        </div>

        <div class="card" style="background:white; padding:25px; border-radius:15px; border-left: 6px solid #d32f2f; box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align:left;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0; letter-spacing:1px;">Stock Alerts</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#c62828;">${lowStockItems.length}</p>
          <div style="font-size:0.8rem; color:#aaa; font-weight:600;">Items requiring refill</div>
        </div>

      </div>

      <div class="dashboard-grid" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 25px;">
        
        <div class="panel" style="background:white; padding:30px; border-radius:20px; border: 1px solid #e0d7d5; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
          <h3 style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 2px solid #f8f5f2; padding-bottom:15px;">Order Payment Status</h3>
          <div style="height: 300px; position: relative; margin-top:20px;">
            <canvas id="orderStatusChart"></canvas>
          </div>
        </div>

        <div class="panel" style="background:white; padding:30px; border-radius:20px; border: 1px solid #e0d7d5; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
          <h3 style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 2px solid #f8f5f2; padding-bottom:15px;">Critical Inventory</h3>
          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <thead>
              <tr style="text-align:left; color:#8d6e63; font-size:0.65rem; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #eee;">
                <th style="padding:12px 0;">Item Description</th>
                <th style="padding:12px 0;">Location</th>
                <th style="padding:12px 0; text-align:right;">Qty Left</th>
              </tr>
            </thead>
            <tbody>
              ${lowStockItems.length > 0 ? lowStockItems.slice(0, 6).map(item => {
                const branch = branches.find(b => String(b.id) === String(item.fk_branch));
                return `
                  <tr style="border-bottom: 1px solid #f9f9f9;">
                    <td style="padding:14px 0; font-weight:700; color:#3e2723; font-size:0.9rem;">${item.item_name}</td>
                    <td style="padding:14px 0; font-size:0.8rem; color:#8d6e63; font-weight:600;">${branch ? branch.branch_name : 'Branch ' + item.fk_branch}</td>
                    <td style="padding:14px 0; text-align:right; color:#d32f2f; font-weight:900;">${parseFloat(item.quantity).toFixed(0)}</td>
                  </tr>
                `;
              }).join('') : '<tr><td colspan="3" style="padding:50px; text-align:center; color:#999; font-style:italic;">✅ All inventory levels healthy</td></tr>'}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  `;
}

function initAdminCharts() {
  const orders = state.orders || [];
  const orderCtx = document.getElementById("orderStatusChart");
  if (!orderCtx) return;

  const paidCount = orders.filter(o => (o.payment_status || '').toLowerCase() === 'paid').length;
  const pendingCount = orders.filter(o => (o.payment_status || '').toLowerCase() === 'pending').length;

  if (paidCount === 0 && pendingCount === 0) {
      const ctx = orderCtx.getContext('2d');
      ctx.clearRect(0, 0, orderCtx.width, orderCtx.height);
      ctx.font = "bold 14px Segoe UI";
      ctx.fillStyle = "#ccc";
      ctx.textAlign = "center";
      ctx.fillText("WAITING FOR SALES DATA...", orderCtx.width / 2, orderCtx.height / 2);
      return;
  }

  new Chart(orderCtx, {
    type: "doughnut",
    data: {
      labels: ["Paid Orders", "Pending Orders"],
      datasets: [{ 
        data: [paidCount, pendingCount], 
        backgroundColor: ['#2e7d32', '#d2691e'],
        borderWidth: 0,
        hoverOffset: 15
      }]
    },
    options: { 
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: 'bold' }, color: '#3e2723' } }
      },
      cutout: '75%',
      animation: { animateScale: true }
    }
  });
}