// js/views/orders.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData, deleteData } from "../api.js";
import { renderProductGrid, refreshProductGrid } from "../components/productGrid.js";

let localCart = [];
let searchTerm = "";

export function renderOrders() {
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    const isServiceStaff = ['staff', 'cashier', 'sales', 'service staff', 'service_staff'].includes(role);

    if (role === 'baker') {
        return `
            <div style="padding:50px; text-align:center; color:#721c24; background:#fff5f5; border-radius:12px; margin:20px; border: 1px solid #f5c6cb;">
                <div style="font-size: 3rem; margin-bottom:10px;">⛔</div>
                <h2 style="margin:0;">Access Denied</h2>
                <p>Production staff (Bakers) do not have access to the POS module.</p>
            </div>`;
    }

    if (['admin', 'manager', 'branch manager'].includes(role) || isServiceStaff) {
        return renderOrderSummary(isServiceStaff);
    }

    return renderPOS();
}

function renderOrderSummary(isStaff = false) {
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    const isAdmin = role === 'admin';
    const userBranchId = state.user?.fk_branch_id || state.user?.fk_branch || 1;
    
    let baseOrders = (state.orders || []);
    if (!isAdmin) {
        baseOrders = baseOrders.filter(o => String(o.fk_branch) === String(userBranchId));
    }

    const branches = state.branches || [];

    return `
        <div style="animation: fadeIn 0.3s ease-in; padding: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                <div>
                    <h2 style="color:#3e2723; margin:0; font-weight:800;">Order Management</h2>
                    <p style="color:#8d6e63; margin:5px 0 0 0;"></p>
                </div>
                <div style="display:flex; gap:15px; align-items:center;">
                    ${isStaff ? `<button id="openPOSBtn" style="padding:12px 25px; background:#2e7d32; color:white; border:none; border-radius:8px; font-weight:800; cursor:pointer;">+ NEW SALE</button>` : ''}
                    <div style="background:#5d4037; padding:10px 20px; border-radius:10px; color:white; text-align:right;">
                        <div style="font-size:0.6rem; text-transform:uppercase; opacity:0.8;">Total Revenue</div>
                        <div style="font-size:1.2rem; font-weight:bold;" id="totalRevenueDisplay">₹0</div>
                    </div>
                </div>
            </div>

            <div style="background:white; padding:15px; border-radius:12px; border:1px solid #e0d7d5; margin-bottom:25px; display:flex; gap:15px; align-items:flex-end;">
                <div style="flex:2;">
                    <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Search</label>
                    <input type="text" id="orderSearch" placeholder="Order ID or Customer name..." 
                           style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; outline:none;">
                </div>
                ${isAdmin ? `
                <div style="flex:1;">
                    <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Branch Filter</label>
                    <select id="orderBranchFilter" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
                        <option value="All">All Branches</option>
                        ${branches.map(b => `<option value="${b.id}">${b.branch_name}</option>`).join('')}
                    </select>
                </div>
                ` : ''}
            </div>

            <div style="background:white; border-radius:12px; overflow:hidden; border: 1px solid #e0d7d5; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead>
                            <tr style="background:#efebe9; color:#5d4037;">
                                <th style="padding:15px; font-size:0.75rem; text-transform:uppercase;">Order ID</th>
                                <th style="padding:15px; font-size:0.75rem; text-transform:uppercase;">Customer</th>
                                <th style="padding:15px; font-size:0.75rem; text-transform:uppercase;">Branch</th>
                                <th style="padding:15px; font-size:0.75rem; text-transform:uppercase;">Status</th>
                                <th style="padding:15px; font-size:0.75rem; text-transform:uppercase;">Total</th>
                                <th style="padding:15px; font-size:0.75rem; text-transform:uppercase; text-align:center;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="orderTableBody">
                            ${renderOrderRows(baseOrders, isStaff, isAdmin)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="orderDetailModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:10002; justify-content:center; align-items:center; backdrop-filter: blur(2px);">
             <div style="background:white; padding:30px; border-radius:16px; width:500px; max-height:80vh; overflow-y:auto;" id="orderDetailContent"></div>
        </div>
    `;
}

