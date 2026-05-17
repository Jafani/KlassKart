// Product catalogue: fetch from Firestore, render grid, product modal, filters
import { db, collection, getDocs } from "../firebase.js";
import { dummyProducts } from "../data/dummy-products.js";
import { updateIcons } from "./ui.js";

export async function fetchProducts() {
    document.getElementById('loadingProducts').classList.remove('hidden');
    document.getElementById('productsGrid').classList.add('hidden');

    try {
        const snap = await getDocs(collection(db, "products"));
        const products = [];
        snap.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
        window.allProducts = products.length > 0 ? products : [...dummyProducts];
    } catch (error) {
        console.error("Firestore Error, loading fallback:", error);
        window.allProducts = [...dummyProducts];
    }

    document.getElementById('loadingProducts').classList.add('hidden');
    document.getElementById('productsGrid').classList.remove('hidden');

    renderProducts();
    window.renderAdminProducts && window.renderAdminProducts();
    const stat = document.getElementById('statTotalProducts');
    if (stat) stat.innerText = window.allProducts.length;
}
window.fetchProducts = fetchProducts;

export function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const search = (document.getElementById('searchInput').value || document.getElementById('mobileSearchInput').value).toLowerCase();
    grid.innerHTML = '';

    const filtered = window.allProducts.filter(p =>
        (window.currentCategory === 'All' || p.category === window.currentCategory) &&
        p.title.toLowerCase().includes(search)
    );

    if (filtered.length === 0) {
        grid.classList.add('hidden');
        document.getElementById('noProductsFound').classList.remove('hidden');
        updateIcons();
        return;
    }

    document.getElementById('noProductsFound').classList.add('hidden');
    grid.classList.remove('hidden');

    filtered.forEach((p, index) => {
        const badgeColor = p.stockStatus === 'In Stock' ? 'bg-[#25D366] text-white'
                         : p.stockStatus === 'Limited Stock' ? 'bg-orange-500 text-white'
                         : 'bg-red-500 text-white';
        const animationDelay = `style="animation-delay: ${index * 0.05}s"`;

        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const fillClass = i <= p.stars ? 'fill-brand-accent text-brand-accent' : 'text-gray-200 dark:text-gray-700';
            starsHtml += `<i data-lucide="star" class="w-3 h-3 ${fillClass}"></i>`;
        }

        const saveAmount = p.originalPrice > p.price ? (p.originalPrice - p.price) : 0;
        const saveHtml = saveAmount > 0
            ? `<div class="text-[11px] sm:text-xs font-semibold text-green-600 dark:text-green-400 mt-1.5 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-md inline-block border border-green-100 dark:border-green-800/30">You Save ₹${saveAmount}</div>`
            : '';

        grid.innerHTML += `
            <div class="animated-border-box hover:shadow-[0_0_20px_rgba(197,168,128,0.25)] transition-shadow duration-300 group cursor-pointer animate-fade-in opacity-0 hover:-translate-y-1 h-full" ${animationDelay} onclick="openProductModal('${p.id}')">
                <div class="inner-card flex flex-col bg-white dark:bg-black">
                    <div class="relative h-56 sm:h-60 overflow-hidden bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/50 flex-shrink-0">
                        <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=Image+Not+Found'">
                        <span class="absolute top-3 left-3 ${badgeColor} rounded-full text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-sm">${p.stockStatus}</span>
                        ${p.discount > 0 ? `<span class="absolute top-3 right-3 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full text-[10px] font-bold px-2 py-1 shadow-sm">-${p.discount}%</span>` : ''}
                    </div>
                    <div class="p-5 flex flex-col flex-grow">
                        <span class="text-[10px] uppercase font-semibold tracking-wider text-brand-accent mb-2 block">${p.category}</span>
                        <h3 class="font-medium text-gray-900 dark:text-white text-sm sm:text-base leading-snug mb-3 line-clamp-2">${p.title}</h3>
                        <div class="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50 flex flex-col">
                            <div class="flex items-center gap-1 mb-2">${starsHtml}<span class="ml-1 text-xs font-medium text-gray-400">(${p.stars})</span></div>
                            <div class="flex flex-col mb-4">
                                <div class="flex items-end gap-2">
                                    <span class="text-xl font-bold text-gray-900 dark:text-white">₹${p.price}</span>
                                    ${p.originalPrice > p.price ? `<span class="text-sm font-medium text-gray-400 line-through pb-0.5">₹${p.originalPrice}</span>` : ''}
                                </div>
                                ${saveHtml}
                            </div>
                            <div class="flex gap-2 mt-auto">
                                <button onclick="event.stopPropagation(); addToCartFromCard('${p.id}')" class="flex-1 flex justify-center items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#151515] dark:text-gray-300 dark:hover:bg-gray-800 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm border border-transparent dark:border-gray-800">
                                    <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Cart
                                </button>
                                <button onclick="event.stopPropagation(); buyNowFromCard('${p.id}')" class="flex-1 bg-gray-900 text-white hover:bg-black dark:bg-brand-accent dark:text-white dark:hover:bg-brand-accent/90 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    updateIcons();
}
window.renderProducts = renderProducts;

export function setCategory(cat) {
    window.currentCategory = cat;
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${cat}'`)) {
            btn.className = 'category-btn active px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium bg-gray-900 text-white dark:bg-white dark:text-black transition-all shadow-md';
        } else {
            btn.className = 'category-btn px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium bg-white text-gray-600 border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-brand-gray transition-all';
        }
    });
    renderProducts();
}
window.setCategory = setCategory;

