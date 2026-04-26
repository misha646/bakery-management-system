// js/views/inventory.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData, patchData } from "../api.js";

let searchTerm = "";
let selectedCategory = "All";
let selectedType = "All";

export function renderInventory() {
    const inventory = state.inventory || [];
    const userBranchId = state.user?.fk_branch_id || state.user?.fk_branch || 1;
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    const isAdmin = role === 'admin';
    const isManager = ['admin', 'manager', 'branch manager'].includes(role);
    const canEdit = isAdmin || isManager;          // Show actions column & edit button
    const canReorder = isManager;                 // Only managers can reorder/fulfill

    // Build category filters
    const productCategories = (state.categories || []).map(c => ({
        id: `prod_${c.id}`,
        name: c.category_name,
        type: 'product'
    }));
    const rawCategories = (state.raw_materials || [])
        .reduce((acc, r) => {
            if (r.category && !acc.some(c => c.name === r.category)) {
                acc.push({ id: `raw_${r.category}`, name: r.category, type: 'raw' });
            }
            return acc;
        }, []);
    const allCategories = [
        { id: "All", name: "All Categories", type: "all" },
        ...productCategories,
        ...rawCategories
    ];

    const typeOptions = [
        { id: "All", name: "All Types" },
        { id: "product", name: "Finished Goods" },
        { id: "raw", name: "Raw Materials" }
    ];

    let filtered = isAdmin
        ? inventory
        : inventory.filter(i => String(i.fk_branch) === String(userBranchId));

    if (selectedType !== "All") {
        filtered = filtered.filter(item => item.item_type === selectedType);
    }
    if (selectedCategory !== "All") {
        const cat = allCategories.find(c => c.id === selectedCategory);
        if (cat) {
            filtered = filtered.filter(item => item.item_category === cat.name);
        }
    }
    if (searchTerm) {
        filtered = filtered.filter(item =>
            item.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Determine column count for colspan
    const columnCount = canEdit ? 6 : 5;

    return `
    <div id="inventory-module-root" style="padding: 25px; background: #fdfaf9; min-height: 100vh;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <div>
                <h2 style="color: #3e2723; margin:0;">Inventory Control</h2>
            </div>
            ${isAdmin ? `<button id="openModalBtn" style="background:#5d4037; color:white; padding:12px 24px; border-radius:8px; cursor:pointer;">+ Add Inventory Item</button>` : ''}
        </div>

        <!-- Filters -->
        <div style="background:#fff; padding:15px; border-radius:12px; display:flex; gap:15px; margin-bottom:25px;">
            <input type="text" id="invSearch" placeholder="Search items..." value="${searchTerm}" style="flex:2; padding:12px;">
            <select id="invTypeFilter" style="flex:1; padding:12px;">
                ${typeOptions.map(t => `<option value="${t.id}" ${selectedType == t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
            <select id="invCatFilter" style="flex:1; padding:12px;">
                ${allCategories.map(c => `<option value="${c.id}" ${selectedCategory == c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
        </div>

        <!-- Inventory Table -->
        <div style="background:white; border-radius:12px; overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse;">
                <thead style="background:#efebe9;">
                    <tr>
                        <th style="padding:15px;">Item Name</th>
                        <th style="padding:15px;">Type</th>
                        <th style="padding:15px;">Category</th>
                        <th style="padding:15px;">Branch</th>
                        <th style="padding:15px;">Stock / Reorder Level</th>
                        ${canEdit ? `<th style="padding:15px; text-align:center;">Actions</th>` : ''}
                    </tr>
                </thead>
                <tbody>
                    ${filtered.length === 0 ? `<tr><td colspan="${columnCount}" style="text-align:center; padding:50px;">No matching inventory found.</td></tr>` : 
                      filtered.map(item => {
                        const qty = parseFloat(item.quantity) || 0;
                        const threshold = parseFloat(item.reorder_level) || 10;
                        const isLow = qty <= threshold;
                        const isPending = item.reorder_status === 'Pending';
                        const branchName = state.branches.find(b => String(b.id) === String(item.fk_branch))?.branch_name || 'Outlet ' + item.fk_branch;
                        const typeLabel = item.item_type === 'product' ? 'Finished' : 'Raw';
                        return `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding:15px;"><div style="font-weight:700;">${item.item_name}</div><div style="font-size:0.65rem;">ID: ${item.id}</div></td>
                            <td style="padding:15px;"><span style="background:#efebe9; padding:4px 10px; border-radius:6px;">${typeLabel}</span></td>
                            <td style="padding:15px;"><span>${item.item_category || 'General'}</span></td>
                            <td style="padding:15px;">${branchName}</td>
                            <td style="padding:15px;">
                                <div style="display:flex; gap:8px;">
                                    <span style="font-weight:bold; color:${isLow ? '#d32f2f' : '#2e7d32'};">${qty.toFixed(0)} ${item.unit || ''}</span>
                                    <span>/ ${threshold}</span>
                                    ${isLow ? `<span style="background:#ffebee; color:#d32f2f; padding:2px 6px; border-radius:4px;">LOW</span>` : ''}
                                </div>
                            </td>
                            ${canEdit ? `
                            <td style="padding:15px; text-align:center;">
                                <div style="display:flex; gap:8px; justify-content:center;">
                                    <button class="edit-item-btn" data-id="${item.id}" style="padding:6px 12px; background:#efebe9; border:none; border-radius:4px; cursor:pointer;">EDIT</button>
                                    ${isLow && !isPending && canReorder ? `<button class="reorder-trigger-btn" data-id="${item.id}" style="background:#1a237e; color:white; padding:6px 12px; border:none; border-radius:4px;">REORDER</button>` : ''}
                                    ${isPending && canReorder ? `<button class="fulfill-btn" data-id="${item.id}" style="background:#2e7d32; color:white; padding:6px 12px; border:none; border-radius:4px;">FULFILL</button>` : ''}
                                </div>
                            </td>
                            ` : ''}
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Main Inventory Modal (Add/Edit) – only shown for admin, but safe -->
        <div id="itemModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center;">
            <div style="background:white; width:500px; max-width:90%; padding:30px; border-radius:16px;">
                <h3 id="modalTitle" style="margin-top:0;">Add Inventory Stock</h3>
                <form id="inventoryForm">
                    <input type="hidden" id="editing_id">
                    <div style="margin-bottom:15px;">
                        <label>CHOOSE ITEM (RAW/PRODUCT)</label>
                        <div style="display:flex; gap:10px;">
                            <select id="fk_item_id" required style="flex:1; padding:12px;">
                                <option value="">-- Select Item --</option>
                                ${(state.products || []).map(p => `<option value="${p.id}">${p.product_name} (Product)</option>`).join('')}
                                ${(state.raw_materials || []).map(r => `<option value="${r.id}">${r.raw_material_name} (Raw)</option>`).join('')}
                            </select>
                            <button type="button" id="quickAddItemBtn" style="background:#5d4037; color:white; border:none; padding:0 16px; border-radius:8px;">New</button>
                        </div>
                    </div>
                    <div style="margin-bottom:15px;">
                        <label>REORDER LEVEL (THRESHOLD)</label>
                        <input type="number" id="threshold_val" required style="width:100%; padding:12px;">
                    </div>
                    <div style="margin-bottom:20px;">
                        <label>CURRENT STOCK ON HAND</label>
                        <input type="number" id="current_qty" required style="width:100%; padding:12px;">
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button type="button" id="closeModalBtn" style="flex:1; padding:12px; background:#f5f5f5; border:none; border-radius:10px;">Cancel</button>
                        <button type="submit" style="flex:1; padding:12px; background:#5d4037; color:white; border:none; border-radius:10px;">SAVE</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Sub‑modal for creating a new Product or Raw Material – only visible to admin -->
        <div id="quickItemModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:1100; align-items:center; justify-content:center;">
            <div style="background:white; width:500px; max-width:90%; padding:30px; border-radius:16px;">
                <h3 id="quickModalTitle">Create New Product</h3>
                <form id="quickItemForm">
                    <div style="margin-bottom:15px;">
                        <label>Type:</label>
                        <select id="newItemType" required style="width:100%; padding:12px;">
                            <option value="product">Product (Finished Good)</option>
                            <option value="raw">Raw Material</option>
                        </select>
                    </div>
                    <div id="productFields">
                        <div style="margin-bottom:15px;">
                            <label>Product Name *</label>
                            <input type="text" id="newProductName" required style="width:100%; padding:12px;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>Sale Price (₹) *</label>
                            <input type="number" step="0.01" id="newProductPrice" required style="width:100%; padding:12px;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>Cost Price (₹) *</label>
                            <input type="number" step="0.01" id="newProductCost" required style="width:100%; padding:12px;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>Category *</label>
                            <select id="newProductCategory" required style="width:100%; padding:12px;">
                                <option value="">-- Select Category --</option>
                                ${(state.categories || []).map(c => `<option value="${c.id}">${c.category_name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div id="rawFields" style="display:none;">
                        <div style="margin-bottom:15px;">
                            <label>Raw Material Name *</label>
                            <input type="text" id="newRawName" required style="width:100%; padding:12px;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>Cost Price (₹) *</label>
                            <input type="number" step="0.01" id="newRawCost" required style="width:100%; padding:12px;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>Category (optional)</label>
                            <input type="text" id="newRawCategory" style="width:100%; padding:12px;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label>Unit *</label>
                            <select id="newRawUnit" required style="width:100%; padding:12px;">
                                <option value="">-- Select Unit --</option>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="liter">liter</option>
                                <option value="pcs">pcs</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:20px;">
                        <button type="button" id="closeQuickModal" style="flex:1; padding:12px; background:#f5f5f5; border:none; border-radius:10px;">Cancel</button>
                        <button type="submit" style="flex:1; padding:12px; background:#5d4037; color:white; border:none; border-radius:10px;">CREATE AND SELECT</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`;
}

// Helper to refresh the inventory view
function renderFilteredTable() {
    const root = document.getElementById('view-root');
    if (root) {
        root.innerHTML = renderInventory();
        bindInventoryActions();
    }
}

async function refreshInventoryUI(syncWithServer = false) {
    if (syncWithServer) await refreshGlobalState();
    renderFilteredTable();
}

export function bindInventoryActions() {
    const root = document.getElementById('inventory-module-root');
    if (!root) return;

    // Filters
    const searchInput = document.getElementById('invSearch');
    const typeFilter = document.getElementById('invTypeFilter');
    const catFilter = document.getElementById('invCatFilter');

    const applyFilters = () => {
        searchTerm = searchInput?.value || "";
        selectedType = typeFilter?.value || "All";
        selectedCategory = catFilter?.value || "All";
        renderFilteredTable();
    };
    if (searchInput) searchInput.oninput = applyFilters;
    if (typeFilter) typeFilter.onchange = applyFilters;
    if (catFilter) catFilter.onchange = applyFilters;

    // Main modal controls
    const modal = document.getElementById('itemModal');
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    if (openBtn) openBtn.onclick = () => {
        document.getElementById('modalTitle').innerText = "Add Inventory Stock";
        document.getElementById('editing_id').value = "";
        document.getElementById('inventoryForm').reset();
        modal.style.display = 'flex';
    };
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';

    // Quick-add sub‑modal
    const quickModal = document.getElementById('quickItemModal');
    const quickAddBtn = document.getElementById('quickAddItemBtn');
    const closeQuickBtn = document.getElementById('closeQuickModal');
    const newItemType = document.getElementById('newItemType');
    const productFields = document.getElementById('productFields');
    const rawFields = document.getElementById('rawFields');

    if (quickAddBtn) {
        quickAddBtn.onclick = () => {
            document.getElementById('quickItemForm').reset();
            productFields.style.display = 'block';
            rawFields.style.display = 'none';
            quickModal.style.display = 'flex';
        };
    }
    if (closeQuickBtn) closeQuickBtn.onclick = () => quickModal.style.display = 'none';
    if (newItemType) {
        newItemType.onchange = (e) => {
            if (e.target.value === 'product') {
                productFields.style.display = 'block';
                rawFields.style.display = 'none';
                document.getElementById('quickModalTitle').innerText = "Create New Product";
            } else {
                productFields.style.display = 'none';
                rawFields.style.display = 'block';
                document.getElementById('quickModalTitle').innerText = "Create New Raw Material";
            }
        };
    }

    // Submit new product/raw material and then immediately create inventory record
    const quickForm = document.getElementById('quickItemForm');
    if (quickForm) {
        quickForm.onsubmit = async (e) => {
            e.preventDefault();
            const type = newItemType.value;
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerText = "Creating...";

            try {
                let newItemId = null;
                let itemName = "";
                let unit = "";

                if (type === 'product') {
                    const productName = document.getElementById('newProductName').value.trim();
                    const price = parseFloat(document.getElementById('newProductPrice').value);
                    const cost = parseFloat(document.getElementById('newProductCost').value);
                    const categoryId = document.getElementById('newProductCategory').value;
                    if (!productName || !price || !cost || !categoryId) throw new Error("All product fields required");
                    const payload = {
                        product_name: productName,
                        base_price: price,
                        cost_price: cost,
                        fk_category: categoryId,
                        is_active: true,
                        unit: 'pcs'
                    };
                    const response = await fetchData('products/', 'POST', payload);
                    newItemId = response.id || response.product_id;
                    itemName = productName;
                    unit = 'pcs';
                    if (!newItemId) throw new Error("Product created but ID not returned");
                    alert(`Product "${productName}" created successfully.`);
                } else {
                    const rawName = document.getElementById('newRawName').value.trim();
                    const cost = parseFloat(document.getElementById('newRawCost').value);
                    const category = document.getElementById('newRawCategory').value.trim() || null;
                    const selectedUnit = document.getElementById('newRawUnit').value;
                    if (!rawName || !cost || !selectedUnit) throw new Error("All raw material fields required");
                    const payload = {
                        raw_material_name: rawName,
                        cost_price: cost,
                        category: category,
                        fk_unit: selectedUnit,
                        is_active: true
                    };
                    const response = await fetchData('raw-materials/', 'POST', payload);
                    newItemId = response.id || response.raw_material_id;
                    itemName = rawName;
                    unit = selectedUnit;
                    if (!newItemId) throw new Error("Raw material created but ID not returned");
                    alert(`Raw material "${rawName}" created successfully.`);
                }

                await refreshGlobalState();

                let currentStock = prompt(`Enter current stock quantity for "${itemName}" (${unit}):`, "0");
                if (currentStock === null) {
                    quickModal.style.display = 'none';
                    return;
                }
                let reorderLevel = prompt(`Enter reorder level for "${itemName}" (${unit}):`, "10");
                if (reorderLevel === null) {
                    quickModal.style.display = 'none';
                    return;
                }

                const stock = parseFloat(currentStock);
                const level = parseFloat(reorderLevel);
                if (isNaN(stock) || isNaN(level)) {
                    alert("Invalid numbers. Inventory record not created.");
                    quickModal.style.display = 'none';
                    return;
                }

                const branchId = state.user?.fk_branch_id || state.user?.fk_branch || 1;
                const inventoryPayload = {
                    fk_item: newItemId,
                    quantity: stock,
                    reorder_level: level,
                    fk_branch: branchId
                };
                await fetchData('inventory/', 'POST', inventoryPayload);
                alert(`Inventory record for "${itemName}" created with stock ${stock} ${unit} and reorder level ${level}.`);

                await refreshInventoryUI(true);
                quickModal.style.display = 'none';
            } catch (err) {
                alert("Creation failed: " + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "CREATE AND SELECT";
            }
        };
    }

    // Action buttons (reorder, fulfill, edit)
    root.onclick = async (e) => {
        const btn = e.target;
        const id = btn.dataset.id;
        if (!id) return;

        if (btn.classList.contains('reorder-trigger-btn')) {
            const qty = prompt("Quantity to reorder from Supplier:");
            if (!qty || isNaN(qty)) return alert("Valid quantity required.");
            try {
                await patchData(`inventory/${id}/`, { reorder_status: 'Pending', last_reorder_qty: parseFloat(qty) });
                alert("Reorder request logged as PENDING.");
                await refreshInventoryUI(true);
            } catch (err) { alert(err.message); }
        }

        if (btn.classList.contains('fulfill-btn')) {
            const item = state.inventory.find(i => String(i.id) === String(id));
            if (!confirm(`Mark reorder of ${item.last_reorder_qty} units as Fulfilled?`)) return;
            try {
                const newQty = (parseFloat(item.quantity) || 0) + (parseFloat(item.last_reorder_qty) || 0);
                await patchData(`inventory/${id}/`, { reorder_status: 'Fulfilled', quantity: newQty });
                alert("Stock synchronized and reorder marked FULFILLED.");
                await refreshInventoryUI(true);
            } catch (err) { alert(err.message); }
        }

        if (btn.classList.contains('edit-item-btn')) {
            const item = state.inventory.find(i => String(i.id) === String(id));
            if (!item) return;
            document.getElementById('modalTitle').innerText = "Edit Stock Parameters";
            document.getElementById('editing_id').value = id;
            document.getElementById('fk_item_id').value = item.fk_item;
            document.getElementById('threshold_val').value = item.reorder_level;
            document.getElementById('current_qty').value = item.quantity;
            modal.style.display = 'flex';
        }
    };

    // Main inventory form submit (save)
    const invForm = document.getElementById('inventoryForm');
    if (invForm) {
        invForm.onsubmit = async (e) => {
            e.preventDefault();
            const editId = document.getElementById('editing_id').value;
            const payload = {
                fk_item: document.getElementById('fk_item_id').value,
                reorder_level: parseFloat(document.getElementById('threshold_val').value),
                quantity: parseFloat(document.getElementById('current_qty').value),
                fk_branch: state.user?.fk_branch_id || 1
            };
            try {
                const endpoint = editId ? `inventory/${editId}/` : 'inventory/';
                const method = editId ? 'PATCH' : 'POST';
                await fetchData(endpoint, method, payload);
                modal.style.display = 'none';
                await refreshInventoryUI(true);
                alert("Inventory saved successfully.");
            } catch (err) { alert("Database Error: " + err.message); }
        };
    }
}