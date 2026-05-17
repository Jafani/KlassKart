// Order tracking by ID
import { db, collection, getDocs } from "../firebase.js";
import { showToast } from "./ui.js";

export async function trackOrder(e) {
    e.preventDefault();
    const orderIdInput = document.getElementById('trackOrderId').value.trim();
    const resultDiv = document.getElementById('trackingResult');
    const btn = document.getElementById('trackBtn');
    if (!orderIdInput) return;

    btn.innerHTML = '<div class="loader" style="width:20px;height:20px;border-width:2px;"></div>';
    btn.disabled = true;
    resultDiv.classList.add('hidden');

    try {
        const snap = await getDocs(collection(db, "orders"));
        let foundOrder = null;
        snap.forEach(doc => {
            const data = doc.data();
            if (data.orderId && data.orderId.toUpperCase() === orderIdInput.toUpperCase()) foundOrder = data;
        });

        if (foundOrder) {
            const date = new Date(foundOrder.createdAt).toLocaleDateString();
            let badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
            if (foundOrder.status === 'Processing') badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
            else if (foundOrder.status === 'Shipped')   badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
            else if (foundOrder.status === 'Delivered') badgeClass = "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
            else if (foundOrder.status === 'Cancelled') badgeClass = "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";

            resultDiv.innerHTML = `
                <h3 class="text-lg font-semibold mb-6 dark:text-white">Order Status Found</h3>
                <div class="grid grid-cols-2 gap-6 text-sm mb-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-transparent dark:border-gray-800">
                    <div><p class="text-gray-500 mb-1">Order ID</p><p class="font-semibold text-gray-900 dark:text-white">${foundOrder.orderId}</p></div>
                    <div><p class="text-gray-500 mb-1">Date</p><p class="font-semibold text-gray-900 dark:text-white">${date}</p></div>
                    <div class="col-span-2"><p class="text-gray-500 mb-1">Product</p><p class="font-semibold text-gray-900 dark:text-white">${foundOrder.productTitle}</p></div>
                    <div><p class="text-gray-500 mb-1">Total Amount</p><p class="font-semibold text-brand-accent">₹${foundOrder.price}</p></div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-gray-600 dark:text-gray-400 font-medium">Current Status:</span>
                    <span class="font-semibold px-4 py-1.5 rounded-full ${badgeClass} text-xs tracking-wide uppercase border border-transparent dark:border-gray-700/50">${foundOrder.status}</span>
                </div>`;
        } else {
            resultDiv.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 rounded-xl font-medium text-center">
                    We couldn't find an order with that ID.
                </div>`;
        }
        resultDiv.classList.remove('hidden');
    } catch (err) {
        console.error(err);
        showToast('Failed to track order.', 'error');
    }
    btn.innerHTML = 'Track';
    btn.disabled = false;
}
window.trackOrder = trackOrder;
