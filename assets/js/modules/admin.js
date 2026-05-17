// Admin: login, product CRUD, order management
import {
    db, auth, collection, addDoc, getDocs, doc, deleteDoc, updateDoc,
    signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "../firebase.js";
import { showToast, updateIcons } from "./ui.js";
import { fetchProducts } from "./products.js";

// Track auth state — used by Firestore writes (rules require request.auth != null)
window.currentAdminUser = null;
onAuthStateChanged(auth, (user) => {
    window.currentAdminUser = user || null;
});

export function openAdminLogin()  { document.getElementById('adminLoginModal').classList.remove('hidden'); }
export function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('hidden');
    document.getElementById('loginError').classList.add('hidden');
}
window.openAdminLogin = openAdminLogin;
window.closeAdminLogin = closeAdminLogin;

export async function loginAdmin() {
    const email = document.getElementById('adminId').value.trim();
    const pwd   = document.getElementById('adminPassword').value;
    const errEl = document.getElementById('loginError');
    errEl.classList.add('hidden');

    if (!email || !pwd) {
        errEl.textContent = 'Please enter email and password';
        errEl.classList.remove('hidden');
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, pwd);
        closeAdminLogin();
        document.getElementById('adminPanelModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.getElementById('adminId').value = '';
        document.getElementById('adminPassword').value = '';
        showToast('Welcome to Klass Hub');
        fetchOrders();
    } catch (err) {
        console.error('Auth error:', err.code);
        const msg = (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found')
            ? 'Invalid email or password'
            : (err.code === 'auth/too-many-requests')
                ? 'Too many attempts. Try again later.'
                : 'Login failed. Please try again.';
        errEl.textContent = msg;
        errEl.classList.remove('hidden');
    }
}
window.loginAdmin = loginAdmin;

export async function logoutAdmin() {
    try { await signOut(auth); } catch (e) { console.error(e); }
    document.getElementById('adminPanelModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    showToast('Securely Logged Out');
}
window.logoutAdmin = logoutAdmin;
window.closeAdminPanel = logoutAdmin;

export async function saveProduct(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = 'Saving...'; btn.disabled = true;

    const editId = document.getElementById('adminEditId').value;
    const price = parseFloat(document.getElementById('adminPrice').value);
    const origPrice = parseFloat(document.getElementById('adminOriginalPrice').value) || price;
    const colorInput = document.getElementById('adminColors').value;
    const sizeInput = document.getElementById('adminSizes').value;
    const colorsArray = colorInput ? colorInput.split(',').map(s => s.trim()).filter(Boolean) : [];
    const sizesArray  = sizeInput  ? sizeInput.split(',').map(s => s.trim()).filter(Boolean)  : [];

    const productData = {
        title: document.getElementById('adminTitle').value,
        category: document.getElementById('adminCategory').value,
        image: document.getElementById('adminImage').value,
        price, originalPrice: origPrice,
        discount: origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0,
        stockStatus: document.getElementById('adminStockStatus').value,
        stars: parseFloat(document.getElementById('adminStars').value) || 4.5,
        description: document.getElementById('adminDesc').value,
        colors: colorsArray, sizes: sizesArray,
        updatedAt: new Date().toISOString()
    };

    try {
        if (editId) {
            await updateDoc(doc(db, "products", editId), productData);
            showToast('Product Updated Successfully');
        } else {
            productData.createdAt = new Date().toISOString();
            await addDoc(collection(db, "products"), productData);
            showToast('New Product Published');
        }
        resetForm();
        await fetchProducts();
    } catch (error) {
        console.error("Error saving product: ", error);
        showToast('Database permission error.', 'error');
    }
    btn.innerHTML = 'Save Product'; btn.disabled = false;
}
window.saveProduct = saveProduct;

export function editProduct(id) {
    const p = window.allProducts.find(x => x.id === id);
    if (!p) return;
    document.getElementById('formTitle').innerHTML = '<i data-lucide="edit-3" class="w-5 h-5 mr-2 text-brand-accent"></i> Edit Product';
    document.getElementById('adminEditId').value = p.id;
    document.getElementById('adminTitle').value = p.title;
    document.getElementById('adminCategory').value = p.category;
    document.getElementById('adminImage').value = p.image;
    document.getElementById('adminPrice').value = p.price;
    document.getElementById('adminOriginalPrice').value = p.originalPrice;
    document.getElementById('adminStockStatus').value = p.stockStatus;
    document.getElementById('adminStars').value = p.stars;
    document.getElementById('adminDesc').value = p.description || '';
    document.getElementById('adminColors').value = p.colors ? p.colors.join(', ') : '';
    document.getElementById('adminSizes').value  = p.sizes  ? p.sizes.join(', ')  : '';
    document.getElementById('cancelEditBtn').classList.remove('hidden');
    updateIcons();
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}
window.editProduct = editProduct;

export async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    if (id.startsWith('seed')) { showToast('Cannot delete preset products.', 'error'); return; }
    try {
        await deleteDoc(doc(db, "products", id));
        showToast('Product Removed');
        await fetchProducts();
    } catch { showToast('Error deleting product', 'error'); }
}
window.deleteProduct = deleteProduct;

export function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('adminEditId').value = '';
    document.getElementById('formTitle').innerHTML = '<i data-lucide="plus-circle" class="w-5 h-5 mr-2 text-brand-accent"></i> Add Product';
    document.getElementById('cancelEditBtn').classList.add('hidden');
    updateIcons();
}
window.resetForm = resetForm;

