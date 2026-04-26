// js/views/products.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData, patchData } from "../api.js";

export function renderProducts() {
    const products = state.products || [];
    const categories = state.categories || [];
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    const isAdmin = role === 'admin';

    return `
    <div class="products-view" style="padding:25px; background:#fdfaf9; color:#3e2723; font-family:'Roboto',sans-serif; animation: fadeIn 0.3s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <div>
                <h2 style="color:#3e2723; margin:0; font-weight:800;">PRODUCT CATALOG</h2>
                <p style="color:#8d6e63; margin:5px 0 0 0; font-size:0.9rem;">
                    Scope: ${isAdmin ? 'Global Operations' : (state.user.branch_name || 'Branch Specific')}
                </p>
                <p style="color:#8d6e63; margin:5px 0 0; font-size:0.8rem;">Total Products: ${products.length}</p>
            </div>
            ${isAdmin ? `
            <button id="addNewProduct" style="background:#5d4037; color:white; border:none; padding:12px 24px; border-radius:8px; cursor:pointer; font-weight:700;">
                ADD NEW PRODUCT
            </button>` : ''}
        </div>

        <div style="background:white; padding:15px; border-radius:12px; display:flex; gap:15px; margin-bottom:25px; border:1px solid #e0d7d5;">
            <input type="text" id="pSearch" placeholder="Search by name or code..." 
                   style="flex:1; padding:12px; border:1px solid #ddd; border-radius:8px; outline:none; font-size:0.9rem;">
            
            <select id="fCat" style="padding:12px; border:1px solid #ddd; border-radius:8px; min-width:200px; background:white; cursor:pointer; font-weight:600; color:#5d4037;">
                <option value="all">All Categories</option>
                ${categories.map(c => `<option value="${c.id || c.category_id}">${c.category_name}</option>`).join('')}
            </select>
        </div>

        <div id="productGrid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:25px;">
            ${renderProductList(products, isAdmin)}
        </div>
    </div>

    <div id="productModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; align-items:center; justify-content:center; backdrop-filter: blur(2px);">
        <div style="background:white; width:500px; max-width:90%; border-radius:16px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); overflow:hidden;">
            <div style="padding:25px; border-bottom: 2px solid #f8f5f2; display:flex; justify-content:space-between; align-items:center;">
                <h3 id="modalTitle" style="margin:0; color:#3e2723; font-weight:800;">Product Profile</h3>
                <button id="closeProductModal" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#bbb;">&times;</button>
            </div>
            <div id="modalContent" style="padding:30px; max-height:75vh; overflow-y:auto;"></div>
        </div>
    </div>`;
}

