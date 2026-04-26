// js/views/customers.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";

/* =====================================================
    1. CORE LOGIC & ACCESS CONTROL
   ===================================================== */

function getCustomerAccess() {
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    
    return {
        role,
        isAdmin: role === 'admin',
        isManager: role.includes('manager'),
        isStaff: ['staff', 'cashier', 'sales', 'service staff', 'service_staff'].includes(role),
        isBaker: role === 'baker'
    };
}

/* =====================================================
    2. API ACTIONS (Sync with MySQL)
   ===================================================== */

export async function saveCustomer(customerId, updatedData) {
    const { isStaff } = getCustomerAccess();
    
    // Only staff can save changes to customer profiles (edit only, not create)
    if (!isStaff) {
        return alert("Access Denied: Only sales staff can modify customer data.");
    }

    try {
        const url = customerId ? `customers/${customerId}/` : `customers/`;
        const method = customerId ? 'PATCH' : 'POST';
        
        const payload = {
            customer_name: updatedData.name, 
            customer_phone: updatedData.phone,
            // Branch is not allowed to be changed; if creating (should not happen), use current user's branch
            fk_branch: updatedData.branchId || state.user?.fk_branch || state.user?.fk_branch_id || 1
        };

        await fetchData(url, method, payload);
        alert(`Customer details Updated successfully!`);
        
        await refreshGlobalState();
        refreshCustomerUI();
    } catch (err) {
        alert("Sync Failed: " + err.message);
    }
}

/* =====================================================
    3. UI RENDERERS
   ===================================================== */

export function renderCustomers() {
    const { isBaker, isAdmin, isManager, isStaff } = getCustomerAccess();

    if (isBaker) {
        return `<div style="padding:50px; text-align:center; color:#721c24; background:#fff5f5; border-radius:12px; margin:20px; border:1px solid #f5c6cb;">
                    <h2 style="margin:0;">🚫 Access Denied</h2>
                    <p>Production staff do not have access to the Customer Directory.</p>
                </div>`;
    }

    // No "Add New Customer" button – customers are created only via POS
    const branches = state.branches || [];
    const totalCustomers = (state.customers || []).length;

    // For admin, show branch filter; for manager, no filter (they already see only their branch)
    let branchFilterHtml = '';
    if (isAdmin) {
        branchFilterHtml = `
            <div style="flex:1;">
                <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Filter by Branch</label>
                <select id="branchFilter" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
                    <option value="All">All Branches</option>
                    ${branches.map(b => `<option value="${b.id}">${b.branch_name}</option>`).join('')}
                </select>
            </div>
        `;
    }

    return `
        <div style="padding: 25px; background: #fdfaf9; min-height: 100vh; animation: fadeIn 0.3s ease;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                <div>
                    <h1 style="margin:0; font-size:1.8rem; color:#3e2723; font-weight:800;">Customer Directory</h1>
                    <p style="margin:5px 0 0 0; color:#8d6e63;">
                        ${isAdmin ? '<b>Global View:</b> All Branch Records' : `<b>Branch Scope:</b> ${state.user?.branch_name || 'Active Branch'}`}
                        &nbsp;| Total: ${totalCustomers} customers
                    </p>
                </div>
                <!-- No "Add New Customer" button – manual creation removed -->
            </div>

            <div style="background:#fff; padding:15px; border-radius:12px; border: 1px solid #e0d7d5; margin-bottom:25px; display:flex; gap:15px; align-items:flex-end;">
                <div style="flex:2;">
                    <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Search</label>
                    <input type="text" id="custSearch" 
                           placeholder="By name or contact number..." 
                           style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; outline:none;">
                </div>
                ${branchFilterHtml}
            </div>

            <div style="background:#fff; border:1px solid #e0d7d5; border-radius:12px; overflow:hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <table style="width:100%; border-collapse:collapse;">
                    <thead style="background:#5d4037; color:white;">
                        <tr>
                            <th style="padding:18px; text-align:left; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">ID</th>
                            <th style="padding:18px; text-align:left; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">Customer Information</th>
                            <th style="padding:18px; text-align:left; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">Assigned Branch</th>
                            <th style="padding:18px; text-align:center; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">Management</th>
                        </tr>
                    </thead>
                    <tbody id="customerTableBody">
                        ${renderCustomerRows(state.customers || [])}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Edit Modal (only for staff, no branch selection) -->
        <div id="customerModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; backdrop-filter: blur(2px);">
            <div style="background:#fff; width:450px; padding:30px; border-radius:16px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                <h3 id="modalTitle" style="margin:0 0 20px 0; color:#3e2723; font-weight:800; border-bottom: 2px solid #f8f5f2; padding-bottom:10px;">Edit Customer</h3>
                <input type="hidden" id="m_cust_id">
                
                <div style="margin-bottom:15px;">
                    <label style="display:block; margin-bottom:5px; font-weight:800; color:#8d6e63; font-size:0.75rem;">FULL NAME</label>
                    <input type="text" id="m_cust_name" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; outline:none;">
                </div>
                
                <div style="margin-bottom:20px;">
                    <label style="display:block; margin-bottom:5px; font-weight:800; color:#8d6e63; font-size:0.75rem;">PHONE NUMBER</label>
                    <input type="text" id="m_cust_phone" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; outline:none;">
                </div>

                <!-- No branch selection – branch is read-only and inherited from the customer record -->

                <div style="display:flex; gap:12px;">
                    <button type="button" id="btnCancelModal" style="flex:1; padding:12px; cursor:pointer; background:#f5f5f5; border:none; border-radius:10px; font-weight:600; color:#666;">Cancel</button>
                    <button type="button" id="btnSubmitCustomer" style="flex:1; background:#2e7d32; color:#fff; border:none; padding:12px; border-radius:10px; cursor:pointer; font-weight:800; text-transform:uppercase;">Save Changes</button>
                </div>
            </div>
        </div>

        <!-- Read‑only view modal for admin/manager -->
        <div id="viewCustomerModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; backdrop-filter: blur(2px);">
            <div style="background:#fff; width:450px; padding:30px; border-radius:16px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                <h3 style="margin:0 0 20px 0; color:#3e2723; font-weight:800; border-bottom: 2px solid #f8f5f2; padding-bottom:10px;">Customer Details</h3>
                <div id="viewCustomerContent"></div>
                <div style="margin-top:20px;">
                    <button type="button" id="closeViewModal" style="width:100%; padding:12px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800;">Close</button>
                </div>
            </div>
        </div>
    `;
}

