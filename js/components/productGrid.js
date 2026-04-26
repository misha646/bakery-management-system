// js/components/productGrid.js
import { state } from "../state.js";

let currentContainer = null;
let currentSearchTerm = "";
let onProductClickCallback = null;

/**
 * Renders the product grid inside the specified container.
 * @param {HTMLElement} container - The DOM element to hold the grid.
 * @param {string} searchTerm - Search term to filter products.
 * @param {function} onProductClick - Callback when a product is clicked, receives productId.
 */
export function renderProductGrid(container, searchTerm, onProductClick) {
    if (!container) return;
    currentContainer = container;
    currentSearchTerm = searchTerm;
    onProductClickCallback = onProductClick;

    const branchId = state.user?.fk_branch_id || state.user?.fk_branch || 1;
    const SERVER_URL = "http://127.0.0.1:8000";
    const fallbackIcon = "https://img.icons8.com/fluency/96/bread.png";

    const products = state.products || [];
    const inventory = state.inventory || [];

    const filtered = products.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:50px; color:#999;">No products found. Try a different search.</div>`;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const pId = p.product_id || p.id;
        const stockItem = inventory.find(i =>
            String(i.fk_product) === String(pId) && String(i.fk_branch) === String(branchId)
        );
        const stockQty = stockItem ? parseFloat(stockItem.quantity) : 0;
        const outOfStock = stockQty <= 0;

        let imgSource = fallbackIcon;
        if (p.image_full_url) {
            imgSource = p.image_full_url;
            if (imgSource.includes('/media//media/')) imgSource = imgSource.replace('/media//media/', '/media/');
        } else if (p.image_url) {
            if (p.image_url.startsWith('/media/')) imgSource = SERVER_URL + p.image_url;
            else imgSource = SERVER_URL + "/media/" + p.image_url;
        }

        return `
            <div class="pos-card" 
                 data-product-id="${pId}"
                 style="background:white; border:1px solid #efebe9; padding:15px; border-radius:12px; cursor:${outOfStock ? 'not-allowed' : 'pointer'}; text-align:center; transition:0.3s; opacity:${outOfStock ? '0.5' : '1'}; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div style="width:100%; height:120px; overflow:hidden; border-radius:10px; margin-bottom:12px; background:#f8f5f2; display:flex; align-items:center; justify-content:center;">
                    <img src="${imgSource}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${fallbackIcon}';">
                </div>
                <div style="font-weight:800; color:#3e2723; font-size:0.85rem; height:36px; overflow:hidden; margin-bottom:5px;">${p.product_name}</div>
                <div style="color:#d2691e; font-weight:900; font-size:1.1rem; margin-bottom:5px;">₹${parseFloat(p.base_price || 0).toFixed(0)}</div>
                <div style="font-size:0.65rem; font-weight:800; background:#fdfaf9; padding:4px; border-radius:4px; border:1px solid #f1ece8;">
                    ${outOfStock ? 'SOLD OUT' : `Stock: ${stockQty.toFixed(0)}`}
                </div>
            </div>`;
    }).join('');

    // Attach click events to each product card
    container.querySelectorAll('.pos-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = card.dataset.productId;
            if (productId && onProductClickCallback) {
                onProductClickCallback(productId);
            }
        });
    });
}

/**
 * Helper to refresh the product grid with a new search term.
 */
export function refreshProductGrid(searchTerm) {
    if (currentContainer) {
        renderProductGrid(currentContainer, searchTerm, onProductClickCallback);
    }
}