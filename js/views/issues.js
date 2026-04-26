// js/views/issues.js - Standardized for Auto-Assignment & RBAC
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";

/* =====================================================
    1. MAIN RENDER FUNCTION
   ===================================================== */
export function renderIssues() {
    const u = state.user;
    if (!u) return `<div class="main-content"><h2>Access Denied</h2></div>`;

    const role = (u.role || u.designation || '').toLowerCase();
    const userId = String(u.id || u.user_id || '');
    const userBranchId = String(u.fk_branch || u.fk_branch_id || '');

    let visibleIssues = state.issues || [];

    if (role !== 'admin') {
        visibleIssues = visibleIssues.filter(i => {
            const iReporterId = String(i.fk_reported_by_id || i.fk_reported_by || '');
            const iRecipientId = String(i.fk_reported_to_id || i.fk_reported_to || '');
            const iBranchId = String(i.fk_branch || '');

            if (role.includes('manager')) {
                // Branch manager: sees issues from his branch OR issues he reported OR issues reported to him
                return (iBranchId === userBranchId) || (iReporterId === userId) || (iRecipientId === userId);
            }
            // Baker / staff: only their own reports
            return iReporterId === userId;
        });
    }

    return `
        <div class="main-content bakery-theme" id="issue-module-root" style="padding:25px; background:#fdfaf9; min-height:100vh; animation: fadeIn 0.3s ease;">
            <div class="header-flex" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: #3e2723; margin:0; font-weight:800;">Operational Issues</h2>
                    <p style="color: #8d6e63; margin:5px 0 0 0;">Report and track operational bottlenecks or safety concerns.</p>
                </div>
                <button id="btnRaiseIssue" style="padding:12px 24px; background:#5d4037; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:800; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    + REPORT NEW ISSUE
                </button>
            </div>

            <div style="background:white; border-radius:12px; border:1px solid #e0d7d5; overflow:hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <table style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead style="background:#efebe9; color:#5d4037; font-size:0.75rem; text-transform:uppercase; letter-spacing:1px;">
                        <tr>
                            <th style="padding:15px;">ID</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Severity</th>
                            <th>Branch</th>
                            <th>Reported By/To</th>
                            <th style="text-align:right; padding-right:15px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visibleIssues.length === 0 ? 
                          '<tr><td colspan="7" style="text-align:center; padding:60px; color:#999; font-style:italic;">No visible issues match your access level.纽约</tr>' : 
                          visibleIssues.map(issue => renderIssueRow(issue)).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="issueModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; backdrop-filter: blur(2px);">
            <div style="width: 100%; max-width: 500px; padding: 30px; border-radius:16px; background: white; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <h3 style="color:#3e2723; margin-top:0; font-weight:800; border-bottom:2px solid #f8f5f2; padding-bottom:10px;">Report Operational Issue</h3>
                <form id="raiseIssueForm" style="margin-top:20px;">
                    <!-- Checkboxes for recipients -->
                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px;">REPORT TO (Select one or both)</label>
                        <div style="display:flex; gap:20px;">
                            <label style="display:flex; align-items:center; gap:6px;">
                                <input type="checkbox" id="reportToAdmin" value="admin"> Admin
                            </label>
                            <label style="display:flex; align-items:center; gap:6px;">
                                <input type="checkbox" id="reportToManager" value="manager"> Branch Manager
                            </label>
                        </div>
                        <small style="color:#aaa; font-size:0.7rem;">If both selected, issue will be visible to both Admin and Manager.</small>
                    </div>
                    <input type="hidden" id="selectedRecipient" name="fk_reported_to">

                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:5px;">CATEGORY</label>
                        <select name="issue_type" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; background:white;">
                            <option value="quality">Quality / Production</option>
                            <option value="equipment">Equipment failure</option>
                            <option value="hygiene">Safety / Hygiene</option>
                            <option value="other">Other Incident</option>
                        </select>
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:5px;">SEVERITY LEVEL</label>
                        <select name="severity_level" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; background:white;">
                            <option value="low">Low (Minor Impact)</option>
                            <option value="medium">Medium (Standard Issue)</option>
                            <option value="high">High (Urgent Attention)</option>
                            <option value="critical">Critical (Immediate Halt)</option>
                        </select>
                    </div>
                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:5px;">DESCRIPTION</label>
                        <textarea name="issue_description" rows="4" placeholder="Describe the problem..." required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; resize:none; font-family:inherit; outline:none;"></textarea>
                    </div>
                    <div style="margin-top:25px; display:flex; gap:12px;">
                        <button type="button" id="btnCancelIssue" style="flex:1; padding:12px; border:none; background:#f5f5f5; color:#666; border-radius:10px; cursor:pointer; font-weight:600;">Cancel</button>
                        <button type="submit" style="flex:1; padding:12px; border:none; background:#5d4037; color:white; border-radius:10px; cursor:pointer; font-weight:800;">SUBMIT REPORT</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="issueActionModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:2000; backdrop-filter: blur(2px); align-items:center; justify-content:center;">
            <div id="modalContainer" style="width: 100%; max-width: 500px; padding: 30px; border-radius:16px; background:white; box-shadow: 0 15px 35px rgba(0,0,0,0.2);"></div>
        </div>
    `;
}

