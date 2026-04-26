// js/views/users.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";

/* =====================================================
    1. MAIN RENDER FUNCTION 
   ===================================================== */
export function renderUsers() {
    const currentUser = state.user || {};
    const userRole = (currentUser.role || currentUser.designation || 'staff').toLowerCase();
    const isAdmin = userRole === 'admin';
    const isManager = userRole === 'branch manager';
    
    if (!isAdmin && !isManager) {
        return `<div style="padding:20px; color:#d32f2f; font-weight:bold;">Access Denied: Administrative privileges required.</div>`;
    }

    const myBranchId = currentUser.fk_branch || currentUser.fk_branch_id;
    let displayUsers = Array.isArray(state.users) ? state.users : [];
    
    if (isManager && !isAdmin) {
        displayUsers = displayUsers.filter(u => String(u.fk_branch || u.fk_branch_id) === String(myBranchId));
    }

    const headerTitle = isAdmin ? 'GLOBAL STAFF DIRECTORY' : 'BRANCH STAFF LIST';

    return `
        <div id="users-parent-el" style="padding: 10px; animation: fadeIn 0.3s ease-in; color: #3e2723; font-family: 'Roboto', sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                <div>
                    <h2 style="margin:0; font-weight: 800;">${headerTitle}</h2>
                </div>
                ${isAdmin || isManager ? `
                <button id="addStaffBtn" style="background: #5d4037; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    ADD NEW STAFF
                </button>` : ''}
            </div>

            <div style="background: white; border-radius: 12px; border: 1px solid #e0d7d5; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <table style="width:100%; border-collapse:collapse; text-align: left; font-size: 0.9rem;">
                    <thead style="background:#efebe9; color:#5d4037;">
                        <tr>
                            <th style="padding:15px; font-weight: 700;">Staff Member</th>
                            <th style="padding:15px; font-weight: 700;">Contact Details</th>
                            <th style="padding:15px; font-weight: 700;">Designation</th>
                            ${isAdmin ? '<th style="padding:15px; font-weight: 700;">Branch</th>' : ''}
                            <th style="padding:15px; text-align:center; font-weight: 700;">Status</th>
                            <th style="padding:15px; text-align:right; font-weight: 700;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody">
                        ${generateRows(displayUsers, isAdmin, isManager)}
                    </tbody>
                </table>
            </div>
            
            <div id="staffModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; backdrop-filter: blur(2px);">
                <div style="background:white; padding:30px; border-radius:15px; width:500px; max-width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                    <h3 id="modalHeader" style="color:#3e2723; margin-top:0; border-bottom: 2px solid #f8f5f2; padding-bottom: 10px;">Staff Profile</h3>
                    <form id="staffForm" style="margin-top:20px;">
                        <input type="hidden" id="editId">
                        <input type="hidden" id="actionType">
                        
                        <div id="modalFields" style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div style="grid-column: span 2;">
                                <label style="display:block; font-size:0.75rem; font-weight:700; color:#8d6e63; text-transform:uppercase; margin-bottom:5px;">User Name (Login ID) *</label>
                                <input type="text" id="f_user" class="m-input" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing: border-box;" required>
                            </div>
                            <div>
                                <label style="display:block; font-size:0.75rem; font-weight:700; color:#8d6e63; text-transform:uppercase; margin-bottom:5px;">Designation</label>
                                <select id="f_role" class="m-input" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; background:white; box-sizing: border-box;">
                                    <option value="service staff">Sales Staff</option>
                                    <option value="baker">Baker</option>
                                    <option value="branch manager">Manager</option>
                                    ${isAdmin ? '<option value="admin">Admin</option>' : ''}
                                </select>
                            </div>
                            <div>
                                <label style="display:block; font-size:0.75rem; font-weight:700; color:#8d6e63; text-transform:uppercase; margin-bottom:5px;">Branch</label>
                                <select id="f_branch" class="m-input" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; background:white; box-sizing: border-box;" required ${!isAdmin ? 'disabled' : ''}>
                                    ${(state.branches || []).map(b => `<option value="${b.id || b.branch_id}">${b.branch_name || b.name}</option>`).join('')}
                                </select>
                            </div>
                            <div style="grid-column: span 2;">
                                <label style="display:block; font-size:0.75rem; font-weight:700; color:#8d6e63; text-transform:uppercase; margin-bottom:5px;">Email Address</label>
                                <input type="email" id="f_email" class="m-input" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing: border-box;">
                            </div>
                            <div style="grid-column: span 2;">
                                <label style="display:block; font-size:0.75rem; font-weight:700; color:#8d6e63; text-transform:uppercase; margin-bottom:5px;">Phone Number</label>
                                <input type="text" id="f_phone" class="m-input" placeholder="Phone number" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing: border-box;">
                            </div>
                        </div>

                        <div id="verifySection" style="display:none; margin-top:20px; padding:15px; background:#fff9f9; border:1px solid #ffdada; border-radius:10px;">
                            <p style="margin:0 0 10px; font-size:0.75rem; font-weight:700; color:#d32f2f;">ADMINISTRATOR VERIFICATION REQUIRED</p>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <input type="password" id="v_pass" placeholder="Your Password" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px;">
                                <input type="text" id="v_key" placeholder="Security Key" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px;">
                            </div>
                        </div>

                        <div style="margin-top:30px; display:flex; gap:12px;">
                            <button type="button" id="closeModalBtn" style="flex:1; padding:14px; background:#f5f5f5; border:none; border-radius:10px; cursor:pointer; font-weight:600;">CANCEL</button>
                            <button type="submit" id="submitBtn" style="flex:1; padding:14px; background:#5d4037; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">CONFIRM</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function generateRows(users, isAdmin, isManager) {
    if (users.length === 0) return `<tr><td colspan="${isAdmin ? 6 : 5}" style="padding:40px; text-align:center; color:#999;">No staff members registered.</td></tr>`;

    return users.map(u => {
        const isActive = u.is_active === true || u.is_active === 1;
        const showActions = isAdmin || isManager;
        return `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding:15px; vertical-align: middle;">
                <div style="font-weight:700; color:#3e2723;">${u.user_name}</div>
                <div style="font-size:0.75rem; color:#999;">ID: ${u.id || u.user_id}</div>
            </td>
            <td style="padding:15px; vertical-align: middle;">
                <div style="color:#5d4037;">${u.email || '---'}</div>
                <div style="color:#8d6e63; font-weight:500;">${u.phone || u.phone_number || '---'}</div>
             </td>
            <td style="padding:15px; vertical-align: middle;">
                <span style="background:#efebe9; padding:4px 10px; border-radius:6px; font-size:0.7rem; font-weight:800; color:#5d4037; text-transform:uppercase;">${u.role || u.designation}</span>
             </td>
            ${isAdmin ? `<td style="padding:15px; vertical-align: middle; color:#5d4037;">${u.branch_name || 'Global Operations'}</td>` : ''}
            <td style="padding:15px; text-align:center; vertical-align: middle;">
                <span style="padding:4px 12px; border-radius:12px; font-size:0.75rem; font-weight:700; background: ${isActive ? '#e8f5e9' : '#fce8e6'}; color: ${isActive ? '#2e7d32' : '#c5221f'};">
                    ${isActive ? 'ACTIVE' : 'BLOCKED'}
                </span>
             </td>
            <td style="padding:15px; text-align:right; vertical-align: middle;">
                <div style="display:flex; gap:12px; justify-content: flex-end;">
                    <button class="view-btn" data-id="${u.id || u.user_id}" style="background:none; border:none; color:#1a73e8; font-weight:700; cursor:pointer; font-size:0.8rem;">VIEW</button>
                    ${showActions ? `
                    <button class="edit-btn" data-id="${u.id || u.user_id}" style="background:none; border:none; color:#1a73e8; font-weight:700; cursor:pointer; font-size:0.8rem;">EDIT</button>
                    <button class="status-btn" data-id="${u.id || u.user_id}" data-active="${isActive}" style="background:none; border:none; color:${isActive ? '#c5221f' : '#2e7d32'}; font-weight:700; cursor:pointer; font-size:0.8rem;">
                        ${isActive ? 'BLOCK' : 'UNBLOCK'}
                    </button>` : ''}
                </div>
             </td>
        </tr>`;
    }).join("");
}

function showUserFriendlyError(err) {
    let msg = err.message || '';
    if (msg.includes("phone") && msg.includes("blank")) {
        alert("Phone number cannot be empty. Please provide a phone number.");
    } else if (msg.includes("email") && (msg.includes("invalid") || msg.includes("valid"))) {
        alert("Email address is invalid. Please enter a valid email address (e.g., name@example.com).");
    } else if (msg.includes("user_name") && msg.includes("required")) {
        alert("Username is required.");
    } else if (msg.includes("Security Key") || msg.includes("security_key")) {
        alert("Invalid security key. Please check and try again.");
    } else if (msg.includes("password") && msg.includes("match")) {
        alert("Password verification failed. Please check your credentials.");
    } else {
        alert("Operation failed: " + msg);
    }
}

export function bindUserActions() {
    const parent = document.getElementById("users-parent-el");
    const modal = document.getElementById("staffModal");
    const form = document.getElementById("staffForm");
    if (!parent || !modal) return;

    const currentUser = state.user || {};
    const isAdmin = (currentUser.role || currentUser.designation || '').toLowerCase() === 'admin';
    const isManager = (currentUser.role || currentUser.designation || '').toLowerCase() === 'branch manager';
    const myBranchId = currentUser.fk_branch || currentUser.fk_branch_id;

    const setupModal = (mode, user = null) => {
        form.reset();
        document.getElementById("editId").value = user ? (user.id || user.user_id) : "";
        document.getElementById("actionType").value = mode;
        const inputs = document.querySelectorAll(".m-input");
        const verifySection = document.getElementById("verifySection");
        const submitBtn = document.getElementById("submitBtn");
        const branchSelect = document.getElementById("f_branch");

        verifySection.style.display = "none";
        inputs.forEach(i => i.disabled = false);
        submitBtn.style.display = "block";

        if (user) {
            document.getElementById("f_user").value = user.user_name || "";
            document.getElementById("f_role").value = (user.designation || user.role || "").toLowerCase();
            document.getElementById("f_branch").value = user.fk_branch || user.fk_branch_id || "";
            document.getElementById("f_email").value = user.email || "";
            document.getElementById("f_phone").value = user.phone || user.phone_number || "";
        }

        // For manager (non-admin), disable branch dropdown and set to their branch
        if (isManager && !isAdmin) {
            branchSelect.disabled = true;
            if (myBranchId) branchSelect.value = myBranchId;
        } else {
            branchSelect.disabled = false;
        }

        if (mode === "view") {
            document.getElementById("modalHeader").innerText = "Staff Details (Read-Only)";
            inputs.forEach(i => i.disabled = true);
            submitBtn.style.display = "none";
        } else if (mode === "edit") {
            document.getElementById("modalHeader").innerText = "Update Staff Profile";
            verifySection.style.display = "block";
        } else if (mode === "status") {
            const active = user.is_active === true || user.is_active === 1;
            document.getElementById("modalHeader").innerText = `${active ? 'Block' : 'Unblock'} Staff Member`;
            inputs.forEach(i => i.disabled = true);
            verifySection.style.display = "block";
        } else {
            document.getElementById("modalHeader").innerText = "Register New Staff Member";
            // For add mode, also pre‑set branch for manager
            if (isManager && !isAdmin) {
                branchSelect.disabled = true;
                if (myBranchId) branchSelect.value = myBranchId;
            }
        }
        modal.style.display = "flex";
    };

    document.getElementById("addStaffBtn")?.addEventListener('click', () => setupModal("add"));
    document.getElementById("closeModalBtn").onclick = () => modal.style.display = "none";

    parent.onclick = (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (!id) return;
        const user = state.users.find(u => String(u.id || u.user_id) === String(id));
        if (!user) return;

        if (target.classList.contains("view-btn")) setupModal("view", user);
        if (target.classList.contains("edit-btn")) setupModal("edit", user);
        if (target.classList.contains("status-btn")) setupModal("status", user);
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const mode = document.getElementById("actionType").value;
        const editId = document.getElementById("editId").value;
        const btn = document.getElementById("submitBtn");
        const user = state.users.find(u => String(u.id || u.user_id) === String(editId));

        const email = document.getElementById("f_email").value.trim();
        const phone = document.getElementById("f_phone").value.trim();
        
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            alert("Please enter a valid email address (e.g., name@example.com).");
            return;
        }
        if (phone && !/^[0-9+\-\s()]{10,15}$/.test(phone)) {
            alert("Please enter a valid phone number (10-15 digits, may include +, -, spaces, parentheses).");
            return;
        }

        const payload = {
            user_name: document.getElementById("f_user").value,
            email: email,
            phone: phone, 
            designation: document.getElementById("f_role").value,
            fk_branch: document.getElementById("f_branch").value,
            fk_city: 1,
            is_active: mode === "status" ? !(user.is_active === true || user.is_active === 1) : true
        };

        if (mode === "edit" || mode === "status") {
            payload.old_password = document.getElementById("v_pass").value;
            payload.security_key_verify = document.getElementById("v_key").value;
            if (!payload.old_password || !payload.security_key_verify) {
                alert("Administrator credentials required.");
                return;
            }
        }

        try {
            btn.disabled = true;
            btn.innerText = "SYNCHRONIZING...";
            const method = editId ? 'PATCH' : 'POST';
            const url = editId ? `users/${editId}/` : `users/`;
            const result = await fetchData(url, method, payload);
            
            modal.style.display = "none";
            await refreshGlobalState();
            refreshUsersUI();
            
            if (mode === "add") {
                alert(`Staff member "${payload.user_name}" registered successfully. Temporary Passkey: ${result.generated_otp}`);
            } else if (mode === "edit") {
                alert(`Staff member "${payload.user_name}" updated successfully.`);
            } else if (mode === "status") {
                alert(`Staff member ${payload.is_active ? 'unblocked' : 'blocked'} successfully.`);
            }
        } catch (err) { 
            showUserFriendlyError(err);
            btn.disabled = false;
            btn.innerText = "CONFIRM";
        }
    };
}

function refreshUsersUI() {
    const root = document.getElementById('view-root');
    if (root) { root.innerHTML = renderUsers(); bindUserActions(); }
}