function renderOrderRows(orders, isStaff, isAdmin) {
    if (!orders || orders.length === 0) {
        return `<tr><td colspan="6" style="text-align:center; padding:40px; color:#999;">No orders found.纽约</tr>`;
    }

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const totalRevenueEl = document.getElementById('totalRevenueDisplay');
    if (totalRevenueEl) totalRevenueEl.innerText = `₹${totalRevenue.toLocaleString('en-IN')}`;

    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    const canView = isAdmin || role.includes('manager');

    return orders.map(o => {
        const branchDisplay = o.branch_name || `Branch ${o.fk_branch}`;
        return `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:15px; font-weight:bold; color:#5d4037;">#${o.id || o.order_id}</td>
            <td style="padding:15px;"><b>${o.customer_name || 'Walk-in'}</b></td>
            <td style="padding:15px;">${branchDisplay}</td>
            <td style="padding:15px;"><span style="color: ${o.payment_status === 'paid' ? '#2e7d32' : '#d32f2f'}; font-weight:bold; text-transform:uppercase; font-size:0.65rem;">${o.payment_status}</span></td>
            <td style="padding:15px; font-weight:800; color:#5d4037;">₹${parseFloat(o.total_amount).toLocaleString('en-IN')}</td>
            <td style="padding:15px; text-align:center;">
                <div style="display:flex; gap:8px; justify-content:center;">
                    ${canView ? `<button class="view-order-btn" data-id="${o.id}" style="background:#efebe9; border:none; padding:6px 10px; border-radius:4px; font-size:0.65rem; font-weight:800; cursor:pointer;">VIEW</button>` : ''}
                    ${isStaff ? `<button class="cancel-order-btn" data-id="${o.id}" style="background:#ffebee; color:#c62828; border:none; padding:6px 10px; border-radius:4px; font-size:0.65rem; font-weight:800; cursor:pointer;">CANCEL</button>` : ''}
                </div>
            </td>
        </tr>`;
    }).join('');
}