function generateRecipientOptions(u) {
    // Kept for compatibility but not used in new checkboxes – can be removed.
    return '';
}

function renderIssueRow(i) {
    const statusStyles = {
        open: 'background:#ffebee; color:#c62828; border: 1px solid #ffcdd2;',
        in_progress: 'background:#fff3e0; color:#ef6c00; border: 1px solid #ffe0b2;',
        resolved: 'background:#e8f5e9; color:#2e7d32; border: 1px solid #c8e6c9;',
        closed: 'background:#f5f5f5; color:#616161; border: 1px solid #e0e0e0;'
    };

    let recipientDisplay = i.reported_to_name || 'Admin';
    if (i.reported_to_both) recipientDisplay = 'Admin & Manager';
    else if (i.reported_to_name) recipientDisplay = i.reported_to_name;
    else recipientDisplay = 'Admin';

    return `
        <tr style="border-bottom: 1px solid #eee; font-size:0.85rem;">
            <td style="padding:15px; font-family: monospace; color:#8d6e63; font-weight:bold;">#${i.id}</td>
            <td style="font-weight:700; color:#3e2723; text-transform:capitalize;">${i.issue_type}</td>
            <td>
                <span style="padding:4px 10px; border-radius:20px; font-size:0.6rem; font-weight:800; text-transform:uppercase; ${statusStyles[i.issue_status] || ''}">
                    ${(i.issue_status || 'OPEN').replace('_', ' ')}
                </span>
            </td>
            <td style="font-weight:600; color:#5d4037; text-transform:capitalize;">${i.severity_level}</td>
            <td style="color:#5d4037; font-weight:600;">${i.branch_name || 'N/A'}</td>
            <td style="color:#666; font-size:0.75rem;">
                By: <b>${i.reported_by_name}</b><br>
                To: <b>${recipientDisplay}</b>
            </td>
            <td style="text-align:right; padding-right:15px;">
                <button class="view-btn" data-id="${i.id}" style="padding:8px 15px; background:#efebe9; border:none; border-radius:6px; cursor:pointer; color:#3e2723; font-weight:800; font-size:0.7rem;">DETAILS</button>
            </td>
        </tr>`;
}

/* =====================================================
    2. EVENT BINDINGS
   ===================================================== */
