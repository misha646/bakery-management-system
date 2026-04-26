// js/state.js
import { fetchData } from "./api.js";

export const state = {
    user: JSON.parse(localStorage.getItem("bmsUser")) || JSON.parse(localStorage.getItem("bakery_user")) || null,
    token: localStorage.getItem("bmsToken") || null,
    products: [],
    categories: [],
    branches: [],
    customers: [],
    suppliers: [],
    issues: [],
    inventory: [],
    orders: [],
    production: [],
    production_plans: [],
    users: [],
    raw_materials: [],
    dashboardStats: {
        total_revenue: 0,
        orders_count: 0,
        completed_production: 0,
        low_stock_alerts: 0
    }
};

export async function initState() {
    const savedUser = localStorage.getItem("bmsUser") || localStorage.getItem("bakery_user");
    const savedToken = localStorage.getItem("bmsToken");

    if (savedUser) state.user = JSON.parse(savedUser);
    if (savedToken) state.token = savedToken;
}

export function saveState(userObj = null, tokenStr = null) {
    if (userObj) {
        state.user = userObj;
        localStorage.setItem("bmsUser", JSON.stringify(userObj));
    }
    if (tokenStr) {
        state.token = tokenStr;
        localStorage.setItem("bmsToken", tokenStr);
    }
}

export function clearState() {
    localStorage.removeItem("bmsUser");
    localStorage.removeItem("bakery_user");
    localStorage.removeItem("bmsToken");
    state.user = null;
    state.token = null;
}

export function addCategoryToState(category) {
    const categoryId = category.id || category.category_id;
    if (!categoryId) {
        console.error("Invalid category data received:", category);
        return false;
    }
    const normalizedCategory = { ...category, id: categoryId };
    const exists = state.categories.some(c => (c.id || c.category_id) === categoryId);
    if (!exists) {
        state.categories = [normalizedCategory, ...state.categories];
        console.log("Category added to state:", normalizedCategory.category_name);
        return true;
    } else {
        return updateCategoryInState(normalizedCategory);
    }
}

export function updateCategoryInState(category) {
    const categoryId = category.id || category.category_id;
    const index = state.categories.findIndex(c => (c.id || c.category_id) === categoryId);
    if (index !== -1) {
        state.categories[index] = { ...category, id: categoryId };
        console.log("Category updated in state:", category.category_name);
        return true;
    }
    return false;
}

export function addProductToState(product) {
    const productId = product.id || product.product_id;
    if (!productId) {
        console.error("Invalid product data received:", product);
        return false;
    }
    const normalizedProduct = { ...product, id: productId };
    const exists = state.products.some(p => (p.id || p.product_id) === productId);
    if (!exists) {
        state.products = [normalizedProduct, ...state.products];
        console.log("Product added to state:", normalizedProduct.product_name);
        return true;
    } else {
        return updateProductInState(normalizedProduct);
    }
}

export function updateProductInState(product) {
    const productId = product.id || product.product_id;
    const index = state.products.findIndex(p => (p.id || p.product_id) === productId);
    if (index !== -1) {
        state.products[index] = { ...product, id: productId };
        console.log("Product updated in state:", product.product_name);
        return true;
    }
    return false;
}

