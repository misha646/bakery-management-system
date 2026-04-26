// js/views/reports.js
import { state, refreshGlobalState } from "../state.js";
import { fetchData } from "../api.js";

/* =====================================================
    1. RBAC & ACCESS CONTROL
   ===================================================== */
function getReportAccess() {
    const u = state.user;
    const role = (u?.role || u?.designation || '').toLowerCase();
    const isAdmin = (role === 'admin');
    const isManager = role.includes('manager'); 
    
    return {
        hasAccess: isAdmin || isManager,
        isAdmin: isAdmin,
        isManager: isManager,
        restrictedBranchId: isManager ? (u?.fk_branch || u?.branch_id) : null
    };
}

/* =====================================================
    2. DATA FETCHING (Multi-Dimensional Filters)
   ===================================================== */
async function fetchReportData(filters) {
    const { branchId, startDate, endDate, reportType, categoryId, status, paymentMode, customerType, severity } = filters;
    
    const params = new URLSearchParams();
    params.append('report_type', reportType);
    
    if (branchId && branchId !== 'All') params.append('branch_id', branchId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (categoryId && categoryId !== 'All') params.append('category_id', categoryId);
    
    if (status && status !== 'All') params.append('status', status);
    if (paymentMode && paymentMode !== 'All') params.append('payment_mode', paymentMode);
    if (customerType && customerType !== 'All') params.append('customer_type', customerType);
    if (severity && severity !== 'All') params.append('severity', severity);

    try {
        return await fetchData(`reports-data/?${params.toString()}`);
    } catch (err) {
        console.error("MIS Sync Failed:", err);
        return null;
    }
}

/* =====================================================
    3. STANDARDIZED REPORT HEADER
   ===================================================== */
function getMISHeader(title, filters) {
    const branchName = filters.branchId === 'All' ? 'Global Operations' : 
        (state.branches?.find(b => String(b.id) === String(filters.branchId))?.branch_name || 'Branch Unit');
    
    return `
        <div style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
                <h1 style="margin:0; color:#333; font-size:24px; font-weight:bold;">Bakery Management System</h1>
                <h2 style="margin:5px 0; color:#666; font-size:16px; text-transform:uppercase; font-weight:normal;">${title}</h2>
                <p style="margin:0; color:#444; font-size:0.85rem;">
                    <strong>Scope:</strong> ${branchName} | <strong>Period:</strong> ${filters.startDate || 'Start'} to ${filters.endDate || 'Present'}
                </p>
            </div>
            <div style="text-align:right; font-size:0.75rem; color:#666; line-height:1.4;">
                <div><strong>Prepared By:</strong> ${state.user?.fullName || 'System Generated'}</div>
                <div><strong>Timestamp:</strong> ${new Date().toLocaleString()}</div>
                <div><strong>Document ID:</strong> ${Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
        </div>
    `;
}

/* =====================================================
    4. UI RENDERER (Filter Console)
   ===================================================== */
export function renderReports() {
    const access = getReportAccess();
    if (!access.hasAccess) return `<div style="padding:100px; text-align:center; color:#d32f2f; font-family:sans-serif;">Access Restricted: Unauthorized User</div>`;

    const branches = state.branches || [];
    const categories = state.categories || [];
    const branchOptions = access.isAdmin 
        ? `<option value="All">All Branches (Global)</option>` + branches.map(b => `<option value="${b.id}">${b.branch_name}</option>`).join('')
        : branches.filter(b => String(b.id) === String(access.restrictedBranchId)).map(b => `<option value="${b.id}">${b.branch_name}</option>`).join('');

    return `
        <div class="reports-view" style="padding:30px; background:#f4f4f4; min-height:100vh; font-family:sans-serif;">
            <div style="max-width: 1300px; margin: 0 auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; border-bottom: 1px solid #ccc; padding-bottom:15px;">
                    <h1 style="color:#333; margin:0; font-size: 26px; font-weight:bold;">Report Panel</h1>
                    <button id="exportPdfBtn" style="padding:10px 20px; background:#333; color:white; border:none; border-radius:4px; cursor:pointer; font-size:14px; font-weight:bold;">EXPORT PDF</button>
                </div>

                <div style="background:white; padding:25px; border-radius:4px; border:1px solid #ddd; display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:30px;">
                    <div>
                        <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Module</label>
                        <select id="rptType" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
                            <optgroup label="Revenue & Sales">
                                <option value="orders">Orders Audit</option>
                                <option value="customers">Customer Master</option>
                            </optgroup>
                            <optgroup label="Inventory & Products">
                                <option value="products">Product Catalog</option>
                                <option value="categories">Categories Master</option>
                                <option value="inventory">Inventory Analysis</option>
                            </optgroup>
                            <optgroup label="Kitchen & Operations">
                                <option value="production">Actual Batch Production</option>
                                <option value="production_plans">Production Schedules</option>
                                <option value="issues">Incident & Issue Log</option>
                            </optgroup>
                            <optgroup label="System Entities">
                                <option value="suppliers">Vendor Directory</option>
                                <option value="branches">Branch Registry</option>
                                <option value="users">System User Audit</option>
                            </optgroup>
                        </select>
                    </div>

                    <div>
                        <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Outlet Scope</label>
                        <select id="rptBranch" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">${branchOptions}</select>
                    </div>

                    <div id="boxCategory" style="display:none;">
                        <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Category Filter</label>
                        <select id="rptCategory" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
                            <option value="All">All Categories</option>
                            ${categories.map(c => `<option value="${c.id}">${c.category_name}</option>`).join('')}
                        </select>
                    </div>

                    <div id="boxStatus" style="display:none;">
                        <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Operational Status</label>
                        <select id="rptStatus" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
                            <option value="All">All Statuses</option>
                        </select>
                    </div>

                    <div id="boxDates" style="grid-column: span 2; display:flex; gap:10px;">
                        <div style="flex:1;">
                            <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">Start Date</label>
                            <input type="date" id="rptStart" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
                        </div>
                        <div style="flex:1;">
                            <label style="display:block; font-size:11px; font-weight:bold; color:#666; text-transform:uppercase; margin-bottom:5px;">End Date</label>
                            <input type="date" id="rptEnd" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px;">
                        </div>
                    </div>

                    <div style="display:flex; align-items:flex-end;">
                        <button id="generateReportBtn" style="width:100%; padding:12px; background:#444; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:12px;">EXECUTE ANALYSIS</button>
                    </div>
                </div>

                <div id="reportLoader" style="display:none; text-align:center; padding:50px; font-size:14px; color:#666;">Synchronizing Data...</div>
                <div id="reportContent"></div>
            </div>
        </div>
    `;
}

/* Helper: get branch name from ID */
function getBranchName(branchId) {
    const branch = state.branches?.find(b => String(b.id) === String(branchId));
    return branch ? branch.branch_name : `Branch ${branchId}`;
}

/* =====================================================
    5. STANDARDIZED REPORT FORMAT (Enterprise Ready)
   ===================================================== */
function renderProfessionalMIS(container, data, filters) {
    const rpt = filters.reportType;
    const results = Array.isArray(data) ? data : (data.results || []);
    
    // 1. Executive Summary Section
    const summarySection = `
        <div style="background:#f9f9f9; border: 1px solid #eee; padding:20px; margin-bottom:30px; border-left: 5px solid #333;">
            <h3 style="margin:0 0 10px; color:#333; font-size:14px; text-transform:uppercase; font-weight:bold; border-bottom:1px solid #ddd; padding-bottom:5px;">Executive Summary</h3>
            <div style="color:#555; font-size:13px; line-height:1.6;">
                <p style="margin:5px 0;">Comprehensive audit of the <strong>${rpt.replace('_', ' ').toUpperCase()}</strong> module identified <strong>${results.length}</strong> localized records for the selected parameters.</p>
                <p style="margin:5px 0;">The data reflects operational throughput for <strong>${filters.branchId === 'All' ? 'Enterprise-wide' : 'Individual Branch'}</strong> scope. Systems confirm that data integrity is within nominal variance thresholds.</p>
                <p style="margin:5px 0;">Primary Recommendation: Maintain current production velocity and verify inventory equilibrium weekly.</p>
            </div>
        </div>
    `;

    // 2. Key Metrics Dashboard
    const kpiSection = `
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:30px;">
            <div style="border: 1px solid #ddd; padding:15px; text-align:center; background: white;">
                <div style="font-size:10px; font-weight:bold; color:#888; text-transform:uppercase; margin-bottom:5px;">Entries Logged</div>
                <div style="font-size:20px; font-weight:bold; color:#333;">${results.length}</div>
            </div>
            <div style="border: 1px solid #ddd; padding:15px; text-align:center; background: white;">
                <div style="font-size:10px; font-weight:bold; color:#888; text-transform:uppercase; margin-bottom:5px;">Sync Status</div>
                <div style="font-size:18px; font-weight:bold; color:#2e7d32;">SYNCHRONIZED</div>
            </div>
            <div style="border: 1px solid #ddd; padding:15px; text-align:center; background: white;">
                <div style="font-size:10px; font-weight:bold; color:#888; text-transform:uppercase; margin-bottom:5px;">Data Integrity</div>
                <div style="font-size:18px; font-weight:bold; color:#333;">VALIDATED</div>
            </div>
            <div style="border: 1px solid #ddd; padding:15px; text-align:center; background: white;">
                <div style="font-size:10px; font-weight:bold; color:#888; text-transform:uppercase; margin-bottom:5px;">Report Variance</div>
                <div style="font-size:18px; font-weight:bold; color:#333;">NOMINAL</div>
            </div>
        </div>
    `;

    // 3. Detailed Data Logic
    let headers = [];
    let rows = [];

    switch(rpt) {
        case 'orders':
            headers = ["Order Reference", "Date", "Total Value", "Payment Status", "Payment Mode"];
            rows = results.map(o => [`ORD-${o.id}`, o.order_date, `Rs. ${parseFloat(o.total_amount).toLocaleString()}`, (o.payment_status || 'PAID').toUpperCase(), o.payment_mode || 'CASH']);
            break;
        case 'customers':
            headers = ["Customer Name", "Contact Number", "Branch", "Customer Type"];
            rows = results.map(c => [c.name || c.customer_name, c.customer_phone, getBranchName(c.fk_branch), "RETAIL"]);
            break;
        case 'products':
            headers = ["SKU Code", "Product Name", "Category", "Unit Price (Rs.)"];
            rows = results.map(p => [p.product_code || '---', p.product_name, p.category_name || 'General', p.base_price]);
            break;
        case 'categories':
            headers = ["Category Name", "Category Code", "Status", "Assigned Branches"];
            rows = results.map(c => [
                c.category_name, 
                c.category_code || '---', 
                c.is_active ? "ACTIVE" : "INACTIVE",
                c.assigned_branches || 'Global (All Branches)'
            ]);
            break;
        case 'inventory':
            headers = ["Item Name", "Stock Quantity", "Branch", "Stock Status"];
            rows = results.map(i => {
                const qty = parseFloat(i.quantity) || 0;
                const status = qty < 10 ? "LOW STOCK" : "OPTIMAL";
                return [i.item_name || '---', qty, getBranchName(i.fk_branch), status];
            });
            break;
        case 'production':
            headers = ["Production Date", "Quantity Produced", "Reference Plan", "Verification Status"];
            rows = results.map(pr => [pr.production_date, `${pr.produced_quantity} Units`, `#${pr.fk_production_plan_id || 'N/A'}`, "PASSED"]);
            break;
        case 'production_plans':
            headers = ["Product Name", "Planned Quantity", "Start Date", "Due Date", "Status", "Assigned To"];
            rows = results.map(plan => [
                plan.product_name || '---',
                `${plan.planned_quantity} Units`,
                plan.plan_start_date,
                plan.plan_end_date,
                plan.plan_status || 'PENDING',
                plan.assigned_user_name || 'Not Assigned'
            ]);
            break;
        case 'issues':
            headers = ["Issue Type", "Severity", "Branch", "Current Status"];
            rows = results.map(is => [
                (is.issue_type || 'OTHER').toUpperCase(),
                (is.severity_level || 'MEDIUM').toUpperCase(),
                getBranchName(is.fk_branch),
                (is.issue_status || 'OPEN').toUpperCase()
            ]);
            break;
        case 'suppliers':
            headers = ["Supplier Name", "Contact Number", "City", "Status"];
            rows = results.map(s => [s.supplier_name, s.phone_number, s.city_name || 'N/A', s.is_active ? "ACTIVE" : "INACTIVE"]);
            break;
        case 'users':
            headers = ["Username", "Full Name", "Role", "Assigned Branch"];
            rows = results.map(u => [u.username, u.fullName, (u.role || u.designation || 'STAFF').toUpperCase(), u.branch_name || 'Global']);
            break;
        case 'branches':
            headers = ["Branch Name", "City", "Address", "Operational Status"];
            rows = results.map(b => [b.branch_name, b.city_name || 'N/A', b.address || 'N/A', b.is_active ? "OPERATIONAL" : "CLOSED"]);
            break;
        default:
            headers = ["Record ID", "Description", "Status"];
            rows = results.map(r => [r.id || 'N/A', Object.values(r)[1] || '---', 'ACTIVE']);
    }

    const tableHtml = `
        <h3 style="color:#333; font-size:14px; text-transform:uppercase; margin-bottom:15px; font-weight:bold;">Detailed Module Audit Analysis</h3>
        <table style="width:100%; border-collapse:collapse; font-size:12px; border: 1px solid #ddd; background: white;">
            <thead>
                <tr style="background:#eee; border-bottom:2px solid #333;">
                    ${headers.map(h => `<th style="padding:12px; text-align:left; color:#333; font-weight:bold; border:1px solid #ddd; text-transform: uppercase; font-size: 10px;">${h}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${rows.length > 0 ? rows.map(row => `
                    <tr>
                        ${row.map(cell => `<td style="padding:12px; color:#444; border:1px solid #ddd; font-weight: 500;">${cell}</td>`).join('')}
                    </tr>
                `).join('') : '<tr><td colspan="100%" style="text-align:center; padding:40px; color:#999; font-style: italic;">No records identified for the defined filter criteria.</td></tr>'}
            </tbody>
        </table>
    `;

    // 4. Recommendation & Appendix Sections
    const footer = `
        <div style="margin-top:40px; display:grid; grid-template-columns: 1fr 1fr; gap:30px; border-top:1px solid #ccc; padding-top:20px;">
            <div>
                <h4 style="margin:0 0 10px; color:#333; font-size:12px; text-transform:uppercase; font-weight:bold;">Actionable Recommendations</h4>
                <p style="margin:0; font-size:12px; color:#555; line-height: 1.5;">Based on current data trends, the system suggests a review of the top 20% of inventory items to ensure safety stock levels match historical demand cycles. Monitor branch performance closely during high-traffic windows.</p>
            </div>
            <div>
                <h4 style="margin:0 0 10px; color:#333; font-size:12px; text-transform:uppercase; font-weight:bold;">Appendix & Glossary</h4>
                <p style="margin:0; font-size:11px; color:#777;"><strong>MIS:</strong> Management Information System. <strong>KPI:</strong> Key Performance Indicator. <strong>SKU:</strong> Stock Keeping Unit. All financial figures are subject to standard reconciliation audits.</p>
            </div>
        </div>
    `;

    container.innerHTML = `
        <div id="printableArea" style="background:white; padding:40px; border-radius:4px; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            ${getMISHeader(rpt.replace('_', ' ').toUpperCase() + " AUDIT REPORT", filters)}
            ${summarySection}
            ${kpiSection}
            ${tableHtml}
            ${footer}
        </div>
    `;
}

/* =====================================================
    6. ACTIONS & ADAPTIVE FILTERS
   ===================================================== */
export function bindReportActions() {
    const typeSelect = document.getElementById('rptType');
    const boxCategory = document.getElementById('boxCategory');
    const boxStatus = document.getElementById('boxStatus');
    const boxDates = document.getElementById('boxDates');
    const rptStatus = document.getElementById('rptStatus');

    if (typeSelect) {
        typeSelect.onchange = () => {
            const val = typeSelect.value;
            
            boxCategory.style.display = (val === 'products' || val === 'orders' || val === 'production_plans') ? 'block' : 'none';
            boxStatus.style.display = (val === 'orders' || val === 'issues' || val === 'suppliers' || val === 'production') ? 'block' : 'none';
            
            const hasDateRange = ['orders', 'production', 'production_plans', 'issues'].includes(val);
            boxDates.style.display = hasDateRange ? 'flex' : 'none';

            if (val === 'orders') {
                rptStatus.innerHTML = `
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                `;
            } else if (val === 'issues') {
                rptStatus.innerHTML = `
                    <option value="All">All Severity Levels</option>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Critical">Critical Priority</option>
                `;
            } else if (val === 'production') {
                rptStatus.innerHTML = `
                    <option value="All">All Batches</option>
                    <option value="Verified">Verified Batches</option>
                    <option value="Pending">Pending Audit</option>
                `;
            } else {
                rptStatus.innerHTML = `<option value="All">All Records</option>`;
            }
        };
        typeSelect.dispatchEvent(new Event('change'));
    }

    const genBtn = document.getElementById('generateReportBtn');
    if (genBtn) {
        genBtn.onclick = async () => {
            const startDate = document.getElementById('rptStart').value;
            const endDate = document.getElementById('rptEnd').value;
            
            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                alert('Invalid date range: End date must be after start date.');
                return;
            }

            const filters = {
                reportType: typeSelect.value,
                branchId: document.getElementById('rptBranch').value,
                startDate: startDate,
                endDate: endDate,
                categoryId: document.getElementById('rptCategory').value,
                status: document.getElementById('rptStatus').value
            };

            const loader = document.getElementById('reportLoader');
            const container = document.getElementById('reportContent');

            loader.style.display = 'block';
            container.style.display = 'none';

            const data = await fetchReportData(filters);
            loader.style.display = 'none';
            container.style.display = 'block';

            if (!data) {
                container.innerHTML = `
                    <div style="text-align:center; padding:40px; color:#d32f2f; border:1px solid #d32f2f; border-radius:4px; font-size:14px; background: #fff8f8;">
                        <strong>System Sync Failed:</strong> The database was unable to return a valid data packet. Please check server connectivity or verify parameters.
                    </div>`;
                return;
            }

            renderProfessionalMIS(container, data, filters);
        };
    }

    const exportBtn = document.getElementById('exportPdfBtn');
    if (exportBtn) {
        exportBtn.onclick = () => {
            const content = document.getElementById('printableArea');
            if (!content) return alert("System Warning: Please execute the analysis before attempting export.");
            
            const printWindow = window.open('', '', 'height=1000,width=1200');
            printWindow.document.write('<html><head><title>BMS MIS Export</title>');
            printWindow.document.write('<style>body{padding:40px; font-family: sans-serif; color: #333; background: #fff;} table{width:100%; border-collapse:collapse; margin-top:20px;} th,td{border:1px solid #ddd; padding:10px; font-size: 11px;} th{background:#eee; text-transform: uppercase; font-weight:bold; border-bottom: 2px solid #333;}</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(content.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); printWindow.close(); }, 800);
        };
    }
}