function renderPOS() {
    return `
    <div style="display: flex; height: calc(100vh - 110px); gap: 20px; animation: fadeIn 0.3s ease; padding: 20px; background:#fdfaf9;">
        <div style="flex: 1; background: white; padding: 20px; border-radius: 15px; border: 1px solid #e0d7d5; display: flex; flex-direction: column; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
            <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
                <button id="backToHistory" style="background:#5d4037; color:white; border:none; padding:8px 15px; border-radius:6px; cursor:pointer; font-size:0.75rem; font-weight:800;">← BACK TO LIST</button>
                <div style="position:relative; width:300px;">
                    <input type="text" id="posSearch" placeholder="Search products..." value="${searchTerm}"
                       style="width:100%; padding:10px 12px 10px 40px; border-radius:25px; border:1px solid #d7ccc8; outline:none; font-size:0.9rem;">
                </div>
            </div>
            <div id="posGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; overflow-y: auto; padding: 5px;">
                <!-- Product grid will be inserted by component -->
            </div>
        </div>

        <div style="width: 420px; background: #efebe9; color:#3e2723; border-radius:15px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #d7ccc8; overflow:hidden;">
            <div style="background:#5d4037; padding:20px; color:white;">
                <h3 style="margin:0; font-weight:800;">Current Cart</h3>
            </div>
            <div style="padding:20px; display:flex; flex-direction:column; gap:12px;">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <label style="font-size:0.7rem; color:#795548; font-weight:800; text-transform:uppercase;">Customer Selection</label>
                        <button onclick="window.openQuickCustomerModal()" style="background:none; border:none; color:#5d4037; font-size:0.7rem; font-weight:800; cursor:pointer; text-decoration:underline;">+ REGISTER NEW</button>
                    </div>
                    <select id="custSelect" style="width:100%; padding:12px; border:1px solid #d7ccc8; border-radius:8px; background:white; color:#3e2723; margin-top:5px; cursor:pointer;">
                        <option value="">-- Choose Customer --</option>
                        <option value="walkin">Walk-in Customer</option>
                        ${(state.customers || []).map(c => `<option value="${c.id}">${c.name || c.customer_name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-size:0.7rem; color:#795548; font-weight:800; text-transform:uppercase;">Payment Mode</label>
                    <select id="payMode" style="width:100%; padding:12px; border:1px solid #d7ccc8; border-radius:8px; background:white; color:#3e2723; margin-top:5px; cursor:pointer;">
                        <option value="cash">Cash Payment</option>
                        <option value="upi">UPI / Online</option>
                        <option value="card">Credit/Debit Card</option>
                    </select>
                </div>
            </div>

            <div id="cartArea" style="flex:1; overflow-y:auto; margin:0 20px; border-top: 1px solid #d7ccc8; padding-top:15px;">
                ${renderCartItems()}
            </div>

            <div style="background:#d7ccc8; padding:20px; border-top:1px solid #bcaaa4;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:1.8rem; font-weight:800; margin-bottom:15px; color:#3e2723;">
                    <span style="font-size: 1rem; color: #5d4037;">GRAND TOTAL</span>
                    <span id="grandTotal">₹0</span>
                </div>
                <button id="placeOrderBtn" style="width:100%; padding:18px; background:#2e7d32; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:800; font-size:1.1rem;">PLACE ORDER</button>
            </div>
        </div>
    </div>

    <div id="quickCustomerModal" style="display:none; position:fixed; inset:0; background:rgba(62, 39, 35, 0.8); z-index:9999; align-items:center; justify-content:center; backdrop-filter:blur(4px);">
        <div style="background:white; padding:30px; border-radius:20px; width:400px; color:#3e2723; border: 3px solid #5d4037;">
            <h3 style="margin-top:0; color:#5d4037; font-weight:800;">Register New Customer</h3>
            <p style="font-size:0.75rem; color:#8d6e63; margin-bottom:15px;">Add this customer to ${state.user?.branch_name || 'Active Branch'} branch.</p>
            <form id="quickCustForm">
                <input type="text" name="customer_name" placeholder="Full Name" required style="width:100%; padding:12px; margin-bottom:10px; border:1px solid #ddd; border-radius:8px;">
                <input type="text" name="customer_phone" placeholder="Contact Number (10 digits)" required style="width:100%; padding:12px; margin-bottom:20px; border:1px solid #ddd; border-radius:8px;">
                <div style="display:flex; gap:10px;">
                    <button type="button" onclick="window.closeQuickCustomerModal()" style="flex:1; padding:12px; background:#eee; border:none; border-radius:8px; cursor:pointer; font-weight:700;">Cancel</button>
                    <button type="submit" style="flex:1; padding:12px; background:#5d4037; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:800;">Save & Select</button>
                </div>
            </form>
        </div>
    </div>

    <div id="billModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:10005; justify-content:center; align-items:center; backdrop-filter:blur(3px);">
        <div style="background:white; width:500px; max-width:90%; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.3); overflow:hidden;">
            <div style="background:#5d4037; padding:20px; color:white; text-align:center;">
                <h3 style="margin:0;">BILL INVOICE</h3>
            </div>
            <div id="billContent" style="padding:30px; max-height:70vh; overflow-y:auto; font-family:monospace; font-size:14px; background:#fff8f0;"></div>
            <div style="padding:20px; display:flex; gap:15px; background:#f5f5f5;">
                <button id="closeBillBtn" style="flex:1; padding:12px; background:#666; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:800;">CLOSE</button>
                <button id="printBillBtn" style="flex:1; padding:12px; background:#2e7d32; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:800;">PRINT BILL</button>
            </div>
        </div>
    </div>
    `;
}

function renderCartItems() {
    if (localCart.length === 0) return `<div style="text-align:center; color:#a1887f; margin-top:50px; font-style:italic;">Select items to start order...</div>`;
    return localCart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:white; padding:10px 15px; border-radius:10px; border: 1px solid #d7ccc8;">
            <div style="flex:2;">
                <div style="font-weight:800; font-size:0.85rem;">${item.product_name}</div>
                <div style="font-size:0.7rem; color:#795548;">₹${parseFloat(item.base_price || 0).toFixed(0)} per unit</div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <button onclick="window.adjustQty('${item.id}', -1)" style="width:28px; height:28px; border:none; background:#d7ccc8; border-radius:6px; font-weight:bold; cursor:pointer;">-</button>
                <span style="font-weight:900; min-width:30px; text-align:center; font-size:1rem;">${item.qty}</span>
                <button onclick="window.adjustQty('${item.id}', 1)" style="width:28px; height:28px; border:none; background:#d7ccc8; border-radius:6px; font-weight:bold; cursor:pointer;">+</button>
            </div>
            <div style="min-width:70px; text-align:right; font-weight:800; color:#3e2723;">
                ₹${(parseFloat(item.base_price || 0) * item.qty).toFixed(0)}
            </div>
        </div>`).join('');
}

