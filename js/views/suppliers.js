// js/views/suppliers.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";

export function renderSuppliers() {
    const suppliers = Array.isArray(state.suppliers) ? state.suppliers : [];
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    const isAdmin = role === 'admin';
    const isManager = role.includes('manager');

    if (!isAdmin && !isManager) {
        return `<div style="padding:20px; color:#d32f2f; font-weight:bold;">Access Denied: Administrative privileges required.</div>`;
    }

    const headerTitle = isAdmin ? 'GLOBAL SUPPLIER DIRECTORY' : 'BRANCH SUPPLIER LIST';
    const branches = state.branches || [];

    return `
    <div id="suppliers-module-root" style="padding: 25px; animation: fadeIn 0.3s ease; color: #3e2723; font-family: 'Roboto', sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <div>
                <h2 style="color: #3e2723; margin:0; font-weight: 800;">${headerTitle}</h2>
            </div>
            ${isAdmin ? `
            <button id="addSupplierBtn" style="background: #5d4037; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 700; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                ADD NEW SUPPLIER
            </button>` : ''}
        </div>

        <div style="background: white; border-radius: 12px; border: 1px solid #e0d7d5; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                <thead style="background: #efebe9; color: #5d4037;">
                    <tr>
                        <th style="padding: 15px;">Supplier Name</th>
                        <th style="padding: 15px;">Contact & GSTIN</th>
                        <th style="padding: 15px;">Branches</th>
                        <th style="padding: 15px; text-align: center;">Status</th>
                        <th style="padding: 15px; text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${suppliers.length === 0 ? `<tr><td colspan="5" style="text-align:center; padding:50px; color:#999;">No suppliers found.</td></tr>` : 
                      suppliers.map(s => {
                        const isActive = s.is_active === true || s.is_active === 1;
                        const branchDisplay = s.branch_names && s.branch_names !== 'Global (No Branch)' 
                            ? s.branch_names 
                            : 'All Branches (Global)';
                        return `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 15px;">
                                <div style="font-weight: 800; color: #3e2723;">${s.supplier_name}</div>
                                <div style="font-size: 0.75rem; color: #999;">ID: #${s.id}</div>
                              </td>
                            <td style="padding: 15px;">
                                <div>${s.email || '---'}</div>
                                <div style="font-weight: 500;">${s.phone_number || '---'}</div>
                                <div style="font-size: 0.75rem;">GST: ${s.gstin || 'N/A'}</div>
                              </td>
                            <td style="padding: 15px;">
                                <div style="font-size:0.8rem;">${branchDisplay}</div>
                                <div style="font-size:0.7rem; color:#aaa;">City: ${s.city_name || 'Ahmedabad'}</div>
                              </td>
                            <td style="padding: 15px; text-align: center;">
                                <span style="padding: 4px 12px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; background: ${isActive ? '#e8f5e9' : '#fce8e6'}; color: ${isActive ? '#2e7d32' : '#c5221f'};">
                                    ${isActive ? 'ACTIVE' : 'BLOCKED'}
                                </span>
                              </td>
                            <td style="padding: 15px; text-align: right;">
                                <div style="display:flex; gap:12px; justify-content: flex-end;">
                                    <button class="view-sup-btn" data-id="${s.id}" style="background:none; border:none; color:#1a73e8; font-weight:700; cursor:pointer; font-size:0.8rem;">VIEW</button>
                                    ${isAdmin ? `
                                    <button class="edit-sup-btn" data-id="${s.id}" style="background:none; border:none; color:#1a73e8; font-weight:700; cursor:pointer; font-size:0.8rem;">EDIT</button>
                                    <button class="status-sup-btn" data-id="${s.id}" data-active="${isActive}" style="background:none; border:none; color:${isActive ? '#c5221f' : '#2e7d32'}; font-weight:700; cursor:pointer; font-size:0.8rem;">
                                        ${isActive ? 'BLOCK' : 'UNBLOCK'}
                                    </button>` : ''}
                                </div>
                              </td>
                        </tr>`;
                      }).join('')}
                </tbody>
            </table>
        </div>

        <div id="supModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; backdrop-filter: blur(2px);">
            <div style="background:white; padding:30px; border-radius:16px; width:550px; max-width: 90%; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                <h3 id="supModalTitle" style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 2px solid #f8f5f2; padding-bottom: 10px;">Supplier Profile</h3>
                <form id="supplierForm" style="margin-top:20px;">
                    <input type="hidden" id="editSupId">
                    <input type="hidden" id="supActionType">
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        <div style="grid-column: span 2;">
                            <label style="font-size:0.75rem; font-weight:800; color:#8d6e63;">Supplier Name *</label>
                            <input type="text" id="supName" class="sup-input" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px;">
                        </div>
                        <div>
                            <label style="font-size:0.75rem; font-weight:800; color:#8d6e63;">Phone Number *</label>
                            <input type="text" id="supPhone" class="sup-input" required placeholder="10-digit mobile" style="width:100%; padding:12px;">
                        </div>
                        <div>
                            <label style="font-size:0.75rem; font-weight:800; color:#8d6e63;">GSTIN</label>
                            <input type="text" id="supGstin" class="sup-input" placeholder="e.g. 24ABCDE1234F1Z5" style="width:100%; padding:12px;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size:0.75rem; font-weight:800; color:#8d6e63;">Email Address</label>
                            <input type="email" id="supEmail" class="sup-input" style="width:100%; padding:12px;">
                        </div>
                        <div>
                            <label style="font-size:0.75rem; font-weight:800; color:#8d6e63;">City</label>
                            <select id="supCity" class="sup-input" style="width:100%; padding:12px;">
                                <option value="1">Ahmedabad</option>
                                <option value="2">Surat</option>
                                <option value="3">Vadodara</option>
                            </select>
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size:0.75rem; font-weight:800; color:#8d6e63;">Office Address</label>
                            <textarea id="supAddress" class="sup-input" style="width:100%; padding:12px; height:60px;"></textarea>
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size:0.75rem; font-weight:800; color:#8d6e63;">Assign to Branches (select one or more)</label>
                            <div id="branchCheckboxes" style="border:1px solid #ddd; border-radius:8px; padding:12px; max-height:150px; overflow-y:auto;">
                                ${branches.map(b => `
                                    <label style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                                        <input type="checkbox" class="branch-checkbox" value="${b.id}"> ${b.branch_name}
                                    </label>
                                `).join('')}
                                <label style="display:flex; align-items:center; gap:8px;">
                                    <input type="checkbox" id="globalCheckbox" value=""> Global (All Branches)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; gap:12px; margin-top:25px;">
                        <button type="button" id="closeSupBtn" style="flex:1; padding:14px; background:#f5f5f5; color:#666; border:none; border-radius:10px; cursor:pointer;">CANCEL</button>
                        <button type="submit" id="saveSupBtn" style="flex:1; padding:14px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800;">SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}

export function bindSupplierActions() {
    const parent = document.getElementById("suppliers-module-root");
    const modal = document.getElementById("supModal");
    const form = document.getElementById("supplierForm");
    if (!parent || !modal) return;

    const setModalState = (mode, supplier = null) => {
        form.reset();
        document.getElementById("editSupId").value = supplier ? supplier.id : "";
        document.getElementById("supActionType").value = mode;
        const inputs = document.querySelectorAll(".sup-input");
        const submitBtn = document.getElementById("saveSupBtn");
        const checkboxes = document.querySelectorAll(".branch-checkbox");
        const globalCheck = document.getElementById("globalCheckbox");

        inputs.forEach(i => i.disabled = false);
        submitBtn.style.display = "block";
        checkboxes.forEach(cb => cb.checked = false);
        if (globalCheck) globalCheck.checked = false;

        if (supplier) {
            document.getElementById("supName").value = supplier.supplier_name || "";
            document.getElementById("supPhone").value = supplier.phone_number || "";
            document.getElementById("supGstin").value = supplier.gstin || "";
            document.getElementById("supEmail").value = supplier.email || "";
            document.getElementById("supAddress").value = supplier.address || "";
            document.getElementById("supCity").value = supplier.fk_city || 1;
            const assignedBranches = supplier.branch_ids || [];
            if (assignedBranches && assignedBranches.length) {
                checkboxes.forEach(cb => {
                    if (assignedBranches.some(b => String(b) === cb.value)) cb.checked = true;
                });
            } else {
                if (globalCheck) globalCheck.checked = true;
            }
        }

        if (mode === 'view') {
            document.getElementById("supModalTitle").innerText = "Vendor Details (Read-Only)";
            inputs.forEach(i => i.disabled = true);
            checkboxes.forEach(cb => cb.disabled = true);
            if (globalCheck) globalCheck.disabled = true;
            submitBtn.style.display = "none";
        } else if (mode === 'edit') {
            document.getElementById("supModalTitle").innerText = "Update Vendor Profile";
        } else {
            document.getElementById("supModalTitle").innerText = "Register New Supplier";
        }
        modal.style.display = "flex";
    };

    document.getElementById("addSupplierBtn")?.addEventListener('click', () => setModalState('add'));
    document.getElementById("closeSupBtn").onclick = () => modal.style.display = "none";

    parent.onclick = async (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;
        const supplier = state.suppliers.find(s => String(s.id) === String(id));

        if (target.classList.contains('view-sup-btn')) setModalState('view', supplier);
        if (target.classList.contains('edit-sup-btn')) setModalState('edit', supplier);

        if (target.classList.contains('status-sup-btn')) {
            const currentActive = target.dataset.active === 'true';
            if (confirm(`Confirm: ${currentActive ? 'BLOCK' : 'UNBLOCK'} this supplier?`)) {
                try {
                    await fetchData(`suppliers/${id}/`, 'PATCH', { is_active: !currentActive });
                    alert(`Supplier ${currentActive ? 'blocked' : 'unblocked'} successfully.`);
                    await refreshAndReRender();
                } catch (err) { alert("Action Failed: " + err.message); }
            }
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById("editSupId").value;
        const btn = document.getElementById("saveSupBtn");

        const phone = document.getElementById("supPhone").value.trim();
        // ✅ Trim and convert GSTIN to uppercase
        let gstin = document.getElementById("supGstin").value.trim().toUpperCase();
        // Update the input field with the uppercase value (optional, for display)
        document.getElementById("supGstin").value = gstin;

        if (!/^[6-9]\d{9}$/.test(phone)) {
            return alert("Invalid Phone: Must be 10 digits starting with 6-9.");
        }
        if (gstin && !/^24[A-Z]{5}[0-9]{4}[A-Z][0-9]Z[A-Z0-9]$/.test(gstin)) {
            return alert("Invalid GSTIN: Must be 15 characters starting with 24, followed by 5 letters, 4 digits, 1 letter, 1 digit, then 'Z', and finally 1 alphanumeric (e.g., 24ABCDE1234F1Z5).");
        }

        const selectedBranches = Array.from(document.querySelectorAll(".branch-checkbox:checked")).map(cb => parseInt(cb.value));
        const globalChecked = document.getElementById("globalCheckbox").checked;

        let branchIds = selectedBranches;
        if (globalChecked) {
            branchIds = [];
        }

        const payload = {
            supplier_name: document.getElementById("supName").value.trim(),
            phone_number: phone,
            gstin: gstin,   // already uppercase and trimmed
            email: document.getElementById("supEmail").value.trim(),
            address: document.getElementById("supAddress").value.trim() || "Ahmedabad",
            fk_city: parseInt(document.getElementById("supCity").value),
            branch_ids: branchIds,
            is_active: true
        };

        try {
            btn.disabled = true;
            btn.innerText = "SYNCHRONIZING...";
            const method = id ? 'PUT' : 'POST';
            const url = id ? `suppliers/${id}/` : `suppliers/`;
            await fetchData(url, method, payload);
            alert(`Supplier "${payload.supplier_name}" ${id ? 'updated' : 'added'} successfully.`);
            modal.style.display = "none";
            await refreshAndReRender();
        } catch (err) {
            alert("Error: " + err.message);
            btn.disabled = false;
            btn.innerText = "SAVE";
        }
    };
}

async function refreshAndReRender() {
    await refreshGlobalState();
    const root = document.getElementById("view-root");
    if (root) {
        root.innerHTML = renderSuppliers();
        bindSupplierActions();
    }
}