function renderCustomerRows(customers) {
    const { isStaff, isAdmin, isManager } = getCustomerAccess();
    const canEdit = isStaff;   // only staff can edit
    const canView = isAdmin || isManager;  // admin/manager can view details

    if (!customers || customers.length === 0) {
        return `<tr><td colspan="4" style="padding:60px; text-align:center; color:#999; font-style:italic;">No registered customers found.</tr>`;
    }

    return customers.map(c => {
        const displayName = c.name || c.customer_name || 'Unknown';
        const displayPhone = c.customer_phone || c.phone || 'N/A';
        const branchDisplay = c.branch_name || `Branch ${c.fk_branch}`;

        return `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:18px; color: #a1887f; font-family: monospace; font-weight:bold;">#${c.id}</td>
            <td style="padding:18px;">
                <div style="font-weight:800; color:#3e2723;">${displayName}</div>
                <div style="font-size:0.8rem; color:#8d6e63; font-weight:600;">${displayPhone}</div>
            </td>
            <td style="padding:18px;">
                <span style="background:#efebe9; padding:4px 10px; border-radius:20px; font-size:0.8rem; font-weight:600; color:#5d4037;">${branchDisplay}</span>
            </td>
            <td style="padding:18px; text-align:center;">
                ${canEdit ? 
                    `<button class="edit-cust-btn" data-id="${c.id}" style="cursor:pointer; background:white; border:1px solid #5d4037; color:#5d4037; padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.75rem;">Edit</button>` : 
                    (canView ? `<button class="view-cust-btn" data-id="${c.id}" style="cursor:pointer; background:white; border:1px solid #5d4037; color:#5d4037; padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.75rem;">View</button>` : 
                    `<span style="color:#bdbdbd; font-size:0.7rem; font-weight:bold; text-transform:uppercase; background:#f5f5f5; padding:4px 12px; border-radius:4px;">View Only</span>`)}
            </td>
        </tr>`;
    }).join('');
}

/* =====================================================
    4. EVENT BINDINGS
   ===================================================== */

