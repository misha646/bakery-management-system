// js/views/production.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";

/* =====================================================
    1. CORE BAKER LOGIC (Synced with ProductionPlan)
   ===================================================== */
export async function updateProductionStatus(planId, newStatus, actualQty = null) {
    const payload = { plan_status: newStatus };
    
    if (newStatus === 'Completed' && actualQty !== null) {
        payload.produced_quantity = parseFloat(actualQty);
    }

    try {
        await fetchData(`production-plan/${planId}/`, 'PATCH', payload);
        alert(`✅ Batch #${planId} successfully updated to: ${newStatus}`);
        await refreshGlobalState();
        refreshBakerUI();
    } catch (err) {
        console.error("Production Update Error:", err);
        alert("Action Failed: " + err.message);
        refreshBakerUI(); 
    }
}

/* =====================================================
    2. UI RENDERER (KITCHEN VIEW)
   ===================================================== */
export function renderProduction() {
    const user = state.user || {};
    const role = (user.role || user.designation || '').toLowerCase();
    let myTasks = Array.isArray(state.production_plans) ? state.production_plans : [];
    
    // Safety filtering: Admins see global status, others see active branch tasks
    if (role !== 'admin') {
        myTasks = myTasks.filter(p => String(p.plan_status).toLowerCase() !== 'completed');
    }

    return `
        <div id="production-parent-el" style="padding: 25px; background: #fdfaf9; min-height: 100vh; animation: fadeIn 0.3s ease-in;">
            <div style="margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin: 0; font-size: 26px; color: #3e2723; font-weight: 800;"> Kitchen Production Hub</h1>
                    <p style="margin: 5px 0 0 0; color: #8d6e63;">
                        Logged in: <strong>${user.fullName || user.user_name}</strong> | Scope: <strong>${user.branch_name || 'Global'}</strong>
                    </p>
                </div>
                <div style="background: #efebe9; padding: 8px 15px; border-radius: 8px; font-size: 0.85rem; color: #5d4037; font-weight: 800; border: 1px solid #d7ccc8; text-transform: uppercase;">
                    Tracked Batches: ${myTasks.length}
                </div>
            </div>

            <div id="bakerGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 25px;">
                ${myTasks.length === 0 ? 
                    `<div style="grid-column: 1/-1; padding: 80px; text-align: center; background: #fff; border: 2px dashed #d7ccc8; border-radius: 20px; color: #a1887f;">
                        <span style="font-size: 4rem; display: block; margin-bottom: 15px;">🍞</span>
                        <h3 style="margin:0; color:#3e2723; font-weight:800;">Kitchen is Clear</h3>
                        <p>No active production plans found for this view.</p>
                    </div>` : 
                    myTasks.map(task => renderBakerCard(task, role, user.id)).join('')
                }
            </div>
        </div>

        <div id="progressModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1001; justify-content:center; align-items:center; backdrop-filter: blur(2px);">
            <div style="background:white; padding:30px; border-radius:16px; width:450px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                <div id="progressContent"></div>
                <div style="display:flex; justify-content:flex-end; margin-top:25px; border-top: 1px solid #eee; padding-top:20px;">
                    <button id="btnCloseProgress" style="padding:12px 30px; border:none; background:#5d4037; color:white; border-radius:10px; cursor:pointer; font-weight:800; text-transform:uppercase;">Close Oversight</button>
                </div>
            </div>
        </div>
    `;
}

