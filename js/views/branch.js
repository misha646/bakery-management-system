// js/views/branch.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";

/**
 * Renders the Branch Management View
 */
export function renderBranches() {
    const branches = state.branches || [];
    const userRole = (state.user?.role || state.user?.designation || '').toLowerCase();
    const isAdmin = userRole === 'admin';

    return `
        <div class="main-content bakery-theme" style="padding: 25px; background: #fdfaf9; min-height: 100vh;">
            <div class="header-flex" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 30px;">
                <div>
                    <h1 style="color: #4a3728; font-size: 2rem; font-weight: 700;">BRANCH MANAGEMENT</h1>
                    <p style="color: #8c786a;">Managing ${branches.length} active branches </p>
                </div>
                ${isAdmin ? `
                <button class="primary-brown-btn" id="addBranchBtn" style="padding: 12px 24px; background: #634832; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 10px rgba(99,72,50,0.2);">
                    + ADD NEW BRANCH
                </button>` : ''}
            </div>

            <div class="branch-grid" id="branchGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
                ${generateBranchCards(branches, isAdmin)}
            </div>

            <div id="branchModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center; backdrop-filter: blur(2px);">
                <div style="background:white; padding:30px; border-radius:12px; width:450px; max-width:90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                    <h2 id="modalTitle" style="color: #4a3728; margin-bottom:20px; border-bottom: 2px solid #f4ece7; padding-bottom: 10px;">Branch Details</h2>
                    <form id="branchForm">
                        <input type="hidden" id="m_branch_id">
                        
                        <div style="margin-bottom:15px;">
                            <label style="display:block; font-weight:700; font-size: 0.75rem; color: #8c786a; text-transform: uppercase; margin-bottom:5px;">Branch Name *</label>
                            <input type="text" id="m_branch_name" placeholder="e.g. Central Gunj" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing: border-box;">
                        </div>

                        <div style="margin-bottom:15px;">
                            <label style="display:block; font-weight:700; font-size: 0.75rem; color: #8c786a; text-transform: uppercase; margin-bottom:5px;">Address (Location) *</label>
                            <input type="text" id="m_address" placeholder="Full Street Address" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing: border-box;">
                        </div>

                        <div style="margin-bottom:15px;">
                            <label style="display:block; font-weight:700; font-size: 0.75rem; color: #8c786a; text-transform: uppercase; margin-bottom:5px;">Primary Phone *</label>
                            <input type="text" id="m_phone1" placeholder="+91 XXXXX XXXXX" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing: border-box;">
                        </div>

                        <div style="margin-bottom:20px;">
                            <label style="display:block; font-weight:700; font-size: 0.75rem; color: #8c786a; text-transform: uppercase; margin-bottom:5px;">City Assignment</label>
                            <select id="m_city" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; background: white;">
                                <option value="1">Ahmedabad</option>
                                </select>
                        </div>

                        <div style="display:flex; gap:12px; margin-top:25px;">
                            <button type="button" id="closeModal" style="flex:1; padding:14px; border:none; background:#f5f5f5; color:#666; border-radius:10px; cursor:pointer; font-weight:600;">Cancel</button>
                            <button type="submit" id="submitBranchBtn" style="flex:1; padding:14px; background:#634832; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">SAVE</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function generateBranchCards(branches, isAdmin) {
    if (!branches || branches.length === 0) return `<p style="grid-column: 1/-1; text-align:center; padding:50px; color:#8c786a; background:white; border-radius:12px; border: 1px dashed #efe3d9;">No branches found in database.</p>`;
    
    return branches.map(b => {
        const isActive = b.is_active === true || b.is_active === 1;
        const toggleBtnText = isActive ? "DISABLE" : "ENABLE";
        const toggleBtnColor = isActive ? "#e74c3c" : "#27ae60";
        
        return `
        <div class="branch-card" style="background: white; border-radius: 15px; border: 1px solid #efe3d9; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: transform 0.2s ease;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <span style="font-size: 0.7rem; color: #8c786a; background:#f4ece7; padding:4px 10px; border-radius:20px; font-weight: 700;">CODE: BRN-${b.branch_id}</span>
                <span style="color: ${isActive ? '#27ae60' : '#e74c3c'}; font-size: 0.75rem; font-weight:800; text-transform:uppercase;">
                    ● ${isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <h3 style="color: #4a3728; margin: 15px 0 5px 0; font-size: 1.25rem; font-weight: 800;">${b.name || b.branch_name || 'Unnamed Branch'}</h3>
            <p style="color: #6d5c50; font-size: 0.85rem; margin-bottom: 5px; display:flex; align-items:center; gap:5px;">
                 ${b.address || 'Address not set'}
            </p>
            <p style="color: #8c786a; font-size: 0.85rem; margin-bottom: 20px; font-weight: 500;">
                 ${b.phone_number1 || 'No Phone Registered'}
            </p>
            
            ${isAdmin ? `
            <div style="display: flex; gap: 10px; border-top: 1px solid #f4ece7; padding-top:15px;">
                <button class="edit-branch-btn" data-id="${b.id || b.branch_id}" style="flex:1; padding:10px; cursor:pointer; background:#f4ece7; border:none; border-radius:8px; color:#634832; font-weight:700; font-size:0.8rem;">Edit</button>
                <button class="toggle-branch-btn" data-id="${b.id || b.branch_id}" data-active="${isActive}" style="padding:10px; cursor:pointer; background:#fff1f0; border:none; border-radius:8px; color:${toggleBtnColor}; font-weight:700; font-size:0.8rem;">${toggleBtnText}</button>
            </div>
            ` : ''}
        </div>
    `}).join('');
}

export function bindBranchActions() {
    const modal = document.getElementById('branchModal');
    const branchForm = document.getElementById('branchForm');
    const root = document.getElementById("view-root");
    if (!root) return;

    // Handle New Branch Modal
    const addBranchBtn = document.getElementById('addBranchBtn');
    if (addBranchBtn) {
        addBranchBtn.onclick = () => {
            branchForm.reset();
            document.getElementById('modalTitle').textContent = "Add New Branch";
            document.getElementById('m_branch_id').value = "";
            modal.style.display = 'flex';
        };
    }

    // Modal Close
    const closeBtn = document.getElementById('closeModal');
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';

    // Click delegation for Edit/Toggle
    document.addEventListener('click', async (e) => {
        const target = e.target;
        
        // Edit Logic
        if (target.classList.contains('edit-branch-btn')) {
            const id = target.dataset.id;
            const branch = state.branches.find(b => (b.id || b.branch_id) == id);
            if (branch) {
                document.getElementById('modalTitle').textContent = "Edit Branch Location";
                document.getElementById('m_branch_id').value = branch.id || branch.branch_id;
                document.getElementById('m_branch_name').value = branch.name || branch.branch_name || "";
                document.getElementById('m_address').value = branch.address || "";
                document.getElementById('m_phone1').value = branch.phone_number1 || "";
                document.getElementById('m_city').value = branch.fk_city || "1";
                modal.style.display = 'flex';
            }
        }

        // Toggle Active Status Logic
        if (target.classList.contains('toggle-branch-btn')) {
            const id = target.dataset.id;
            const branch = state.branches.find(b => (b.id || b.branch_id) == id);
            if (branch) {
                const newStatus = !(branch.is_active === true || branch.is_active === 1);
                const action = newStatus ? "enable" : "disable";
                if (confirm(`Are you sure you want to ${action} this branch?`)) {
                    try {
                        await fetchData(`branches/${id}/`, 'PATCH', { is_active: newStatus });
                        await updateUI();
                    } catch (err) { alert("Failed to update branch status: " + err.message); }
                }
            }
        }
    }, { once: false });

    // Form Submit
    branchForm.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('m_branch_id').value;
        const submitBtn = document.getElementById('submitBranchBtn');
        
        const payload = {
            branch_name: document.getElementById('m_branch_name').value,
            address: document.getElementById('m_address').value,
            phone_number1: document.getElementById('m_phone1').value,
            fk_city: document.getElementById('m_city').value,
            is_active: true
        };

        try {
            submitBtn.disabled = true;
            submitBtn.innerText = "Syncing...";

            const method = id ? 'PUT' : 'POST';
            const url = id ? `branches/${id}/` : `branches/`;
            
            await fetchData(url, method, payload);
            modal.style.display = 'none';
            
            await updateUI();
            alert(id ? "Branch details updated !" : "New branch successfully opened !");
        } catch (err) { 
            alert(" Sync Error: " + err.message); 
            submitBtn.disabled = false;
            submitBtn.innerText = "SAVE";
        }
    };

    async function updateUI() {
        await refreshGlobalState();
        root.innerHTML = renderBranches();
        bindBranchActions(); 
    }
}