export async function refreshGlobalState() {
    try {
        const user = state.user;
        if (!user) {
            console.error("No user found in state");
            return false;
        }

        const userId = user.id || user.user_id;
        const branchId = user.fk_branch || user.fk_branch_id || user.branch_id || "";
        const role = (user.role || user.designation || '').toLowerCase();
        const isAdmin = role === 'admin';

        console.log("Refreshing global state - User ID:", userId, "Role:", role, "Branch ID:", branchId);

        const freshUser = await fetchData(`users/${userId}/`);
        if (freshUser && freshUser.id) {
            state.user = { ...state.user, ...freshUser };
            localStorage.setItem("bmsUser", JSON.stringify(state.user));
        }

        const branchParam = (branchId && !isAdmin) ? `?branch_id=${branchId}` : "";
        
        const endpointMap = {
            products: 'products/',
            branches: 'branches/',
            categories: 'categories/' + branchParam,
            customers: 'customers/' + branchParam,
            suppliers: 'suppliers/',
            issues: 'issues/' + branchParam,
            inventory: 'inventory/' + branchParam,
            orders: 'orders/' + branchParam,
            production: 'production/' + branchParam,
            production_plans: 'production-plan/' + branchParam,
            users: 'users/',
            raw_materials: 'raw-materials/'
        };

        const fetchStats = isAdmin || role.includes('manager');
        const statsUrl = fetchStats ? `reports-data/?report_type=summary${branchId && !isAdmin ? '&branch_id=' + branchId : ''}` : null;

        const stateKeys = Object.keys(endpointMap);
        const fetchPromises = stateKeys.map(key => fetchData(endpointMap[key]));
        if (statsUrl) fetchPromises.push(fetchData(statsUrl));

        const results = await Promise.allSettled(fetchPromises);

        // Process each key – FIXED nesting and logic
        for (let i = 0; i < stateKeys.length; i++) {
            const key = stateKeys[i];
            const result = results[i];
            if (result.status === 'fulfilled' && result.value) {
                let data = result.value;
                if (Array.isArray(data)) {
                    // Normalize IDs based on key type
                    if (key === 'categories') {
                        data = data.map(item => ({
                            ...item,
                            id: item.id || item.category_id
                        }));
                        console.log("Categories normalized:", data.length, "items");
                    } else if (key === 'products') {
                        data = data.map(item => ({
                            ...item,
                            id: item.id || item.product_id
                        }));
                        console.log(`Products loaded: ${data.length} items`);
                    } else if (key === 'branches') {
                        data = data.map(item => ({
                            ...item,
                            id: item.id || item.branch_id
                        }));
                        console.log(`Branches loaded: ${data.length} items`);
                    } else if (key === 'users') {
                        data = data.map(item => ({
                            ...item,
                            id: item.id || item.user_id
                        }));
                        console.log(`Users loaded: ${data.length} items`);
                    } else if (key === 'raw_materials') {
                        data = data.map(item => ({
                            ...item,
                            id: item.id || item.raw_material_id
                        }));
                        console.log(`Raw materials loaded: ${data.length} items`);
                    } else if (key === 'inventory') {
                        data = data.map(item => ({
                            ...item,
                            quantity: parseFloat(item.quantity) || 0,
                            reorder_level: parseFloat(item.reorder_level) || 10
                        }));
                        console.log(`Inventory loaded: ${data.length} items`);
                    }
                    // For other keys (customers, suppliers, etc.) keep as-is
                    state[key] = data;
                    console.log(key + " loaded: " + state[key].length + " items");
                } else {
                    console.warn(key + " returned non-array data:", data);
                    state[key] = [];
                }
            } else {
                console.error("Failed to fetch " + key + ":", result.reason);
                state[key] = state[key] || [];
            }
        }

        // Process dashboard stats if requested
        if (statsUrl) {
            const statsRes = results[results.length - 1];
            if (statsRes.status === 'fulfilled' && statsRes.value) {
                const summary = statsRes.value;
                state.dashboardStats = {
                    total_revenue: summary.sales_summary?.total_revenue || 0,
                    orders_count: summary.sales_summary?.orders_count || 0,
                    completed_production: summary.production_summary?.completed_production || 0,
                    low_stock_alerts: state.inventory.filter(i => i.quantity < i.reorder_level).length
                };
            }
        }

        console.log("State Sync Complete");
        console.log("Total Categories in state: " + state.categories.length);
        if (state.categories.length > 0) {
            console.log("First category:", state.categories[0]);
        }
        return true;
    } catch (error) {
        console.error("Global State Sync Crash:", error);
        return false;
    }
}

export function getAccessControl() {
    const role = (state.user?.role || state.user?.designation || '').toLowerCase();
    return {
        isAdmin: role === 'admin',
        isManager: ['admin', 'manager', 'branch manager'].includes(role),
        isStaff: ['staff', 'cashier', 'sales', 'service staff'].includes(role),
        isBaker: role === 'baker',
        canEditMasterData: ['admin', 'manager'].includes(role)
    };
}

window.getAccessControl = getAccessControl;
window.state = state;