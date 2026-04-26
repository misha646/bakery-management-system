// js/views/productionPlanning.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData, deleteData } from "../api.js";

/* =====================================================
    1. UI RENDERER (Planning Dashboard)
   ===================================================== */
export function renderProductionPlanning() {
    const plans = state.production_plans || []; 
    const products = state.products || [];
    const users = state.users || [];
    
    const userBranchId = String(state.user?.fk_branch_id || state.user?.fk_branch || state.user?.branch_id || '');
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();

    const isAdmin = role === 'admin';
    const isManager = role.includes('manager');
    const canPlan = isAdmin || isManager;

    const displayPlans = isAdmin 
        ? plans 
        : isManager
            ? plans.filter(p => String(p.fk_branch_id || p.fk_branch) === userBranchId)
            : plans.filter(p => String(p.fk_assigned_to) === String(state.user.id));

    return `
    <div class="main-content bakery-theme" style="padding:25px; background:#fdfaf9; min-height:100vh; animation: fadeIn 0.3s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <div>
                <h2 style="color:#3e2723; margin:0; font-weight:800;">PRODUCTION PLANNING</h2>
                <p style="color:#8d6e63; margin:5px 0 0 0; font-size:0.9rem;">Schedule and manage branch production batches</p>
            </div>
            ${canPlan ? `
                <button id="btnNewPlan" style="padding:12px 24px; background:#5d4037; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:700; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    SCHEDULE NEW BATCH
                </button>
            ` : ''}
        </div>

        <div style="background:white; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.05); overflow:hidden; border: 1px solid #e0d7d5;">
            <table style="width:100%; border-collapse:collapse;">
                <thead style="background:#efebe9; color: #5d4037;">
                    <tr>
                        <th style="padding:15px; text-align:left; font-size:0.7rem; text-transform:uppercase; letter-spacing:1px;">Timeline</th>
                        <th style="padding:15px; text-align:left; font-size:0.7rem; text-transform:uppercase; letter-spacing:1px;">Product</th>
                        <th style="padding:15px; text-align:left; font-size:0.7rem; text-transform:uppercase; letter-spacing:1px;">Assigned To</th>
                        <th style="padding:15px; text-align:center; font-size:0.7rem; text-transform:uppercase; letter-spacing:1px;">Management Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${displayPlans.length === 0 ? '<tr><td colspan="4" style="padding:60px; text-align:center; color:#999;">No plans found in records for this scope.纽约</td>' : 
                        displayPlans.map(p => `
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:15px;">
                                <div style="font-size:0.85rem; font-weight:800; color:#3e2723;">${p.plan_start_date}</div>
                                <div style="font-size:0.7rem; color:#8d6e63; font-weight:600;">Due: ${p.plan_end_date}</div>
                            </td>
                            <td style="padding:15px; font-weight:700; color:#3e2723;">${p.product_name}</td>
                            <td style="padding:15px;">
                                <div style="font-size:0.85rem; color:#5d4037; font-weight:700;">${p.assigned_user_name || 'Unassigned'}</div>
                                <div style="font-size:0.65rem; color:#aaa; font-weight:800;">${p.branch_name}</div>
                            </td>
                            <td style="padding:15px; text-align:center;">
                                <div style="display:flex; gap:8px; justify-content:center;">
                                    <button class="view-plan-btn" data-id="${p.id}" style="background:#efebe9; color:#5d4037; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.7rem; font-weight:800;">VIEW</button>
                                    <button class="recipe-btn" data-id="${p.id}" style="background:#fff3e0; color:#e65100; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.7rem; font-weight:800;">RECIPE</button>
                                    ${canPlan ? `
                                        <button class="edit-plan-btn" data-id="${p.id}" style="background:#e3f2fd; color:#1565c0; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.7rem; font-weight:800;">EDIT</button>
                                        <button class="del-plan-btn" data-id="${p.id}" style="background:#ffebee; color:#c62828; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-size:0.7rem; font-weight:800;">DEL</button>
                                    ` : ''}
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div id="planModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; justify-content:center; align-items:center; backdrop-filter: blur(2px);">
            <div style="background:white; padding:30px; border-radius:16px; width:450px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                <h3 id="modalTitle" style="margin-top:0; color:#3e2723; border-bottom: 2px solid #f8f5f2; padding-bottom:10px; font-weight:800;">Schedule Production</h3>
                <form id="planForm" style="margin-top:20px;">
                    <input type="hidden" id="editPlanId">
                    
                    <label style="display:block; margin-bottom:5px; font-size:0.7rem; font-weight:800; color:#8d6e63;">PRODUCT</label>
                    <select id="p_product" required style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px; background:white;">
                        ${products.map(pr => `<option value="${pr.id}">${pr.product_name}</option>`).join('')}
                    </select>

                    <label style="display:block; margin-bottom:5px; font-size:0.7rem; font-weight:800; color:#8d6e63;">ASSIGN STAFF (AUTO-SELECTS BRANCH)</label>
                    <select id="p_assigned_to" required style="width:100%; padding:12px; margin-bottom:15px; border:1px solid #ddd; border-radius:8px; background:white;">
                        <option value="">-- Select Staff Member --</option>
                        ${users
                            .filter(u => ['baker', 'service truck'].includes((u.role || u.designation || '').toLowerCase()))
                            .map(u => `<option value="${u.id}">${u.fullName || u.user_name}</option>`).join('')}
                    </select>

                    <div style="display:flex; gap:12px;">
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:0.7rem; font-weight:800; color:#8d6e63;">START DATE</label>
                            <input type="date" id="p_start_date" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-bottom:15px;">
                        </div>
                        <div style="flex:1;">
                            <label style="display:block; margin-bottom:5px; font-size:0.7rem; font-weight:800; color:#8d6e63;">DUE DATE</label>
                            <input type="date" id="p_end_date" required style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-bottom:15px;">
                        </div>
                    </div>

                    <label style="display:block; margin-bottom:5px; font-size:0.7rem; font-weight:800; color:#8d6e63;">TARGET QUANTITY</label>
                    <input type="number" id="p_qty" required style="width:100%; padding:12px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px; font-weight:700;">
                    
                    <div style="display:flex; gap:12px;">
                        <button type="button" id="btnCancel" style="flex:1; padding:12px; border:none; background:#f5f5f5; border-radius:10px; cursor:pointer; font-weight:700; color:#666;">CANCEL</button>
                        <button type="submit" id="btnSavePlan" style="flex:1; padding:12px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800;">SAVE PLAN</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="infoModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1001; justify-content:center; align-items:center; backdrop-filter: blur(2px);">
            <div style="background:white; padding:30px; border-radius:16px; width:500px; max-height:80vh; overflow-y:auto;">
                <div id="infoContent"></div>
                <div style="display:flex; justify-content:flex-end; margin-top:25px; border-top: 1px solid #eee; padding-top:20px;">
                    <button id="btnCloseInfo" style="padding:12px 30px; border:none; background:#5d4037; color:white; border-radius:10px; cursor:pointer; font-weight:800;">CLOSE</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

/* =====================================================
    2. EVENT BINDINGS
   ===================================================== */
export function bindProductionPlanningActions() {
    const planModal = document.getElementById('planModal');
    const infoModal = document.getElementById('infoModal');
    const planForm = document.getElementById('planForm');

    document.getElementById('btnNewPlan')?.addEventListener('click', () => {
        planForm.reset();
        document.getElementById('editPlanId').value = "";
        document.getElementById('modalTitle').innerText = "Schedule New Production";
        planModal.style.display = 'flex';
    });
    
    document.getElementById('btnCancel')?.addEventListener('click', () => planModal.style.display = 'none');
    document.getElementById('btnCloseInfo')?.addEventListener('click', () => infoModal.style.display = 'none');

    document.querySelector('.main-content').onclick = async (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;

        const plan = state.production_plans.find(p => String(p.id) === String(id));
        if (!plan) return;

        if (target.classList.contains('del-plan-btn')) {
            if (confirm("Permanently delete this production plan from Records?")) {
                try {
                    await deleteData(`production-plan/${id}`);
                    alert("Production plan deleted successfully.");
                    await refreshAndReRender();
                } catch (err) { alert(err.message); }
            }
        }

        if (target.classList.contains('edit-plan-btn')) {
            document.getElementById('editPlanId').value = plan.id;
            document.getElementById('p_product').value = plan.fk_product;
            document.getElementById('p_assigned_to').value = plan.fk_assigned_to;
            document.getElementById('p_start_date').value = plan.plan_start_date;
            document.getElementById('p_end_date').value = plan.plan_end_date;
            document.getElementById('p_qty').value = plan.planned_quantity;
            document.getElementById('modalTitle').innerText = "Update Plan #" + plan.id;
            planModal.style.display = 'flex';
        }

        if (target.classList.contains('view-plan-btn')) {
            document.getElementById('infoContent').innerHTML = `
                <h3 style="color:#3e2723; margin:0 0 15px 0;">Batch #${plan.id} Details</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; background:#f8f5f2; padding:20px; border-radius:12px;">
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">STATUS</small><br><strong>${plan.plan_status}</strong></div>
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">TARGET</small><br><strong>${parseFloat(plan.planned_quantity).toFixed(0)} PCS</strong></div>
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">PRODUCT</small><br><strong>${plan.product_name}</strong></div>
                    <div><small style="color:#8d6e63; font-weight:800; text-transform:uppercase;">STAFF</small><br><strong>${plan.assigned_user_name}</strong></div>
                </div>
            `;
            infoModal.style.display = 'flex';
        }

        if (target.classList.contains('recipe-btn')) {
            const product = state.products.find(pr => String(pr.id) === String(plan.fk_product));
            document.getElementById('infoContent').innerHTML = `
                <h3 style="color:#3e2723; margin:0 0 10px 0;">Recipe: ${plan.product_name}</h3>
                <div style="background:#fff9f0; padding:20px; border-radius:12px; border-left:6px solid #d2691e; white-space: pre-wrap; font-size:0.9rem; line-height:1.6; color:#3e2723;">
                    ${product?.recipe_instructions || "No recipe instructions found."}
                </div>
            `;
            infoModal.style.display = 'flex';
        }
    };

    planForm.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('editPlanId').value;
        const btn = document.getElementById('btnSavePlan');
        const assignedUserId = document.getElementById('p_assigned_to').value;

        const assignedUser = state.users.find(u => String(u.id) === String(assignedUserId));
        if (!assignedUser) return alert("Assignment error: User not found in system.");

        const payload = {
            fk_product: document.getElementById('p_product').value,
            fk_assigned_to: assignedUserId,
            planned_quantity: document.getElementById('p_qty').value,
            plan_start_date: document.getElementById('p_start_date').value,
            plan_end_date: document.getElementById('p_end_date').value,
            fk_branch: assignedUser.fk_branch_id || assignedUser.fk_branch || 1
        };

        try {
            btn.disabled = true;
            btn.innerText = "SYNCING...";
            const method = id ? 'PATCH' : 'POST';
            const url = id ? `production-plan/${id}/` : 'production-plan/';
            
            await fetchData(url, method, payload);
            alert(`Production plan ${id ? 'updated' : 'created'} successfully.`);
            planModal.style.display = 'none';
            await refreshAndReRender();
        } catch (err) {
            alert("Error: " + err.message);
            btn.disabled = false;
            btn.innerText = "SAVE PLAN";
        }
    };
}

async function refreshAndReRender() {
    await refreshGlobalState();
    const root = document.getElementById('view-root');
    if(root) {
        root.innerHTML = renderProductionPlanning();
        bindProductionPlanningActions();
    }
}