export function filterProducts(isMobile = false) {
    if (isMobile) document.getElementById('searchInput').value = document.getElementById('mobileSearchInput').value;
    else document.getElementById('mobileSearchInput').value = document.getElementById('searchInput').value;
    renderProducts();
}
window.filterProducts = filterProducts;

/* ---------- Product modal ---------- */
export function openProductModal(id) {
    const p = window.allProducts.find(x => x.id === id);
    if (!p) return;

    document.getElementById('modalProductImage').src = p.image;
    document.getElementById('modalProductTitle').innerText = p.title;
    document.getElementById('modalProductCategory').innerText = p.category;
    document.getElementById('modalProductDescription').innerText = p.description || 'No description available.';
    document.getElementById('modalProductPrice').innerText = `₹${p.price}`;

    const saveBadge = document.getElementById('modalSaveBadge');
    if (p.originalPrice > p.price) {
        document.getElementById('modalProductOriginalPrice').innerText = `₹${p.originalPrice}`;
        document.getElementById('modalProductDiscount').innerText = `${p.discount}% OFF`;
        const saveAmt = p.originalPrice - p.price;
        saveBadge.innerHTML = `<span class="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-800/30">You Save ₹${saveAmt}</span>`;
    } else {
        document.getElementById('modalProductOriginalPrice').innerText = '';
        document.getElementById('modalProductDiscount').innerText = '';
        saveBadge.innerHTML = '';
    }

    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        const fillClass = i <= p.stars ? 'fill-brand-accent text-brand-accent' : 'text-gray-200 dark:text-gray-700';
        starsHtml += `<i data-lucide="star" class="w-4 h-4 ${fillClass}"></i>`;
    }
    starsHtml += `<span class="ml-2 text-sm font-medium text-gray-500">(${p.stars})</span>`;
    document.getElementById('modalProductStars').innerHTML = starsHtml;

    const badgeColor = p.stockStatus === 'In Stock' ? 'bg-[#25D366] text-white'
                     : p.stockStatus === 'Limited Stock' ? 'bg-orange-500 text-white'
                     : 'bg-red-500 text-white';
    const stockBadge = document.getElementById('modalProductStockBadge');
    stockBadge.className = `absolute top-5 left-5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-md ${badgeColor}`;
    stockBadge.innerText = p.stockStatus;

    const colorSec = document.getElementById('modalColorSection');
    const colorOpts = document.getElementById('modalColorOptions');
    const sizeSec = document.getElementById('modalSizeSection');
    const sizeOpts = document.getElementById('modalSizeOptions');

    window.selectedProductColor = '';
    window.selectedProductSize = '';
    colorOpts.innerHTML = '';
    sizeOpts.innerHTML = '';

    if (p.colors && p.colors.length > 0) {
        colorSec.classList.remove('hidden');
        window.selectedProductColor = p.colors[0];
        p.colors.forEach(color => {
            colorOpts.innerHTML += `<button onclick="selectColor('${color}', this)" class="variant-color-btn px-5 py-2 rounded-xl border text-sm font-medium transition-all ${color === window.selectedProductColor ? 'border-gray-900 bg-gray-900 text-white dark:bg-white dark:text-black dark:border-white shadow-md' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:border-gray-400'}">${color}</button>`;
        });
    } else colorSec.classList.add('hidden');

    if (p.sizes && p.sizes.length > 0) {
        sizeSec.classList.remove('hidden');
        window.selectedProductSize = p.sizes[0];
        p.sizes.forEach(size => {
            sizeOpts.innerHTML += `<button onclick="selectSize('${size}', this)" class="variant-size-btn px-5 py-2 rounded-xl border text-sm font-medium transition-all ${size === window.selectedProductSize ? 'border-gray-900 bg-gray-900 text-white dark:bg-white dark:text-black dark:border-white shadow-md' : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:border-gray-400'}">${size}</button>`;
        });
    } else sizeSec.classList.add('hidden');

    const addToCartBtn = document.getElementById('modalAddToCartBtn');
    const buyNowBtn = document.getElementById('modalBuyNowBtn');

    if (p.stockStatus === 'Out of Stock') {
        buyNowBtn.disabled = true;
        addToCartBtn.disabled = true;
        buyNowBtn.className = "flex-1 bg-gray-200 dark:bg-gray-800 text-gray-400 font-medium rounded-xl py-4 px-6 flex items-center justify-center cursor-not-allowed";
        addToCartBtn.className = "flex-1 bg-gray-100 dark:bg-gray-900 text-gray-400 border border-gray-200 dark:border-gray-800 font-medium rounded-xl py-4 px-6 flex items-center justify-center cursor-not-allowed";
        buyNowBtn.innerHTML = "Out of Stock <i data-lucide='ban' class='w-4 h-4 ml-2'></i>";
    } else {
        buyNowBtn.disabled = false;
        addToCartBtn.disabled = false;
        buyNowBtn.className = "flex-1 bg-gray-900 text-white dark:bg-white dark:text-black font-medium rounded-xl py-4 flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-transparent dark:border-gray-700";
        buyNowBtn.innerHTML = "Buy Now <i data-lucide='arrow-right' class='w-4 h-4 ml-2'></i>";
        addToCartBtn.className = "flex-1 bg-white text-gray-900 border border-gray-200 dark:bg-[#111] dark:text-white dark:border-gray-800 py-4 rounded-xl font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center justify-center";

        buyNowBtn.onclick = () => {
            closeProductModal();
            try {
                let url = `?view=checkout&id=${p.id}`;
                if (window.selectedProductColor) url += `&color=${encodeURIComponent(window.selectedProductColor)}`;
                if (window.selectedProductSize)  url += `&size=${encodeURIComponent(window.selectedProductSize)}`;
                window.history.pushState({}, '', url);
            } catch (e) {}
            window.setupCheckoutView(p.id, window.selectedProductColor || '', window.selectedProductSize || '', false);
        };

        addToCartBtn.onclick = () => {
            window.addToCartData(p, window.selectedProductColor || '', window.selectedProductSize || '');
            closeProductModal();
            window.toggleCart();
        };
    }

    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');
    updateIcons();
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
    document.body.style.overflow = 'hidden';
}
window.openProductModal = openProductModal;

export function selectColor(color, element) {
    window.selectedProductColor = color;
    document.querySelectorAll('.variant-color-btn').forEach(btn => {
        btn.className = "variant-color-btn px-5 py-2 rounded-xl border text-sm font-medium transition-all border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:border-gray-400";
    });
    element.className = "variant-color-btn px-5 py-2 rounded-xl border text-sm font-medium transition-all border-gray-900 bg-gray-900 text-white dark:bg-white dark:text-black dark:border-white shadow-md";
}
window.selectColor = selectColor;

export function selectSize(size, element) {
    window.selectedProductSize = size;
    document.querySelectorAll('.variant-size-btn').forEach(btn => {
        btn.className = "variant-size-btn px-5 py-2 rounded-xl border text-sm font-medium transition-all border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400 hover:border-gray-400";
    });
    element.className = "variant-size-btn px-5 py-2 rounded-xl border text-sm font-medium transition-all border-gray-900 bg-gray-900 text-white dark:bg-white dark:text-black dark:border-white shadow-md";
}
window.selectSize = selectSize;

export function closeProductModal() {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; }, 300);
}
window.closeProductModal = closeProductModal;