export function bindIssueActions() {
    const root = document.getElementById("issue-module-root");
    if (!root) return;

    const u = state.user;
    const role = (u.role || u.designation || '').toLowerCase();
    const userId = String(u.id || u.user_id || '');

    // Modal controls
    document.getElementById("btnRaiseIssue").onclick = () => {
        const adminCheck = document.getElementById('reportToAdmin');
        const managerCheck = document.getElementById('reportToManager');
        if (adminCheck) adminCheck.checked = false;
        if (managerCheck) managerCheck.checked = false;
        document.getElementById("issueModal").style.display = "flex";
    };
    document.getElementById("btnCancelIssue").onclick = () => document.getElementById("issueModal").style.display = "none";

    // 1. SUBMIT LOGIC with checkbox handling
    document.getElementById("raiseIssueForm").onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        
        const adminChecked = document.getElementById('reportToAdmin').checked;
        const managerChecked = document.getElementById('reportToManager').checked;
        
        let recipientId = null;
        let recipientDisplayName = '';
        
        if (adminChecked && managerChecked) {
            const branchManagers = (state.users || []).filter(user => 
                (user.role || user.designation || '').toLowerCase().includes('manager') && 
                String(user.fk_branch || user.fk_branch_id) === String(u.fk_branch || u.fk_branch_id)
            );
            if (branchManagers.length > 0) {
                recipientId = branchManagers[0].id;
                recipientDisplayName = 'Admin & Manager';
            } else {
                const admins = (state.users || []).filter(user => (user.role || user.designation || '').toLowerCase() === 'admin');
                if (admins.length > 0) recipientId = admins[0].id;
            }
        } else if (adminChecked) {
            const admins = (state.users || []).filter(user => (user.role || user.designation || '').toLowerCase() === 'admin');
            if (admins.length > 0) recipientId = admins[0].id;
        } else if (managerChecked) {
            const branchManagers = (state.users || []).filter(user => 
                (user.role || user.designation || '').toLowerCase().includes('manager') && 
                String(user.fk_branch || user.fk_branch_id) === String(u.fk_branch || u.fk_branch_id)
            );
            if (branchManagers.length > 0) recipientId = branchManagers[0].id;
        }
        
        if (!recipientId) {
            alert("No valid recipient found. Please select at least one option or contact system admin.");
            return;
        }
        
        const payload = {
            issue_type: fd.get("issue_type"),
            severity_level: fd.get("severity_level"),
            issue_description: fd.get("issue_description"),
            fk_reported_to: recipientId,
            reported_to_both: adminChecked && managerChecked
        };

        try {
            await fetchData('issues/', 'POST', payload);
            alert("Issue reported successfully.");
            document.getElementById("issueModal").style.display = "none";
            await refreshAndReRender();
        } catch (err) { alert("Submission failed: " + err.message); }
    };

    // 2. VIEW DETAILS & RESOLUTION AUTHORITY
    root.onclick = async (e) => {
        const target = e.target.closest(".view-btn");
        if (!target) return;

        const id = target.dataset.id;
        const issue = state.issues.find(i => String(i.id) === String(id));
        if (!issue) return;

        const isRecipient = String(issue.fk_reported_to_id || issue.fk_reported_to) === userId;
        const canResolve = (role === 'admin') || (role.includes('manager') && isRecipient);

        const modalContainer = document.getElementById("modalContainer");
        const actionModal = document.getElementById("issueActionModal");

        modalContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:2px solid #f8f5f2; padding-bottom:10px;">
                <h3 style="color:#3e2723; margin:0; font-weight:800;">Issue Log #${issue.id}</h3>
                <span style="font-size:0.7rem; color:#8d6e63; font-weight:800; background:#f5f5f5; padding:4px 8px; border-radius:4px; text-transform:uppercase;">${issue.issue_type}</span>
            </div>
            
            <div style="background:#fff9f0; padding:15px; border-radius:12px; margin-bottom:20px; border-left:4px solid #d2691e;">
                <p style="margin:0; font-size:0.95rem; line-height:1.6; color:#3e2723; font-weight:500;">${issue.issue_description}</p>
                <div style="margin-top:10px; font-size:0.75rem; color:#8d6e63;">
                    <b>Reporter:</b> ${issue.reported_by_name} <br>
                    <b>Designated Recipient:</b> ${issue.reported_to_both ? 'Admin & Manager' : (issue.reported_to_name || 'Admin')}
                </div>
            </div>

            ${canResolve ? `
                <label style="display:block; font-size:0.7rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Update Resolution Status</label>
                <select id="up_status" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:10px; margin-bottom:20px; background:white; font-weight:600;">
                    <option value="open" ${issue.issue_status === 'open' ? 'selected' : ''}>Open / Pending</option>
                    <option value="in_progress" ${issue.issue_status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                    <option value="resolved" ${issue.issue_status === 'resolved' ? 'selected' : ''}>Resolved / Fixed</option>
                    <option value="closed" ${issue.issue_status === 'closed' ? 'selected' : ''}>Closed / Archived</option>
                </select>
            ` : `
                <div style="padding:12px; background:#f5f5f5; border-radius:10px; color:#666; font-weight:700; margin-bottom:20px; text-align:center; font-size:0.8rem; text-transform:uppercase;">
                    Current Status: ${issue.issue_status.replace('_', ' ')}
                </div>
            `}

            <div style="display:flex; gap:12px;">
                <button type="button" id="btnCloseIssueAction" style="flex:1; padding:12px; border:none; background:#f5f5f5; color:#666; border-radius:10px; font-weight:600; cursor:pointer;">Close</button>
                ${canResolve ? `<button id="saveResolutionBtn" style="flex:1; padding:12px; border:none; background:#2e7d32; color:white; border-radius:10px; font-weight:800; cursor:pointer;">Save Status</button>` : ''}
            </div>
        `;
        
        actionModal.style.display = "flex";
        document.getElementById("btnCloseIssueAction").onclick = () => actionModal.style.display = "none";
        
        if (canResolve) {
            document.getElementById("saveResolutionBtn").onclick = async () => {
                const newStatus = document.getElementById("up_status").value;
                try {
                    await fetchData(`issues/${id}/`, 'PATCH', { issue_status: newStatus });
                    alert("Status updated successfully!");
                    actionModal.style.display = "none";
                    await refreshAndReRender();
                } catch (err) { alert("Update failed: " + err.message); }
            };
        }
    };
}

/* =====================================================
    3. UTILITIES
   ===================================================== */
async function refreshAndReRender() {
    await refreshGlobalState();
    const parent = document.getElementById('view-root');
    if (parent) {
        parent.innerHTML = renderIssues();
        bindIssueActions();
    }
}