export function renderAdminProducts() {
    const list = document.getElementById('adminProductsList');
    if (!list) return;
    list.innerHTML = '';
    window.allProducts.forEach(p => {
        const badgeColor = p.stockStatus === 'In Stock'      ? 'text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
                         : p.stockStatus === 'Limited Stock' ? 'text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                                                              : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
        let variantBadges = '';
        if (p.colors && p.colors.length > 0) variantBadges += `<span class="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2 py-0.5 rounded ml-2">Colors: ${p.colors.length}</span>`;
        if (p.sizes  && p.sizes.length  > 0) variantBadges += `<span class="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2 py-0.5 rounded ml-2">Sizes: ${p.sizes.length}</span>`;

        list.innerHTML += `
            <tr class="hover:bg-gray-50/50 dark:hover:bg-[#151515] transition-colors border-t border-gray-100 dark:border-gray-800">
                <td class="p-4"><img src="${p.image}" class="w-14 h-14 object-cover rounded-xl shadow-sm border border-transparent dark:border-gray-800"></td>
                <td class="p-4">
                    <div class="font-medium text-gray-900 dark:text-white">${p.title}</div>
                    <div class="text-xs text-gray-500 mt-1 flex items-center">${p.category} ${variantBadges}</div>
                </td>
                <td class="p-4 font-semibold text-gray-900 dark:text-white">₹${p.price}</td>
                <td class="p-4"><span class="${badgeColor} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">${p.stockStatus}</span></td>
                <td class="p-4">
                    <div class="flex space-x-2 justify-center">
                        <button onclick="editProduct('${p.id}')"   class="w-9 h-9 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all flex items-center justify-center border border-transparent dark:border-gray-700"><i data-lucide="edit-2"  class="w-4 h-4"></i></button>
                        <button onclick="deleteProduct('${p.id}')" class="w-9 h-9 rounded-lg bg-red-50  text-red-600  hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-all flex items-center justify-center border border-transparent dark:border-red-900/30"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </td>
            </tr>`;
    });
    updateIcons();
}
window.renderAdminProducts = renderAdminProducts;

export async function fetchOrders() {
    try {
        const snap = await getDocs(collection(db, "orders"));
        const orders = [];
        let revenue = 0;
        snap.forEach(doc => {
            const data = doc.data();
            orders.push({ id: doc.id, ...data });
            if (['Delivered', 'Shipped', 'Pending'].includes(data.status)) revenue += Number(data.price || 0);
        });
        window.allOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        document.getElementById('statTotalOrders').innerText = window.allOrders.length;
        document.getElementById('statRevenue').innerText = '₹' + revenue.toLocaleString();
        renderAdminOrders();
    } catch (error) { console.error("Firestore Error loading orders:", error); }
}
window.fetchOrders = fetchOrders;

