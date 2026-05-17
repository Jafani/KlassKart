// Checkout: build summary, submit order to Firestore, hand off to WhatsApp
import { db, collection, addDoc } from "../firebase.js";
import { whatsappNumber } from "../config.local.js";
import { navigate, showToast, updateIcons } from "./ui.js";
import { saveCart } from "./cart.js";

export async function setupCheckoutView(id, color, size, isCart = false) {
    navigate('checkout');
    document.getElementById('checkoutIsCart').value = isCart ? 'true' : 'false';

    let items = [];

    if (isCart) {
        items = window.cart;
    } else {
        let product = window.allProducts.find(p => p.id === id);
        if (!product) {
            await window.fetchProducts();
            product = window.allProducts.find(p => p.id === id);
        }
        if (!product) return navigate('home');

        document.getElementById('checkoutProductId').value = id;
        document.getElementById('checkoutProductColor').value = color;
        document.getElementById('checkoutProductSize').value = size;

        items = [{ ...product, color, size, qty: 1 }];
    }

    if (items.length === 0) { showToast('Your cart is empty', 'error'); return navigate('home'); }

    let summaryHtml = '';
    let total = 0;

    items.forEach(item => {
        let variantText = '';
        if (item.color) variantText += `<span class="text-xs font-medium px-2 py-0.5 rounded-md bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 mr-2">Color: ${item.color}</span>`;
        if (item.size)  variantText += `<span class="text-xs font-medium px-2 py-0.5 rounded-md bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">Size: ${item.size}</span>`;

        summaryHtml += `
            <div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0 last:mb-0">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl shadow-sm border border-transparent dark:border-gray-700">
                <div class="flex-1">
                    <h3 class="font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">${item.title}</h3>
                    <div class="mt-1">${variantText}</div>
                    <div class="mt-1.5 font-bold text-brand-accent">₹${item.price} <span class="text-xs text-gray-500 font-normal dark:text-gray-400">x ${item.qty}</span></div>
                </div>
            </div>`;
        total += item.price * item.qty;
    });

    summaryHtml += `
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400 font-medium">Subtotal</span>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">₹${total}</span>
        </div>`;

    document.getElementById('checkoutProductSummary').innerHTML = summaryHtml;
    updateIcons();
}
window.setupCheckoutView = setupCheckoutView;

export function processCheckout(e) {
    e.preventDefault();
    const isCart = document.getElementById('checkoutIsCart').value === 'true';

    const name = document.getElementById('coName').value;
    const phone = document.getElementById('coPhone').value;
    const address = document.getElementById('coAddress').value;
    const pincode = document.getElementById('coPincode').value;
    const city = document.getElementById('coCity').value;

    const orderId = 'KLS-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    let items = [];
    let totalPrice = 0;
    let productTitleStr = '';
    let variantMsg = '';

    if (isCart) {
        items = window.cart;
        totalPrice = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
        productTitleStr = items.map(i => `${i.title} (x${i.qty})`).join(', ');
        items.forEach(i => {
            variantMsg += `%0A📦 *${i.title}* (x${i.qty})`;
            if (i.color) variantMsg += ` - Color: ${i.color}`;
            if (i.size)  variantMsg += ` - Size: ${i.size}`;
        });
    } else {
        const id = document.getElementById('checkoutProductId').value;
        const color = document.getElementById('checkoutProductColor').value;
        const size = document.getElementById('checkoutProductSize').value;
        const product = window.allProducts.find(p => p.id === id);
        if (!product) return;

        items = [{ ...product, color, size, qty: 1 }];
        totalPrice = product.price;
        productTitleStr = product.title;

        variantMsg += `%0A📦 *${product.title}*`;
        if (color) variantMsg += `%0A🎨 *Color:* ${color}`;
        if (size)  variantMsg += `%0A📏 *Size:* ${size}`;
    }

    const orderData = {
        orderId, productTitle: productTitleStr,
        productId: isCart ? 'CART_MULTIPLE' : items[0].id,
        price: totalPrice,
        color: isCart ? 'Multiple' : (items[0].color || ''),
        size:  isCart ? 'Multiple' : (items[0].size  || ''),
        customerName: name, customerPhone: phone,
        address, city, pincode,
        createdAt: new Date().toISOString(),
        status: 'Pending'
    };

    addDoc(collection(db, "orders"), orderData).catch(err => console.error(err));

    const message = `🛍️ *New Order from Klass Kart*%0A%0A🏷️ *Order ID:* ${orderId}${variantMsg}%0A%0A💰 *Total Price:* ₹${totalPrice}%0A%0A👤 *Customer Details:*%0AName: ${name}%0APhone: ${phone}%0A%0A📍 *Delivery Address:*%0A${address}%0A${city} - ${pincode}`;

    if (isCart) { window.cart = []; saveCart(); }

    showToast(`Order Placed! ID: ${orderId}`, 'success');
    setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        navigate('home');
    }, 1000);
}
window.processCheckout = processCheckout;
