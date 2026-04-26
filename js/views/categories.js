// js/views/categories.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";
import { navigate, getCurrentView } from "../router.js";

export function renderCategories() {
    const categories = Array.isArray(state.categories) ? state.categories : [];
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    const isAdmin = role === 'admin';
    const isManager = role.includes('manager');

    if (!isAdmin && !isManager) {
        return '<div style="padding:20px; color:#d32f2f; font-weight:bold;">Access Denied: Administrative privileges required.</div>';
    }

    const headerTitle = isAdmin ? 'GLOBAL CATEGORY DIRECTORY' : 'BRANCH CATEGORY LIST';

    return `
    <div id="categories-module-root" style="padding: 25px; animation: fadeIn 0.3s ease; color: #3e2723; font-family: 'Roboto', sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <div>
                <h2 style="color: #3e2723; margin:0; font-weight: 800;">${headerTitle}</h2>
                <p style="color:#8d6e63; margin:5px 0 0; font-size:0.8rem;">Total Categories: ${categories.length}</p>
            </div>
            ${isAdmin ? `
            <button id="addCatBtn" style="background: #5d4037; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 700; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                ADD NEW CATEGORY
            </button>` : ''}
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap:20px;">
            ${categories.length === 0 ? '<div style="grid-column: 1/-1; padding:80px; text-align:center; background:white; border:1px solid #e0d7d5; color:#999;">No categories found in records.</div>' : 
              categories.map(cat => `
                <div class="category-card" style="background:white; border:1px solid #e0d7d5; border-radius:12px; padding:25px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div>
                            <h3 style="margin:0; color:#3e2723; font-weight:800; font-size:1.1rem;">${cat.category_name}</h3>
                            <span style="background:#efebe9; color:#5d4037; padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:800; display:inline-block; margin-top:8px;">CODE: ${cat.category_code || '---'}</span>
                        </div>
                        <span style="font-size:0.65rem; color:#bbb; font-weight:bold;">ID: #${cat.id}</span>
                    </div>
                    
                    <div style="margin-top:15px; font-size:0.8rem; color:#8d6e63; line-height:1.6;">
                        <strong>Status:</strong> ${cat.is_active ? 'ENABLED' : 'HIDDEN'}<br>
                        <strong>Active At:</strong> ${cat.assigned_branches || 'None'}
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:15px; border-top:1px solid #f8f5f2; margin-top:20px; padding-top:15px;">
                        <button class="view-cat-btn" data-id="${cat.id}" style="background:none; border:none; color:#1a73e8; font-weight:700; cursor:pointer; font-size:0.8rem;">VIEW</button>
                        ${isAdmin ? `<button class="edit-cat-btn" data-id="${cat.id}" style="background:none; border:none; color:#1a73e8; font-weight:700; cursor:pointer; font-size:0.8rem;">EDIT</button>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <div id="catModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; backdrop-filter: blur(2px);">
        <div style="background:white; width:450px; padding:30px; border-radius:16px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
            <h3 id="modalTitle" style="margin-top:0; color:#3e2723; font-weight:800; border-bottom: 2px solid #f8f5f2; padding-bottom:10px;">Category Profile</h3>
            <form id="categoryForm" style="display:flex; flex-direction:column; gap:18px; margin-top:20px;">
                <input type="hidden" id="editCatId">
                <div>
                    <label style="font-size:0.75rem; font-weight:800; color:#8d6e63; text-transform:uppercase;">Category Name *</label>
                    <input type="text" id="catName" class="c-input" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing:border-box; outline:none; margin-top:5px;">
                </div>
                <div>
                    <label style="font-size:0.75rem; font-weight:800; color:#8d6e63; text-transform:uppercase;">Identification Code</label>
                    <input type="text" id="catCode" class="c-input" placeholder="e.g. BRD" style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing:border-box; outline:none; margin-top:5px;">
                </div>
                
                <div>
                    <label style="font-size:0.75rem; font-weight:800; color:#8d6e63; text-transform:uppercase;">Branch Activation</label>
                    <div id="branch-checklist" style="max-height: 150px; overflow-y: auto; border: 1px solid #ddd; padding: 12px; border-radius: 8px; margin-top: 5px; background: #fff;">
                        ${(state.branches || []).map(b => `
                            <label style="display:flex; align-items:center; gap:12px; margin-bottom:10px; cursor:pointer; font-size:0.85rem; font-weight:600; color:#5d4037;">
                                <input type="checkbox" class="branch-cb c-input" value="${b.id || b.branch_id}"> ${b.branch_name}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div style="display:flex; gap:12px; margin-top:15px;">
                    <button type="button" id="closeCatBtn" style="flex:1; padding:14px; background:#f5f5f5; color:#666; border:none; border-radius:10px; cursor:pointer; font-weight:600;">CANCEL</button>
                    <button type="submit" id="saveCatBtn" style="flex:1; padding:14px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800;">SAVE CONFIGURATION</button>
                </div>
            </form>
        </div>
    </div>`;
}

export function bindCategoryActions() {
    const root = document.getElementById("categories-module-root");
    const modal = document.getElementById("catModal");
    const form = document.getElementById("categoryForm");
    
    if (!root || !modal || !form) return;

    const setBranchCheckboxes = (cat = null) => {
        const checkboxes = document.querySelectorAll('.branch-cb');
        checkboxes.forEach(cb => cb.checked = false);
        if (cat) {
            let assignedIds = cat.fk_branch_ids || cat.branch_ids || [];
            if (!Array.isArray(assignedIds)) assignedIds = [];
            const assignedIdStrings = assignedIds.map(id => String(id));
            checkboxes.forEach(cb => {
                if (assignedIdStrings.includes(String(cb.value))) cb.checked = true;
            });
        }
    };

    const setModalState = (mode, cat = null) => {
        form.reset();
        document.getElementById("editCatId").value = "";
        const inputs = document.querySelectorAll(".c-input");
        const saveBtn = document.getElementById("saveCatBtn");

        inputs.forEach(i => i.disabled = false);
        saveBtn.style.display = "block";

        if (mode === 'add') {
            document.getElementById("modalTitle").innerText = "Add New Category";
            document.getElementById("catName").value = "";
            document.getElementById("catCode").value = "";
            setBranchCheckboxes(null);
        } 
        else if (mode === 'view' || mode === 'edit') {
            if (!cat) {
                showToast("Category data not found! Please refresh and try again.", "error");
                modal.style.display = "none";
                return;
            }
            document.getElementById("editCatId").value = cat.id;
            document.getElementById("catName").value = cat.category_name;
            document.getElementById("catCode").value = cat.category_code || "";
            setBranchCheckboxes(cat);

            if (mode === 'view') {
                document.getElementById("modalTitle").innerText = "Category View (Read-Only)";
                inputs.forEach(i => i.disabled = true);
                saveBtn.style.display = "none";
            } else {
                document.getElementById("modalTitle").innerText = "Update Category";
                inputs.forEach(i => i.disabled = false);
                saveBtn.style.display = "block";
            }
        }

        modal.style.display = "flex";
    };

    const addBtn = document.getElementById("addCatBtn");
    if (addBtn) addBtn.onclick = () => setModalState('add');

    const closeBtn = document.getElementById("closeCatBtn");
    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";

    root.onclick = (e) => {
        const id = e.target.dataset.id;
        if (!id) return;
        const cat = state.categories.find(c => String(c.id) === String(id));
        if (!cat) {
            showToast("Category not found in current state. Please refresh the page.", "error");
            return;
        }
        if (e.target.classList.contains('view-cat-btn')) setModalState('view', cat);
        if (e.target.classList.contains('edit-cat-btn')) setModalState('edit', cat);
    };

    // ✅ FIXED: Use direct state update from PUT response, no refreshGlobalState()
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const id = document.getElementById("editCatId").value;
        const btn = document.getElementById("saveCatBtn");
        const selectedBranchIds = Array.from(document.querySelectorAll('.branch-cb:checked')).map(cb => parseInt(cb.value));

        const payload = {
            category_name: document.getElementById("catName").value.trim(),
            category_code: document.getElementById("catCode").value.trim(),
            fk_branch_ids: selectedBranchIds,
            is_active: true
        };

        try {
            btn.disabled = true;
            btn.innerText = "SYNCHRONIZING...";
            
            const method = id ? 'PUT' : 'POST';
            const url = id ? `categories/${id}/` : `categories/`;
            
            const response = await fetchData(url, method, payload);
            console.log("API Response from backend:", response);
            
            // ✅ Directly update the category in state using the response
            if (response && response.id) {
                const index = state.categories.findIndex(c => String(c.id) === String(response.id));
                if (index !== -1) {
                    // Merge the response into the existing category (preserves other fields)
                    state.categories[index] = { ...state.categories[index], ...response };
                } else {
                    // New category – add to beginning
                    state.categories.unshift(response);
                }
            }
            
            modal.style.display = "none";
            
            // ✅ Re-render the categories view
            const parent = document.getElementById("view-root");
            if (parent) {
                parent.innerHTML = renderCategories();
                bindCategoryActions();
            }
            
            // If products view is active, refresh it too
            const currentView = getCurrentView();
            if (currentView === 'products') {
                await navigate('products');
            }
            
            showToast(`Category "${payload.category_name}" saved successfully!`, "success");
            
        } catch (err) {
            console.error("Save failed:", err);
            showToast("Sync Failed: " + err.message, "error");
        } finally {
            btn.disabled = false;
            btn.innerText = "SAVE CONFIGURATION";
        }
    };
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === "success" ? "#4caf50" : "#f44336"};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}