function renderProductList(products, isAdmin) {
    if (!products || products.length === 0) {
        return '<div style="grid-column: 1/-1; text-align:center; padding:100px; color:#999; background:white; border-radius:15px; border: 1px solid #e0d7d5;">No products localized for this branch.</div>';
    }

    const SERVER_URL = "http://127.0.0.1:8000";
    const fallbackIcon = "https://img.icons8.com/fluency/96/bread.png";

    return products.map(p => {
        let imgSource = fallbackIcon;
        
        if (p.image_full_url) {
            imgSource = p.image_full_url;
            if (imgSource.includes('/media//media/')) {
                imgSource = imgSource.replace('/media//media/', '/media/');
            }
        } else if (p.image_url) {
            if (p.image_url.startsWith('/media/')) {
                imgSource = SERVER_URL + p.image_url;
            } else {
                imgSource = SERVER_URL + "/media/" + p.image_url;
            }
        }

        const isActive = p.is_active === true || p.is_active === 1;
        const statusText = isActive ? "ENABLED" : "DISABLED";
        const statusColor = isActive ? "#2e7d32" : "#c62828";
        const blockBtnText = isActive ? "BLOCK" : "UNBLOCK";

        return `
            <div class="product-card" style="background:white; border-radius:12px; border:1px solid #e0d7d5; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                <div style="height:160px; background:#fffcf9; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #f8f5f2;">
                    <img src="${imgSource}" onerror="this.src='${fallbackIcon}';" 
                         style="width:100%; height:100%; object-fit:contain;" alt="${p.product_name}">
                </div>
                <div style="padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div>
                            <h4 style="margin:0; color:#3e2723; font-size:1.1rem; font-weight:800;">${p.product_name}</h4>
                            <p style="color:#8d6e63; font-size:0.8rem; margin:5px 0; font-weight:700; text-transform:uppercase;">${p.category_name}</p>
                        </div>
                        <span style="font-size:0.65rem; background:#efebe9; color:#5d4037; padding:3px 8px; border-radius:4px; font-weight:800;">${p.product_code || '---'}</span>
                    </div>
                    
                    <div style="margin:15px 0; font-size:0.8rem; color:#8d6e63; line-height:1.4;">
                        <strong>Active At:</strong> ${p.assigned_branches || 'Global'}<br>
                        <strong>Status:</strong> <span style="color:${statusColor}">${statusText}</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid #f8f5f2; padding-top:15px; margin-top:10px;">
                        <div>
                            <div style="color:#d2691e; font-weight:800; font-size:1.2rem;">₹${parseFloat(p.base_price || 0).toFixed(2)}</div>
                            <div style="font-size:0.65rem; color:#bbb; font-weight:700; text-transform:uppercase;">Unit: ${p.unit || 'PCS'}</div>
                        </div>
                        <div style="display:flex; gap:10px;">
                            <button class="view-recipe-btn" data-id="${p.id}" style="background:#fff3e0; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:700; color:#e65100; font-size:0.75rem;">RECIPE</button>
                            ${isAdmin ? `
                            <button class="edit-prod-btn" data-id="${p.id}" style="background:#efebe9; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:700; color:#5d4037; font-size:0.75rem;">EDIT</button>
                            <button class="block-unblock-btn" data-id="${p.id}" data-active="${isActive}" style="background:#ffebee; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; font-weight:700; color:#c62828; font-size:0.75rem;">${blockBtnText}</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}

export function bindProductActions() {
    const searchInput = document.getElementById('pSearch');
    const catSelect = document.getElementById('fCat');
    const grid = document.getElementById('productGrid');
    const modal = document.getElementById('productModal');

    const applyFilters = () => {
        const query = (searchInput?.value || '').toLowerCase();
        const catId = catSelect?.value;
        const filtered = state.products.filter(p => {
            const matchesSearch = p.product_name.toLowerCase().includes(query) || (p.product_code && p.product_code.toLowerCase().includes(query));
            const matchesCat = catId === 'all' || String(p.fk_category) === String(catId);
            return matchesSearch && matchesCat;
        });
        const isAdmin = (state.user?.role || '').toLowerCase() === 'admin';
        if (grid) grid.innerHTML = renderProductList(filtered, isAdmin);
    };

    if (searchInput) searchInput.oninput = applyFilters;
    if (catSelect) catSelect.onchange = applyFilters;

    if (grid) {
        grid.onclick = async (e) => {
            const id = e.target.dataset.id;
            if (!id) return;
            const product = state.products.find(p => String(p.id) === String(id));
            if (!product) return;

            if (e.target.classList.contains('edit-prod-btn')) showProductForm(product);
            if (e.target.classList.contains('view-recipe-btn')) showRecipeView(product);
            if (e.target.classList.contains('block-unblock-btn')) {
                const newActiveStatus = !(product.is_active === true || product.is_active === 1);
                const action = newActiveStatus ? "unblock" : "block";
                if (confirm(`Are you sure you want to ${action} "${product.product_name}"?`)) {
                    try {
                        await patchData(`products/${id}/`, { is_active: newActiveStatus });
                        alert(` Product ${action}ed successfully.`);
                        await refreshGlobalState();
                        const root = document.getElementById('view-root');
                        if (root) {
                            root.innerHTML = renderProducts();
                            bindProductActions();
                        }
                    } catch (err) {
                        alert(`❌ Failed to ${action} product: ${err.message}`);
                    }
                }
            }
        };
    }

    document.getElementById('addNewProduct')?.addEventListener('click', () => showProductForm());
    document.getElementById('closeProductModal')?.addEventListener('click', () => modal.style.display = 'none');
}

function showRecipeView(product) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');

    title.innerText = "Recipe: " + product.product_name;
    content.innerHTML = `
        <div style="background:#fff9f0; padding:25px; border-radius:12px; border-left:6px solid #d2691e; white-space: pre-wrap; font-size:0.95rem; line-height:1.6; color:#3e2723; margin-bottom:20px;">
            ${product.recipe_instructions || "No recipe instructions found in database."}
        </div>
        <button onclick="document.getElementById('productModal').style.display='none'" 
                style="width:100%; padding:14px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800;">CLOSE VIEW</button>
    `;
    modal.style.display = 'flex';
}

function showProductForm(product = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
    const categories = [...state.categories];
    
    title.innerText = product ? "Update Product" : "Register New Product";
    content.innerHTML = `
        <form id="prodForm" style="display:flex; flex-direction:column; gap:18px;">
            <div>
                <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Product Name *</label>
                <input type="text" name="product_name" value="${product?.product_name || ''}" required 
                       style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing:border-box; outline:none;">
            </div>
            
            <div style="display:flex; gap:15px;">
                <div style="flex:1;">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Sale Price (₹) *</label>
                    <input type="number" step="0.01" name="base_price" value="${product?.base_price || ''}" required 
                           style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing:border-box;">
                </div>
                <div style="flex:1;">
                    <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Cost Price (₹) *</label>
                    <input type="number" step="0.01" name="cost_price" value="${product?.cost_price || ''}" required 
                           style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing:border-box;">
                </div>
            </div>

            <div>
                <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Assigned Category *</label>
                <select name="fk_category" required style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; background:white; font-weight:600; color:#3e2723;">
                    <option value="">-- Select Category --</option>
                    ${categories.map(c => {
                        const catId = c.id || c.category_id;
                        const catName = c.category_name;
                        const selected = product && (product.fk_category === catId || product.category_id === catId) ? 'selected' : '';
                        return '<option value="' + catId + '" ' + selected + '>' + catName + '</option>';
                    }).join('')}
                </select>
                ${categories.length === 0 ? '<p style="color:red; font-size:0.7rem; margin-top:5px;">Warning: No categories available! Please create a category first.</p>' : ''}
                <p style="font-size:0.65rem; color:#8d6e63; margin-top:5px;">Note: Branch visibility is inherited from the selected category.</p>
            </div>

            <div>
                <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Product Image</label>
                <input type="file" name="image" accept="image/*" style="width:100%; padding:10px; border:1px dashed #ddd; border-radius:8px;">
                ${product?.image_url ? '<p style="font-size:0.65rem; color:#8d6e63; margin-top:5px;">Current: ' + product.image_url.split(/[\\/]/).pop() + '</p>' : ''}
            </div>

            <div>
                <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Product Code (SKU)</label>
                <input type="text" name="product_code" value="${product?.product_code || ''}" 
                       style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing:border-box;">
            </div>

            <div>
                <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Unit of Measure</label>
                <input type="text" name="unit" value="${product?.unit || 'PCS'}" 
                       style="width:100%; padding:12px; border:1px solid #ddd; border-radius:8px; box-sizing:border-box;">
            </div>

            <div>
                <label style="display:block; font-size:0.75rem; font-weight:800; color:#8d6e63; margin-bottom:8px; text-transform:uppercase;">Recipe Instructions</label>
                <textarea name="recipe_instructions" placeholder="Enter ingredients and method..." 
                          style="width:100%; height:120px; padding:12px; border:1px solid #ddd; border-radius:8px; resize:none; box-sizing:border-box; font-family:inherit; outline:none;">${product?.recipe_instructions || ''}</textarea>
            </div>

            <div style="display:flex; gap:12px; margin-top:10px;">
                <button type="button" onclick="document.getElementById('productModal').style.display='none'" 
                        style="flex:1; padding:14px; border:1px solid #ddd; background:#f5f5f5; border-radius:10px; cursor:pointer; font-weight:700; color:#666;">CANCEL</button>
                <button type="submit" id="saveProdBtn" 
                        style="flex:1; padding:14px; background:#5d4037; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800;">SAVE TO DATABASE</button>
            </div>
        </form>
    `;

    modal.style.display = 'flex';

    const form = document.getElementById('prodForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveProdBtn');
            const formData = new FormData(e.target);
            formData.append('is_active', 'true');

            try {
                btn.disabled = true;
                btn.innerText = "SYNCHRONIZING...";
                
                const id = product?.id;
                const url = id ? `products/${id}/` : 'products/';
                const method = id ? 'PATCH' : 'POST';
                
                const response = await fetchData(url, method, formData);
                console.log("Product API Response:", response);
                
                //  Show blocking alert – modal stays open until OK is clicked
                alert(` Product "${response.product_name || formData.get('product_name')}" saved successfully!\nClick OK to refresh the list.`);
                
                //  Now close the modal
                modal.style.display = 'none';
                
                //  Force refresh global state (fetch latest data from server)
                await refreshGlobalState();
                
                //  Small delay to ensure backend has fully processed (optional)
                await new Promise(resolve => setTimeout(resolve, 200));
                
                //  Re-render the entire products view
                const root = document.getElementById('view-root');
                if (root) {
                    root.innerHTML = renderProducts();
                    bindProductActions();
                }
                
                //  Re-apply current filters so the new product shows immediately
                const searchInputAfter = document.getElementById('pSearch');
                const catSelectAfter = document.getElementById('fCat');
                if (searchInputAfter && catSelectAfter) {
                    const query = (searchInputAfter.value || '').toLowerCase();
                    const catId = catSelectAfter.value;
                    const filtered = state.products.filter(p => {
                        const matchesSearch = p.product_name.toLowerCase().includes(query) || 
                                             (p.product_code && p.product_code.toLowerCase().includes(query));
                        const matchesCat = catId === 'all' || String(p.fk_category) === String(catId);
                        return matchesSearch && matchesCat;
                    });
                    const isAdmin = (state.user?.role || '').toLowerCase() === 'admin';
                    const gridAfter = document.getElementById('productGrid');
                    if (gridAfter) gridAfter.innerHTML = renderProductList(filtered, isAdmin);
                }
                
            } catch (err) {
                console.error("Save failed:", err);
                // ❌ Error alert – modal stays open
                alert(`❌ Error: ${err.message}\nPlease check your data and try again.`);
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = "SAVE TO DATABASE";
                }
            }
        };
    }
}