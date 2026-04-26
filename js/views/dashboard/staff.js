// js/views/dashboard/staff.js
import { state } from "../../state.js";

export function renderStaffDashboard() {
  const user = state.user || {};
  const branchId = user.fk_branch || user.fk_branch_id || 1;
  const branchName = user.branch_name || "Counter";

  // 1. FILTERING: Only show orders for THIS branch counter
  const allOrders = state.orders || [];
  const branchOrders = allOrders.filter(o => String(o.fk_branch) === String(branchId));
  
  // 2. REAL-TIME CALCULATIONS
  const shiftRevenue = branchOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  
  // Inventory alerts for the products sold at this branch
  const branchInventory = (state.inventory || []).filter(i => String(i.fk_branch) === String(branchId));
  const lowStockCount = branchInventory.filter(i => parseFloat(i.quantity) < 10).length;

  // Trigger Charts
  setTimeout(() => initStaffCharts(branchOrders), 50);

  return `
    <section class="dashboard staff-dashboard" style="padding: 25px; background: #fdfaf9; min-height: 100vh; animation: fadeIn 0.4s ease;">
      
      <header style="margin-bottom:30px; border-bottom: 2px solid #efebe9; padding-bottom: 15px;">
        <h2 style="color:#3e2723; margin:0; font-weight:800;">🛒 Counter Stats: ${branchName}</h2>
        <p style="color:#8d6e63; margin:5px 0 0 0; font-weight:600;">Daily Sales Tracking & Order Volume</p>
      </header>

      <div class="cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <div class="card" style="background:white; padding:25px; border-radius:15px; border-top: 5px solid #2e7d32; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0;">Today's Sales</h3>
          <p style="font-size:2.2rem; font-weight:900; margin:10px 0; color:#1b5e20;">₹${shiftRevenue.toLocaleString('en-IN')}</p>
          <small style="color:#aaa; font-weight:600;">Total Revenue Collected</small>
        </div>

        <div class="card clickable" onclick="window.switchTab('pos')" style="background:white; padding:25px; border-radius:15px; border-top: 5px solid #5d4037; box-shadow: 0 4px 12px rgba(0,0,0,0.04); cursor:pointer;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0;">Orders Taken</h3>
          <p style="font-size:2.2rem; font-weight:900; margin:10px 0; color:#3e2723;">${branchOrders.length}</p>
          <small style="color:#aaa; font-weight:600;">Click to open POS</small>
        </div>

        <div class="card ${lowStockCount > 0 ? 'warning' : ''}" style="background:white; padding:25px; border-radius:15px; border-top: 5px solid ${lowStockCount > 0 ? '#d32f2f' : '#8d6e63'}; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0;">Stock Warnings</h3>
          <p style="font-size:2.2rem; font-weight:900; margin:10px 0; color:${lowStockCount > 0 ? '#d32f2f' : '#3e2723'};">${lowStockCount}</p>
          <small style="color:#aaa; font-weight:600;">Items running low today</small>
        </div>

      </div>

      <div class="dashboard-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
        <div class="panel" style="background:white; padding:30px; border-radius:20px; border: 1px solid #e0d7d5;">
          <h3 style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 1px solid #eee; padding-bottom:15px;">Payment Method Split</h3>
          <div style="height: 250px; position: relative; margin-top:20px;">
            <canvas id="paymentChart"></canvas>
          </div>
        </div>

        <div class="panel" style="background:white; padding:30px; border-radius:20px; border: 1px solid #e0d7d5;">
          <h3 style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 1px solid #eee; padding-bottom:15px;">Last 5 Transactions</h3>
          <div style="margin-top:10px;">
            ${branchOrders.slice(-5).reverse().map(o => `
              <div style="padding:15px 0; border-bottom:1px solid #f9f9f9; display:flex; justify-content:space-between; align-items:center;">
                <div>
                   <div style="font-weight:700; color:#3e2723;">Order #${o.id}</div>
                   <div style="font-size:0.7rem; color:#8d6e63; font-weight:800; text-transform:uppercase;">${o.payment_mode}</div>
                </div>
                <div style="color:#2e7d32; font-weight:900; font-size:1.1rem;">₹${parseFloat(o.total_amount).toFixed(0)}</div>
              </div>
            `).join('') || '<p style="text-align:center; padding:30px; color:#999; font-style:italic;">No sales recorded on this shift.</p>'}
          </div>
        </div>
      </div>
    </section>
  `;
}

function initStaffCharts(branchOrders) {
  const ctx = document.getElementById("paymentChart");
  if (!ctx) return;

  const cash = branchOrders.filter(o => (o.payment_mode || '').toLowerCase() === 'cash').length;
  const upi = branchOrders.filter(o => (o.payment_mode || '').toLowerCase() === 'upi').length;
  const card = branchOrders.filter(o => (o.payment_mode || '').toLowerCase() === 'card').length;

  if (cash === 0 && upi === 0 && card === 0) {
      const context = ctx.getContext('2d');
      context.font = "14px Segoe UI";
      context.fillStyle = "#999";
      context.textAlign = "center";
      context.fillText("No transactions to chart", ctx.width / 2, ctx.height / 2);
      return;
  }

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Cash", "UPI", "Card"],
      datasets: [{ 
          data: [cash, upi, card],
          backgroundColor: ['#5d4037', '#d2691e', '#8d6e63'],
          borderWidth: 0,
          hoverOffset: 15
      }]
    },
    options: { 
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { weight: 'bold' } } }
      },
      cutout: '70%'
    }
  });
}