export function renderAdminOrders() {
    const list = document.getElementById('adminOrdersList');
    if (!list) return;
    list.innerHTML = '';
    if (window.allOrders.length === 0) {
        list.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500 font-medium">No orders found.</td></tr>';
        return;
    }
    window.allOrders.forEach(o => {
        const date = new Date(o.createdAt).toLocaleDateString();
        const oId = o.orderId || 'N/A';
        let variantBadges = '';
        if (o.color) variantBadges += `<span class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded mr-2 border border-transparent dark:border-gray-700">Color: ${o.color}</span>`;
        if (o.size)  variantBadges += `<span class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded border border-transparent dark:border-gray-700">Size: ${o.size}</span>`;

        list.innerHTML += `
            <tr class="hover:bg-gray-50/50 dark:hover:bg-[#151515] transition-colors border-t border-gray-100 dark:border-gray-800">
                <td class="p-4">
                    <div class="font-mono text-brand-accent bg-brand-accent/10 px-2 py-1 rounded inline-block text-xs font-semibold mb-1">${oId}</div>
                    <div class="font-medium text-gray-900 dark:text-white">${o.customerName}</div>
                    <div class="text-xs text-gray-500 mt-1">${o.customerPhone} • ${date}</div>
                </td>
                <td class="p-4">
                    <div class="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">${o.productTitle}</div>
                    <div class="mt-2 flex items-center">${variantBadges}</div>
                </td>
                <td class="p-4 font-semibold text-gray-900 dark:text-white">₹${o.price}</td>
                <td class="p-4">
                    <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg px-3 py-2 outline-none w-full focus:ring-2 focus:ring-brand-accent/50 text-gray-700 dark:text-gray-300">
                        <option value="Pending"    ${o.status==='Pending'?'selected':''}>Pending</option>
                        <option value="Processing" ${o.status==='Processing'?'selected':''}>Processing</option>
                        <option value="Shipped"    ${o.status==='Shipped'?'selected':''}>Shipped</option>
                        <option value="Delivered"  ${o.status==='Delivered'?'selected':''}>Delivered</option>
                        <option value="Cancelled"  ${o.status==='Cancelled'?'selected':''}>Cancelled</option>
                    </select>
                </td>
                <td class="p-4">
                    <div class="flex justify-center">
                        <button onclick="deleteOrder('${o.id}')" class="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-all flex items-center justify-center border border-transparent dark:border-red-900/30"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </td>
            </tr>`;
    });
    updateIcons();
}
window.renderAdminOrders = renderAdminOrders;

export async function updateOrderStatus(id, newStatus) {
    try {
        await updateDoc(doc(db, "orders", id), { status: newStatus });
        showToast(`Order updated to ${newStatus}`);

        const order = window.allOrders.find(o => o.id === id);
        if (order && order.customerPhone) {
            const notify = confirm(`Status updated! Do you want to notify ${order.customerName} via WhatsApp?`);
            if (notify) {
                let phone = order.customerPhone.replace(/\D/g, '');
                if (phone.length === 10) phone = '91' + phone;

                let variantMsg = '';
                if (order.color && order.color !== 'Multiple') variantMsg += `%0A🎨 *Color:* ${order.color}`;
                if (order.size  && order.size  !== 'Multiple') variantMsg += `%0A📏 *Size:* ${order.size}`;

                const message = `🛍️ *Klass Kart Order Update*%0A%0AHello ${order.customerName},%0A%0AYour order status has been updated to: *${newStatus}*%0A%0A🏷️ *Order ID:* ${order.orderId}%0A📦 *Product:* ${order.productTitle}${variantMsg}%0A💰 *Price:* ₹${order.price}%0A%0AYou can track your order using your Order ID on our website.%0A%0AThank you for shopping with us!`;
                window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
            }
        }
        fetchOrders();
    } catch (e) { console.error(e); showToast('Error updating status', 'error'); }
}
window.updateOrderStatus = updateOrderStatus;

export async function deleteOrder(id) {
    if (!confirm('Delete this order permanently?')) return;
    try {
        await deleteDoc(doc(db, "orders", id));
        showToast('Order Deleted Successfully');
        fetchOrders();
    } catch { showToast('Error deleting order', 'error'); }
}
window.deleteOrder = deleteOrder;