export function bindCustomerActions() {
    const modal = document.getElementById('customerModal');
    const viewModal = document.getElementById('viewCustomerModal');
    const searchInput = document.getElementById('custSearch');
    const branchFilter = document.getElementById('branchFilter');
    const { isStaff } = getCustomerAccess();

    // Filter function
    function applyFilters() {
        let filtered = [...(state.customers || [])];
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        if (searchTerm) {
            filtered = filtered.filter(c => {
                const name = (c.name || c.customer_name || "").toLowerCase();
                const phone = (c.customer_phone || c.phone || "");
                return name.includes(searchTerm) || phone.includes(searchTerm);
            });
        }
        if (branchFilter && branchFilter.value !== 'All') {
            const branchId = parseInt(branchFilter.value);
            filtered = filtered.filter(c => c.fk_branch === branchId);
        }
        const tableBody = document.getElementById('customerTableBody');
        if (tableBody) tableBody.innerHTML = renderCustomerRows(filtered);
    }

    if (searchInput) searchInput.oninput = applyFilters;
    if (branchFilter) branchFilter.onchange = applyFilters;

    // No "Add New Customer" button – removed

    // Modal Controls for edit modal
    document.getElementById('btnCancelModal')?.addEventListener('click', () => modal.style.display = 'none');
    document.getElementById('btnSubmitCustomer')?.addEventListener('click', async () => {
        if (!isStaff) return alert("You are not authorized to modify customers.");
        const id = document.getElementById('m_cust_id').value;
        const data = {
            name: document.getElementById('m_cust_name').value.trim(),
            phone: document.getElementById('m_cust_phone').value.trim(),
            branchId: null  // Branch is not changed
        };

        if (!data.name || !data.phone) return alert("Validation Error: Please fill both Name and Phone fields.");
        
        await saveCustomer(id, data);
        modal.style.display = 'none';
        applyFilters();
    });

    // Row Edit Trigger (only for staff)
    const tableBody = document.getElementById('customerTableBody');
    if (tableBody) {
        tableBody.onclick = (e) => {
            const target = e.target;
            const id = target.dataset.id;
            if (!id) return;
            const cust = state.customers.find(c => String(c.id) === String(id));
            if (!cust) return;

            // Edit for staff
            if (target.classList.contains('edit-cust-btn') && isStaff) {
                document.getElementById('modalTitle').innerText = "Edit Customer";
                document.getElementById('m_cust_id').value = cust.id;
                document.getElementById('m_cust_name').value = cust.name || cust.customer_name || "";
                document.getElementById('m_cust_phone').value = cust.customer_phone || cust.phone || "";
                modal.style.display = 'flex';
            }
            
            // View for admin/manager
            if (target.classList.contains('view-cust-btn')) {
                const contentDiv = document.getElementById('viewCustomerContent');
                if (contentDiv) {
                    contentDiv.innerHTML = `
                        <div style="margin-bottom:15px;">
                            <label style="font-weight:800; color:#8d6e63; font-size:0.75rem;">Full Name</label>
                            <p style="margin:5px 0; font-size:1rem;">${cust.name || cust.customer_name || 'Unknown'}</p>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="font-weight:800; color:#8d6e63; font-size:0.75rem;">Phone Number</label>
                            <p style="margin:5px 0; font-size:1rem;">${cust.customer_phone || cust.phone || 'N/A'}</p>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="font-weight:800; color:#8d6e63; font-size:0.75rem;">Assigned Branch</label>
                            <p style="margin:5px 0; font-size:1rem;">${cust.branch_name || `Branch ${cust.fk_branch}`}</p>
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="font-weight:800; color:#8d6e63; font-size:0.75rem;">Customer ID</label>
                            <p style="margin:5px 0; font-size:1rem;">#${cust.id}</p>
                        </div>
                    `;
                }
                viewModal.style.display = 'flex';
            }
        };
    }

    // Close view modal
    document.getElementById('closeViewModal')?.addEventListener('click', () => {
        viewModal.style.display = 'none';
    });

    // Initial filter
    applyFilters();
}

function refreshCustomerUI() {
    const tableBody = document.getElementById('customerTableBody');
    if (tableBody) {
        tableBody.innerHTML = renderCustomerRows(state.customers || []);
    }
}