export function bindOrderActions() {
    const root = document.getElementById("view-root");
    const searchInput = document.getElementById('orderSearch');
    const branchFilter = document.getElementById('orderBranchFilter');
    const tbody = document.getElementById('orderTableBody');

    function refreshOrderTable() {
        let orders = [...(state.orders || [])];
        const role = (state.user?.role || state.user?.designation || '').toLowerCase();
        const isAdmin = role === 'admin';
        const userBranchId = state.user?.fk_branch_id || state.user?.fk_branch || 1;
        if (!isAdmin) orders = orders.filter(o => String(o.fk_branch) === String(userBranchId));
        const searchTermVal = searchInput ? searchInput.value.toLowerCase() : '';
        if (searchTermVal) orders = orders.filter(o => String(o.id).includes(searchTermVal) || (o.customer_name && o.customer_name.toLowerCase().includes(searchTermVal)));
        if (branchFilter && branchFilter.value !== 'All') orders = orders.filter(o => o.fk_branch === parseInt(branchFilter.value));
        const isStaff = ['staff', 'cashier', 'sales', 'service staff', 'service_staff'].includes(role);
        if (tbody) tbody.innerHTML = renderOrderRows(orders, isStaff, isAdmin);
    }

    if (searchInput) searchInput.oninput = refreshOrderTable;
    if (branchFilter) branchFilter.onchange = refreshOrderTable;

    // ---------- POS button: refresh state, render POS, then initialise product grid ----------
    const openBtn = document.getElementById('openPOSBtn');
    if (openBtn) {
        openBtn.addEventListener('click', async () => {
            await refreshGlobalState();
            root.innerHTML = renderPOS();
            bindOrderActions();

            const gridContainer = document.getElementById('posGrid');
            if (gridContainer) {
                renderProductGrid(gridContainer, searchTerm, (productId) => {
                    window.addToCart(productId);
                });
            }

            const searchInputField = document.getElementById('posSearch');
            if (searchInputField) {
                const newSearchInput = searchInputField.cloneNode(true);
                searchInputField.parentNode.replaceChild(newSearchInput, searchInputField);
                newSearchInput.addEventListener('input', (e) => {
                    searchTerm = e.target.value;
                    refreshProductGrid(searchTerm);
                });
            }
        });
    }

    const backBtn = document.getElementById('backToHistory');
    if (backBtn) {
        backBtn.addEventListener('click', async () => {
            await refreshGlobalState();
            root.innerHTML = renderOrders();
            bindOrderActions();
        });
    }

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) placeOrderBtn.addEventListener('click', submitOrder);

    root.onclick = async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('cancel-order-btn')) {
            if (confirm("Cancel this order? Inventory will be returned to stock immediately.")) {
                try {
                    await deleteData(`orders/${id}`);
                    alert("Order cancelled successfully.");
                    await refreshAndReRender();
                } catch (err) { alert(err.message); }
            }
        }

        if (e.target.classList.contains('view-order-btn')) {
            const order = (state.orders || []).find(o => String(o.id) === String(id));
            if (!order) return;
            const modal = document.getElementById('orderDetailModal');
            document.getElementById('orderDetailContent').innerHTML = `
                <h3 style="color:#5d4037; border-bottom:2px solid #eee; padding-bottom:10px; font-weight:800;">Order Detail #${order.id}</h3>
                <div style="margin:15px 0; font-size:0.9rem; line-height:1.6;">
                    <b>Customer:</b> ${order.customer_name || 'Walk-in'}<br>
                    <b>Date:</b> ${order.order_date}<br>
                    <b>Branch:</b> ${order.branch_name || `Branch ${order.fk_branch}`}<br>
                    <b>Status:</b> ${order.payment_status.toUpperCase()} | <b>Mode:</b> ${order.payment_mode.toUpperCase()}
                </div>
                <table style="width:100%; border-collapse:collapse; margin-top:15px;">
                    <tr style="background:#f8f5f2; font-size:0.7rem; text-transform:uppercase; letter-spacing:1px;">
                        <th style="padding:10px; text-align:left;">Product</th>
                        <th style="padding:10px; text-align:center;">Qty</th>
                        <th style="padding:10px; text-align:right;">Total</th>
                    </tr>
                    ${(order.items || []).map(i => `
                        <tr style="border-bottom:1px solid #eee; font-size:0.85rem;">
                            <td style="padding:10px;">${i.product_name}</td>
                            <td style="padding:10px; text-align:center;">${parseFloat(i.quantity).toFixed(0)}</td>
                            <td style="padding:10px; text-align:right;">₹${(parseFloat(i.quantity) * parseFloat(i.price)).toLocaleString()}</td>
                        </tr>`).join('')}
                    <tr>
                        <td colspan="2" style="padding:15px; text-align:right; font-weight:800;">GRAND TOTAL:</td>
                        <td style="padding:15px; text-align:right; font-weight:800; color:#5d4037;">₹${parseFloat(order.total_amount).toLocaleString()}</td>
                    </tr>
                </table>
                <button id="closeDetailBtn" style="width:100%; margin-top:20px; padding:12px; background:#5d4037; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:800;">CLOSE SUMMARY</button>
            `;
            modal.style.display = 'flex';
            document.getElementById('closeDetailBtn').onclick = () => modal.style.display = 'none';
        }
    };

    const quickCustForm = document.getElementById('quickCustForm');
    if (quickCustForm) {
        quickCustForm.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(quickCustForm);
            const payload = {
                customer_name: formData.get('customer_name').trim(),
                customer_phone: formData.get('customer_phone').trim(),
                fk_branch: state.user?.fk_branch_id || state.user?.fk_branch || 1
            };
            try {
                const newCust = await fetchData('customers/', 'POST', payload);
                await refreshGlobalState();
                window.closeQuickCustomerModal();
                root.innerHTML = renderPOS();
                bindOrderActions();
                const grid = document.getElementById('posGrid');
                if (grid) {
                    renderProductGrid(grid, searchTerm, (productId) => {
                        window.addToCart(productId);
                    });
                }
                setTimeout(() => {
                    const select = document.getElementById('custSelect');
                    if (select) select.value = newCust.id;
                }, 100);
            } catch (err) { alert("Registration Failed: " + err.message); }
        };
    }

    // ---------- FIXED: Bill modal event handling (reliable close button) ----------
    const billModal = document.getElementById('billModal');
    if (billModal) {
        // Remove any stale listeners by cloning and replacing buttons
        const closeBtn = document.getElementById('closeBillBtn');
        const printBtn = document.getElementById('printBillBtn');
        
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.addEventListener('click', async () => {
                billModal.style.display = 'none';
                await refreshAndReRender();
            });
        }
        
        if (printBtn) {
            const newPrintBtn = printBtn.cloneNode(true);
            printBtn.parentNode.replaceChild(newPrintBtn, printBtn);
            newPrintBtn.addEventListener('click', () => {
                const billContent = document.getElementById('billContent').innerHTML;
                const printWindow = window.open('', '_blank', 'width=800,height=600');
                printWindow.document.write(`
                    <html><head><title>Bakery Bill</title>
                    <style>
                        body { font-family: monospace; margin: 20px; }
                        .bill-header { text-align: center; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border-bottom: 1px dashed #ccc; padding: 8px 4px; text-align: left; }
                        .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; text-align: right; }
                    </style>
                    </head><body>${billContent}</body></html>
                `);
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            });
        }
    }

    refreshOrderTable();
}