function renderBakerCard(p, role, currentUserId) {
    const isStarted = String(p.plan_status).toLowerCase() === 'in progress';
    const isAssignedToMe = String(p.fk_assigned_to) === String(currentUserId);
    
    // Only assigned staff (Baker/Truck) can interact with Start/Finish buttons
    const canUpdate = isAssignedToMe && (role === 'baker' || role === 'service truck'); 
    const pid = p.id; 

    return `
        <div class="production-card" style="background: #fff; border: 1px solid #e0d7d5; border-radius: 16px; padding: 25px; box-shadow: 0 4px 12px rgba(62, 39, 35, 0.05);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-family: monospace; font-weight: 700; color: #a1887f; background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size:0.75rem;">BATCH #${pid}</span>
                    <span style="font-size:0.6rem; color:#8d6e63; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;"> ${p.assigned_user_name || 'Assigned Staff'}</span>
                </div>
                <span style="color: ${isStarted ? '#0288d1' : '#e65100'}; background: ${isStarted ? '#e1f5fe' : '#fff3e0'}; padding: 6px 14px; border-radius: 30px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase;">
                    ${p.plan_status || 'Pending'}
                </span>
            </div>

            <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; color: #3e2723; font-weight: 800;">${p.product_name}</h3>
            
            <div style="display: flex; gap: 20px; margin-bottom: 25px;">
                <div>
                    <small style="color: #8d6e63; display: block; text-transform: uppercase; font-size: 0.6rem; font-weight: 800; letter-spacing:1px;">Target Qty</small>
                    <strong style="font-size: 1.2rem; color: #5d4037;">${parseFloat(p.planned_quantity || 0).toFixed(0)} <small style="font-size:0.7rem;">PCS</small></strong>
                </div>
                <div style="border-left: 1px solid #eee; padding-left: 20px;">
                    <small style="color: #8d6e63; display: block; text-transform: uppercase; font-size: 0.6rem; font-weight: 800; letter-spacing:1px;">Deadline</small>
                    <strong style="font-size: 0.8rem; color: #5d4037;">${p.plan_end_date}</strong>
                </div>
            </div>

            <div style="margin-top: 10px;">
                ${canUpdate ? `
                    ${!isStarted ? 
                        `<button class="start-btn" data-id="${pid}" style="width: 100%; background: #5d4037; color: #fff; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; text-transform:uppercase; letter-spacing:1px;">Start Production</button>` : 
                        `<div style="display: flex; flex-direction: column; gap: 10px;">
                            <label style="font-size: 0.7rem; font-weight: 800; color: #8d6e63; text-transform:uppercase;">Final Yield Count:</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="number" id="qty_${pid}" value="${p.planned_quantity}" style="flex: 1; padding: 12px; border: 2px solid #efebe9; border-radius: 10px; font-size: 1.1rem; font-weight: 800; color: #3e2723; outline:none;">
                                <button class="finish-btn" data-id="${pid}" style="background: #2e7d32; color: #fff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; text-transform:uppercase;">Finish</button>
                            </div>
                        </div>`
                    }
                ` : `
                    <button class="view-progress-btn" data-id="${pid}" style="width: 100%; background: #efebe9; color: #5d4037; border: 1px solid #d7ccc8; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; text-transform:uppercase; font-size:0.75rem;">
                        View Live Progress
                    </button>
                `}
            </div>
        </div>
    `;
}

/* =====================================================
    3. EVENT BINDING & REFRESH
   ===================================================== */
export function bindProductionActions() {
    const grid = document.getElementById('bakerGrid');
    const progModal = document.getElementById('progressModal');
    if (!grid) return;

    document.getElementById('btnCloseProgress')?.addEventListener('click', () => {
        progModal.style.display = 'none';
    });

    grid.onclick = (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const id = btn.dataset.id;
        const plan = state.production_plans.find(p => String(p.id) === String(id));

        if (btn.classList.contains('view-progress-btn')) {
            document.getElementById('progressContent').innerHTML = `
                <h3 style="color:#3e2723; margin:0 0 20px 0; font-weight:800; border-bottom:2px solid #f8f5f2; padding-bottom:10px;">Live Batch Oversight</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; background:#f8f5f2; padding:20px; border-radius:12px;">
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">Status</small><br><strong>${plan.plan_status}</strong></div>
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">Staff</small><br><strong>${plan.assigned_user_name}</strong></div>
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">Target</small><br><strong>${parseFloat(plan.planned_quantity).toFixed(0)} PCS</strong></div>
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">Location</small><br><strong>${plan.branch_name}</strong></div>
                </div>
                <div style="margin-top:20px; padding:15px; background:#fff3e0; border-radius:10px; border:1px solid #ffe0b2;">
                    <small style="color:#e65100; font-weight:800;">MANAGER NOTE</small>
                    <p style="margin:5px 0 0 0; font-size:0.85rem; color:#3e2723;">You are viewing real-time status. Interactions are restricted to assigned Bakers.</p>
                </div>
            `;
            progModal.style.display = 'flex';
        }

        if (btn.classList.contains('start-btn')) {
            btn.disabled = true;
            btn.innerText = `STARTING...`;
            updateProductionStatus(id, 'In Progress');
        }

        if (btn.classList.contains('finish-btn')) {
            const val = document.getElementById(`qty_${id}`).value;
            if (!val || val <= 0) return alert("Please enter a valid quantity produced.");
            if (confirm(`Confirming ${val} units. This will finalize the batch and update Inventory. Proceed?`)) {
                btn.disabled = true;
                btn.innerText = `SYNCING...`;
                updateProductionStatus(id, 'Completed', val);
            }
        }
    };
}

export function refreshBakerUI() {
    const container = document.getElementById('view-root'); 
    if (container) {
        container.innerHTML = renderProduction();
        bindProductionActions();
    }
}