// js/views/dashboard/manager.js
import { state } from "../../state.js";

export function renderManagerDashboard() {
  const user = state.user || {};
  const branchId = user.fk_branch || user.fk_branch_id || 1;
  const branchName = user.branch_name || "My Branch";

  // Filter data for this branch
  const branchUsers = (state.users || []).filter(u => String(u.fk_branch || u.fk_branch_id) === String(branchId));
  
  // Products: check if product's fk_branch_ids includes the branch ID
  const branchProducts = (state.products || []).filter(p => {
    const branchIds = p.fk_branch_ids || [];
    return branchIds.some(id => String(id) === String(branchId));
  });
  
  const branchOrders = (state.orders || []).filter(o => String(o.fk_branch) === String(branchId));
  const branchInventory = (state.inventory || []).filter(i => String(i.fk_branch) === String(branchId));
  
  const totalRevenue = branchOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  const lowStockItems = branchInventory.filter(i => parseFloat(i.quantity) < 10);
  
  setTimeout(() => initManagerCharts(branchOrders), 50);

  return `
    <section class="dashboard manager-dashboard" style="padding: 25px; background: #fdfaf9; min-height: 100vh; animation: fadeIn 0.4s ease;">
      
      <header style="margin-bottom:30px; border-bottom: 2px solid #efebe9; padding-bottom: 15px;">
        <h2 style="color:#3e2723; margin:0; font-weight:800;">Branch Name: ${branchName}</h2>
        <p style="color:#8d6e63; margin:5px 0 0 0; font-weight:600;">Managerial Oversight & Local Performance</p>
      </header>

      <div class="cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <div class="card" style="background:white; padding:25px; border-radius:15px; border-left: 6px solid #5d4037; box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align:left;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0; letter-spacing:1px;">Branch Staff</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#3e2723;">${branchUsers.length}</p>
          <div style="font-size:0.8rem; color:#aaa; font-weight:600;">Active Users in Branch</div>
        </div>

        <div class="card" style="background:white; padding:25px; border-radius:15px; border-left: 6px solid #2e7d32; box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align:left;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0; letter-spacing:1px;">Product Master</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#1b5e20;">${branchProducts.length}</p>
          <div style="font-size:0.8rem; color:#aaa; font-weight:600;">Catalog Items in Branch</div>
        </div>

        <div class="card" style="background:white; padding:25px; border-radius:15px; border-left: 6px solid #d2691e; box-shadow: 0 4px 15px rgba(0,0,0,0.04); text-align:left;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0; letter-spacing:1px;">Branch Revenue</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#bf360c;">₹${totalRevenue.toLocaleString('en-IN')}</p>
          <div style="font-size:0.8rem; color:#aaa; font-weight:600;">Gross Sales (This Branch)</div>
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
                <th style="padding:12px 0;">Branch</th>
                <th style="padding:12px 0; text-align:right;">Qty Left</th>
              </tr>
            </thead>
            <tbody>
              ${lowStockItems.length > 0 ? lowStockItems.slice(0, 6).map(item => {
                const branch = state.branches.find(b => String(b.id) === String(item.fk_branch));
                return `
                  <tr style="border-bottom: 1px solid #f9f9f9;">
                    <td style="padding:14px 0; font-weight:700; color:#3e2723; font-size:0.9rem;">${item.item_name}</td>
                    <td style="padding:14px 0; font-size:0.8rem; color:#8d6e63; font-weight:600;">${branch ? branch.branch_name : 'Branch ' + item.fk_branch}</td>
                    <td style="padding:14px 0; text-align:right; color:#d32f2f; font-weight:900;">${parseFloat(item.quantity).toFixed(0)}</td>
                  </tr>
                `;
              }).join('') : '<tr><td colspan="3" style="padding:50px; text-align:center; color:#999; font-style:italic;">All inventory levels healthy</td></tr>'}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  `;
}

function initManagerCharts(branchOrders) {
  const ctx = document.getElementById("orderStatusChart");
  if (!ctx) return;

  const paidCount = branchOrders.filter(o => (o.payment_status || '').toLowerCase() === 'paid').length;
  const pendingCount = branchOrders.filter(o => (o.payment_status || '').toLowerCase() === 'pending').length;

  if (paidCount === 0 && pendingCount === 0) {
      const context = ctx.getContext('2d');
      context.clearRect(0, 0, ctx.width, ctx.height);
      context.font = "bold 14px Segoe UI";
      context.fillStyle = "#ccc";
      context.textAlign = "center";
      context.fillText("WAITING FOR SALES DATA...", ctx.width / 2, ctx.height / 2);
      return;
  }

  new Chart(ctx, {
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