async function submitOrder() {
    if (localCart.length === 0) return alert("Your cart is empty. Please select products first.");
    const btn = document.getElementById('placeOrderBtn');
    const custId = document.getElementById('custSelect').value;
    if (!custId) return alert("Please select a customer or register a new one.");

    const total = localCart.reduce((sum, i) => sum + (parseFloat(i.base_price) * i.qty), 0);
    const payload = {
        payment_mode: document.getElementById('payMode').value,
        total_amount: total,
        items: localCart.map(i => ({ fk_product: i.id, quantity: i.qty, price: i.base_price }))
    };
    payload.fk_customer = (custId === "walkin") ? null : custId;

    try {
        btn.disabled = true;
        btn.innerText = "PROCESSING...";
        const orderResponse = await fetchData('orders/', 'POST', payload);
        
        const branchName = state.user?.branch_name || "Bakery System";
        const orderDate = new Date().toLocaleString();
        const customerName = (custId === "walkin") ? "Walk-in Customer" : (document.querySelector('#custSelect option:checked')?.text || "Customer");
        const paymentMode = document.getElementById('payMode').options[document.getElementById('payMode').selectedIndex]?.text || "Cash";
        
        let billHtml = `
            <div class="bill-header">
                <h2>${branchName}</h2>
                <p>123 Bakery Street, Ahmedabad</p>
                <p>Phone: +91 98765 43210</p>
                <p>GST: 24ABCDE1234F1Z5</p>
                <hr>
                <h3>TAX INVOICE</h3>
                <p>Order #: ${orderResponse.id || orderResponse.order_id}</p>
                <p>Date: ${orderDate}</p>
                <p>Customer: ${customerName}</p>
                <p>Payment Mode: ${paymentMode}</p>
            </div>
            <div class="bill-details">
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
                    <tbody>
                        ${localCart.map(item => `
                            <tr>
                                <td>${item.product_name}</td>
                                <td style="text-align:center">${item.qty}</td>
                                <td style="text-align:right">₹${parseFloat(item.base_price).toFixed(0)}</td>
                                <td style="text-align:right">₹${(parseFloat(item.base_price) * item.qty).toFixed(0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="total">Grand Total: ₹${total.toFixed(0)}</div>
                <div style="margin-top: 20px; text-align:center;">
                    <p>Thank you for your purchase!</p>
                    <p>This is a system generated invoice.</p>
                </div>
            </div>
        `;
        document.getElementById('billContent').innerHTML = billHtml;
        document.getElementById('billModal').style.display = 'flex';
        
        // Clear cart but do NOT refresh the view yet – let the user close the modal first
        localCart = [];
        const cartArea = document.getElementById('cartArea');
        if (cartArea) cartArea.innerHTML = renderCartItems();
        updateCartTotals();
        
        // No alert, no automatic refresh. The modal's close button will refresh the order list.
    } catch (err) {
        alert("Order Failed: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "PLACE ORDER";
    }
}

async function refreshAndReRender() {
    await refreshGlobalState();
    const root = document.getElementById("view-root");
    if (root) {
        root.innerHTML = renderOrders();
        bindOrderActions();
    }
}

// Global UI Helpers
window.addToCart = (productId) => {
    const product = (state.products || []).find(p => String(p.id || p.product_id) === String(productId));
    const existing = localCart.find(item => String(item.id || item.product_id) === String(productId));
    if (existing) existing.qty += 1;
    else localCart.push({ ...product, id: product.id || product.product_id, qty: 1 });
    const area = document.getElementById('cartArea');
    if (area) area.innerHTML = renderCartItems();
    updateCartTotals();
};

window.adjustQty = (productId, delta) => {
    const idx = localCart.findIndex(item => String(item.id || item.product_id) === String(productId));
    if (idx === -1) return;
    localCart[idx].qty += delta;
    if (localCart[idx].qty <= 0) localCart.splice(idx, 1);
    const area = document.getElementById('cartArea');
    if (area) area.innerHTML = renderCartItems();
    updateCartTotals();
};

window.openQuickCustomerModal = () => document.getElementById('quickCustomerModal').style.display = 'flex';
window.closeQuickCustomerModal = () => document.getElementById('quickCustomerModal').style.display = 'none';

function updateCartTotals() {
    const total = localCart.reduce((sum, i) => sum + (parseFloat(i.base_price || 0) * i.qty), 0);
    const el = document.getElementById('grandTotal');
    if (el) el.innerText = `₹${total.toLocaleString('en-IN')}`;
}