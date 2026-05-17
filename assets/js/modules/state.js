// Shared global state (kept on window for backward compatibility with inline onclick handlers)
window.allProducts = [];
window.allOrders = [];
window.currentCategory = 'All';
window.selectedProductColor = '';
window.selectedProductSize = '';
window.cart = JSON.parse(localStorage.getItem('klass_cart')) || [];

export const state = window;
