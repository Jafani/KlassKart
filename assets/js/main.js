// Entry point — wires templates into DOM, then boots feature modules
import { headerHtml, viewsHtml, footerHtml, overlaysHtml } from "./modules/templates.js";

// Mount static HTML first so DOM nodes exist before module code touches them
document.getElementById('header-root').innerHTML   = headerHtml;
document.getElementById('views-root').innerHTML    = viewsHtml;
document.getElementById('footer-root').innerHTML   = footerHtml;
document.getElementById('overlays-root').innerHTML = overlaysHtml;

// Set copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Now load shared state + feature modules (they register window.* handlers used by inline onclick)
await import("./modules/state.js");
const ui       = await import("./modules/ui.js");
await import("./modules/cart.js");
await import("./modules/products.js");
await import("./modules/checkout.js");
await import("./modules/tracking.js");
await import("./modules/admin.js");

// Initial theme (now that the icon element exists)
ui.applyInitialTheme();

// Routing helper (kept here because it depends on view + products modules)
window.handleRouting = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');
    if (view === 'checkout') {
        const id = urlParams.get('id');
        const color = urlParams.get('color') || '';
        const size  = urlParams.get('size')  || '';
        if (id) window.setupCheckoutView(id, color, size, false);
        else window.navigate('home');
    } else {
        window.navigate('home');
    }
};

// Boot
window.addEventListener('load', () => {
    window.updateIcons();
    window.initSlideshow();
    window.fetchProducts();
    window.handleRouting();
    window.updateCartCount();
});
window.addEventListener('popstate', () => window.handleRouting());
