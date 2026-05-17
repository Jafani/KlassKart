// Cart system: persistence, sidebar UI, add/remove/update
import { showToast, updateIcons, navigate } from "./ui.js";

export function saveCart() {
    localStorage.setItem('klass_cart', JSON.stringify(window.cart));
    updateCartCount();
}
window.saveCart = saveCart;

export function updateCartCount() {
    const count = window.cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    if (count > 0) { badge.innerText = count; badge.classList.remove('hidden'); }
    else badge.classList.add('hidden');
}
window.updateCartCount = updateCartCount;

export function addToCartData(p, color, size) {
    const existing = window.cart.find(x => x.id === p.id && x.color === color && x.size === size);
    if (existing) existing.qty += 1;
    else window.cart.push({ id: p.id, title: p.title, price: p.price, image: p.image, color, size, qty: 1 });
    saveCart();
    showToast('Added to Cart!', 'success');
    renderCartUI();
}
window.addToCartData = addToCartData;

export function addToCartFromCard(id) {
    const p = window.allProducts.find(x => x.id === id);
    if ((p.colors && p.colors.length > 0) || (p.sizes && p.sizes.length > 0)) {
        window.openProductModal(id);
        showToast('Please select options to add to cart', 'success');
        return;
    }
    addToCartData(p, '', '');
}
window.addToCartFromCard = addToCartFromCard;

export function buyNowFromCard(id) {
    const p = window.allProducts.find(x => x.id === id);
    if ((p.colors && p.colors.length > 0) || (p.sizes && p.sizes.length > 0)) {
        window.openProductModal(id);
        showToast('Please select options to buy', 'success');
        return;
    }
    window.setupCheckoutView(p.id, '', '', false);
}
window.buyNowFromCard = buyNowFromCard;

export function renderCartUI() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;
    container.innerHTML = '';
    let total = 0;

    if (window.cart.length === 0) {
        container.innerHTML = '<div class="h-full flex flex-col items-center justify-center text-gray-400 mt-20"><i data-lucide="shopping-cart" class="w-16 h-16 mb-4 opacity-50"></i><p class="font-medium">Your cart is completely empty.</p></div>';
        totalEl.innerText = '₹0';
        updateIcons();
        return;
    }

    window.cart.forEach((item, index) => {
        total += item.price * item.qty;
        let variantText = '';
        if (item.color) variantText += `<span class="text-[11px] text-gray-500 bg-white dark:bg-black px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">Color: ${item.color}</span>`;
        if (item.size)  variantText += `<span class="text-[11px] text-gray-500 bg-white dark:bg-black px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 ${item.color ? 'ml-2' : ''}">Size: ${item.size}</span>`;

        container.innerHTML += `
            <div class="flex gap-4 bg-gray-50 dark:bg-[#111] p-3 rounded-2xl border border-transparent dark:border-gray-800 relative group">
                <img src="${item.image}" class="w-20 h-20 object-cover rounded-xl shadow-sm border border-transparent dark:border-gray-800">
                <div class="flex-1 flex flex-col justify-between">
                    <div class="pr-6">
                        <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">${item.title}</h4>
                        <div class="flex items-center mt-1.5">${variantText}</div>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                        <span class="font-bold text-brand-accent text-sm">₹${item.price}</span>
                        <div class="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm h-7">
                            <button onclick="updateCartQty(${index}, -1)" class="w-7 h-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">-</button>
                            <span class="w-8 text-center text-xs font-bold dark:text-white border-x border-gray-100 dark:border-gray-800">${item.qty}</span>
                            <button onclick="updateCartQty(${index}, 1)"  class="w-7 h-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">+</button>
                        </div>
                    </div>
                </div>
                <button onclick="removeFromCart(${index})" class="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>`;
    });
    totalEl.innerText = `₹${total}`;
    updateIcons();
}
window.renderCartUI = renderCartUI;

export function updateCartQty(index, delta) {
    if (window.cart[index].qty + delta > 0) window.cart[index].qty += delta;
    else window.cart.splice(index, 1);
    saveCart();
    renderCartUI();
}
window.updateCartQty = updateCartQty;

export function removeFromCart(index) {
    window.cart.splice(index, 1);
    saveCart();
    renderCartUI();
}
window.removeFromCart = removeFromCart;

export function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const backdrop = document.getElementById('cartBackdrop');
    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        backdrop.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        renderCartUI();
    } else {
        sidebar.classList.add('translate-x-full');
        backdrop.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}
window.toggleCart = toggleCart;

export function checkoutCart() {
    if (window.cart.length === 0) { showToast('Your cart is empty', 'error'); return; }
    toggleCart();
    window.setupCheckoutView(null, null, null, true);
}
window.checkoutCart = checkoutCart;
