// js/views/dashboard/baker.js
import { state } from "../../state.js";

export function renderBakerDashboard() {
  const user = state.user || {};
  const branchId = user.fk_branch || user.fk_branch_id || 1;
  const branchName = user.branch_name || "Kitchen";

  // 1. FILTERING: Only show production batches for THIS kitchen
  const allProduction = state.production || [];
  const branchProduction = allProduction.filter(p => String(p.fk_branch) === String(branchId));

  // 2. STATUS MAPPING: Using 'issue_status' from MySQL Serializer
  const pending = branchProduction.filter(p => p.issue_status === 'Pending').length;
  const inProgress = branchProduction.filter(p => p.issue_status === 'In Progress').length;
  const completed = branchProduction.filter(p => p.issue_status === 'Completed').length;
  
  // Trigger Charts
  setTimeout(() => initBakerCharts(pending, inProgress, completed), 50);

  return `
    <section class="dashboard baker-dashboard" style="padding: 25px; background: #fdfaf9; min-height: 100vh; animation: fadeIn 0.4s ease;">
      
      <header style="margin-bottom:30px; border-bottom: 2px solid #efebe9; padding-bottom: 15px;">
        <h2 style="color:#3e2723; margin:0; font-weight:800;">👨‍🍳 Kitchen Command: ${branchName}</h2>
        <p style="color:#8d6e63; margin:5px 0 0 0; font-weight:600;">Daily Baking Schedule & Batch Tracking</p>
      </header>

      <div class="cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <div class="card clickable" onclick="window.switchTab('production')" style="background:white; padding:25px; border-radius:15px; border-top: 5px solid #d2691e; box-shadow: 0 4px 12px rgba(0,0,0,0.04); cursor:pointer;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0;">Pending Batches</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#3e2723;">${pending}</p>
          <small style="color:#aaa; font-weight:600;">Waiting for Prep</small>
        </div>

        <div class="card clickable" onclick="window.switchTab('production')" style="background:white; padding:25px; border-radius:15px; border-top: 5px solid #0288d1; box-shadow: 0 4px 12px rgba(0,0,0,0.04); cursor:pointer;">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0;">In the Oven</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#01579b;">${inProgress}</p>
          <small style="color:#aaa; font-weight:600;">Active Production</small>
        </div>

        <div class="card" style="background:white; padding:25px; border-radius:15px; border-top: 5px solid #2e7d32; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          <h3 style="color:#8d6e63; font-size: 0.75rem; text-transform:uppercase; font-weight:800; margin:0;">Target Completion</h3>
          <p style="font-size:2.4rem; font-weight:900; margin:10px 0; color:#1b5e20;">${branchProduction.length}</p>
          <small style="color:#aaa; font-weight:600;">Total Planned Batches</small>
        </div>

      </div>

      <div class="dashboard-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
        <div class="panel" style="background:white; padding:30px; border-radius:20px; border: 1px solid #e0d7d5;">
          <h3 style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 1px solid #eee; padding-bottom:15px;">Kitchen Load Analysis</h3>
          <div style="height: 300px; position: relative; margin-top:20px;">
            <canvas id="bakerLoadChart"></canvas>
          </div>
        </div>

        <div class="panel" style="background:white; padding:30px; border-radius:20px; border: 1px solid #e0d7d5;">
          <h3 style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 1px solid #eee; padding-bottom:15px;">Active Queue</h3>
          <div style="margin-top:10px;">
            ${branchProduction.filter(p => p.issue_status !== 'Completed').slice(0, 5).map(p => `
              <div style="padding:15px 0; border-bottom:1px solid #f9f9f9; display:flex; justify-content:space-between; align-items:center;">
                <div>
                   <div style="font-weight:700; color:#3e2723;">${p.product_name}</div>
                   <div style="font-size:0.75rem; color:#8d6e63; font-weight:600;">Target: ${parseFloat(p.produced_quantity).toFixed(0)} Units</div>
                </div>
                <span style="font-size:0.65rem; font-weight:800; padding:4px 10px; border-radius:20px; background:${p.issue_status === 'In Progress' ? '#e1f5fe' : '#fff3e0'}; color:${p.issue_status === 'In Progress' ? '#0288d1' : '#e65100'}; border:1px solid currentColor;">
                    ${p.issue_status.toUpperCase()}
                </span>
              </div>
            `).join('') || '<p style="text-align:center; padding:30px; color:#999;">Kitchen queue is clear!</p>'}
          </div>
        </div>
      </div>
    </section>
  `;
}

function initBakerCharts(pending, inProgress, completed) {
  const ctx = document.getElementById("bakerLoadChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Queue", "Oven", "Done"],
      datasets: [{ 
          label: 'Batch Count',
          data: [pending, inProgress, completed],
          backgroundColor: ['#d2691e', '#0288d1', '#2e7d32'],
          borderRadius: 10,
          barThickness: 40
      }]
    },
    options: { 
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { borderDash: [5, 5] } },
        x: { grid: { display: false } }
      }
    }
  });
}