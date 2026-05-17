// HTML fragments for header, footer, views, modals, cart sidebar.
// Keeps index.html minimal and lets us split UI logically.

export const headerHtml = `
<header class="fixed w-full top-0 z-50 glass-effect transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
            <div class="flex-shrink-0 flex items-center cursor-pointer" onclick="navigate('home')">
                <span class="text-2xl font-bold tracking-tight">Klass<span class="text-brand-accent ml-1 font-light">Kart</span></span>
            </div>
            <div class="hidden md:flex flex-1 max-w-lg mx-8 relative">
                <input type="text" id="searchInput" placeholder="Search curated collections..." class="w-full pl-12 pr-4 py-3 bg-gray-100/50 border border-transparent rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 dark:bg-gray-900 dark:focus:bg-brand-gray dark:text-white transition-all shadow-sm" onkeyup="filterProducts()">
                <i data-lucide="search" class="absolute left-4 top-3.5 w-5 h-5 text-gray-400"></i>
            </div>
            <div class="flex items-center space-x-3">
                <button class="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-brand-gray text-gray-600 dark:text-gray-300 transition-all shadow-sm relative" onclick="toggleCart()" title="View Cart">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                    <span id="cartCount" class="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden shadow-sm border border-white dark:border-black">0</span>
                </button>
                <button class="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-brand-gray text-gray-600 dark:text-gray-300 transition-all shadow-sm" onclick="navigate('track')" title="Track Order">
                    <i data-lucide="truck" class="w-5 h-5"></i>
                </button>
                <button id="darkModeToggle" class="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-brand-gray text-gray-600 dark:text-gray-300 transition-all shadow-sm" onclick="toggleDarkMode()">
                    <i data-lucide="moon" id="darkModeIcon" class="w-5 h-5"></i>
                </button>
                <button class="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-brand-gray text-gray-600 dark:text-gray-300 transition-all shadow-sm" onclick="openAdminLogin()" title="Admin Login">
                    <i data-lucide="shield" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="md:hidden px-4 pb-4">
        <div class="relative">
            <input type="text" id="mobileSearchInput" placeholder="Search curated collections..." class="w-full pl-12 pr-4 py-3 bg-gray-100/80 border border-transparent rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 dark:bg-gray-900 dark:text-white transition-all shadow-sm" onkeyup="filterProducts(true)">
            <i data-lucide="search" class="absolute left-4 top-3.5 w-5 h-5 text-gray-400"></i>
        </div>
    </div>
</header>`;

export const viewsHtml = `
<main id="mainView" class="pt-32 md:pt-28 pb-12 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div class="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
            <div id="slideshow-container" class="w-full h-full relative"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div class="flex space-x-3 overflow-x-auto py-3 no-scrollbar" id="categoryFilterContainer">
            ${['All','Electronics','Fashion','Accessories','Kitchen','Home','Kids','Footwear','Sports'].map((c, i) => {
                const label = c === 'Fashion' ? 'Kart' : c;
                const value = c === 'Fashion' ? 'Fashion' : c;
                const active = i === 0
                    ? 'category-btn active px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 transition-all shadow-md'
                    : 'category-btn px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-medium bg-white text-gray-600 border border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-brand-gray transition-all';
                return `<button onclick="setCategory('${value}')" class="${active}">${label}</button>`;
            }).join('')}
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="loadingProducts" class="flex flex-col items-center justify-center py-20">
            <div class="loader mb-4"></div>
            <p class="text-gray-500 font-medium">Curating Collection...</p>
        </div>
        <div id="productsGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 hidden"></div>
        <div id="noProductsFound" class="hidden text-center py-24 animate-fade-in bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <i data-lucide="search-x" class="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4"></i>
            <h3 class="text-xl font-medium text-gray-600 dark:text-gray-400">No pieces found in this collection.</h3>
        </div>
    </div>
</main>

<main id="checkoutView" class="pt-32 md:pt-28 pb-12 min-h-screen hidden">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <button onclick="navigate('home')" class="mb-8 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center font-medium transition-all group">
            <div class="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm mr-3 group-hover:-translate-x-1 transition-transform border border-transparent dark:border-gray-800"><i data-lucide="arrow-left" class="w-4 h-4"></i></div>
            Return to Shop
        </button>
        <h1 class="text-3xl font-semibold mb-8 dark:text-white tracking-tight">Secure Checkout</h1>
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-6 sm:p-8 mb-8">
            <h2 class="text-lg font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
                <i data-lucide="shopping-bag" class="w-5 h-5 mr-3 text-brand-accent"></i> Order Summary
            </h2>
            <div class="p-5 bg-gray-50 dark:bg-black rounded-2xl border border-transparent dark:border-gray-800" id="checkoutProductSummary"></div>
        </div>
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-6 sm:p-8">
            <h2 class="text-lg font-semibold mb-6 flex items-center text-gray-800 dark:text-gray-200">
                <i data-lucide="map-pin" class="w-5 h-5 mr-3 text-brand-accent"></i> Delivery Details
            </h2>
            <form id="checkoutForm" onsubmit="processCheckout(event)">
                <input type="hidden" id="checkoutIsCart" value="false">
                <input type="hidden" id="checkoutProductId">
                <input type="hidden" id="checkoutProductColor">
                <input type="hidden" id="checkoutProductSize">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Full Name</label>
                        <input type="text" id="coName" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none"></div>
                    <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Mobile Number</label>
                        <input type="tel" id="coPhone" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none"></div>
                </div>
                <div class="mb-6"><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Complete Address</label>
                    <textarea id="coAddress" required rows="3" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none resize-none"></textarea></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pincode</label>
                        <input type="text" id="coPincode" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none"></div>
                    <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">City / District</label>
                        <input type="text" id="coCity" required class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none"></div>
                </div>
                <button type="submit" class="w-full bg-[#25D366] text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center transition-all hover:bg-[#20b858] shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    <svg class="w-5 h-5 mr-3 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    Secure Order via WhatsApp
                </button>
            </form>
        </div>
    </div>
</main>

<main id="trackingView" class="pt-32 md:pt-28 pb-12 min-h-screen hidden">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <h1 class="text-3xl font-semibold mb-8 dark:text-white tracking-tight text-center">Track Your Order</h1>
        <div class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm p-8 sm:p-10">
            <form onsubmit="trackOrder(event)">
                <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">Enter your Klass Kart Order ID</label>
                <div class="flex flex-col sm:flex-row gap-3">
                    <input type="text" id="trackOrderId" placeholder="e.g. KLS-A1B2C3" required class="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none text-center sm:text-left tracking-wider uppercase font-mono">
                    <button type="submit" id="trackBtn" class="bg-gray-900 text-white dark:bg-white dark:text-black font-medium px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Track</button>
                </div>
            </form>
            <div id="trackingResult" class="mt-10 hidden border-t border-gray-100 dark:border-gray-800 pt-8"></div>
        </div>
    </div>
</main>`;

export const footerHtml = `
<footer class="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 pt-16 pb-8 mt-12 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div class="col-span-1 md:col-span-1">
                <span class="text-2xl font-bold tracking-tight mb-4 inline-block text-gray-900 dark:text-white">Klass<span class="text-brand-accent font-light">Kart</span></span>
                <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">Curated premium Kart at your fingertips. Discover style, elegance, and quality with every purchase.</p>
            </div>
            <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-5">Explore</h4>
                <ul class="space-y-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <li><a href="#" onclick="navigate('home')"  class="hover:text-brand-accent transition-colors">Shop Collection</a></li>
                    <li><a href="#" onclick="navigate('track')" class="hover:text-brand-accent transition-colors">Track Your Order</a></li>
                    <li><a href="#" class="hover:text-brand-accent transition-colors">Our Story</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-5">Connect</h4>
                <ul class="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <li class="flex items-center"><i data-lucide="phone" class="w-4 h-4 mr-3 text-brand-accent"></i> +91 9387762313</li>
                    <li class="flex items-center"><i data-lucide="mail"  class="w-4 h-4 mr-3 text-brand-accent"></i> ameerjafani@gmail.com</li>
                    <li class="flex items-start"><i data-lucide="map-pin" class="w-4 h-4 mr-3 mt-0.5 text-brand-accent"></i> Malappuram, Kerala, India</li>
                </ul>
            </div>
            <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-5">Follow Us</h4>
                <div class="flex space-x-4 mb-6">
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:bg-brand-accent hover:text-white transition-all shadow-sm"><i data-lucide="facebook"  class="w-4 h-4"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:bg-brand-accent hover:text-white transition-all shadow-sm"><i data-lucide="instagram" class="w-4 h-4"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:bg-brand-accent hover:text-white transition-all shadow-sm"><i data-lucide="twitter"   class="w-4 h-4"></i></a>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-100 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p class="text-gray-400">&copy; <span id="year"></span> Klass Kart. All rights reserved.</p>
            <p class="text-gray-400 mt-2 md:mt-0 flex items-center">
                Created by <a href="https://www.ameerjafani.org" target="_blank" class="mx-1 text-gray-700 dark:text-gray-300 font-medium hover:text-brand-accent transition-colors">SAMAR Solutionz</a> by Ameer Jafani
            </p>
        </div>
    </div>
</footer>`;

export const overlaysHtml = `
<!-- Product Modal -->
<div id="productModal" class="fixed inset-0 z-[60] bg-gray-900/60 hidden flex items-center justify-center p-4 backdrop-blur-md opacity-0 transition-opacity duration-300">
    <div class="bg-white dark:bg-black w-full max-w-4xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300 rounded-3xl shadow-2xl animate-fade-in no-scrollbar border border-transparent dark:border-gray-800" id="productModalContent">
        <div class="relative">
            <button onclick="closeProductModal()" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 transition-all shadow-sm border border-transparent dark:border-gray-700">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div class="h-72 md:h-full min-h-[400px] bg-gray-50 dark:bg-gray-900 relative">
                    <img id="modalProductImage" src="" alt="Product" class="w-full h-full object-cover">
                    <div id="modalProductStockBadge" class="absolute top-5 left-5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full shadow-md"></div>
                </div>
                <div class="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                        <span id="modalProductCategory" class="text-xs font-semibold text-brand-accent uppercase tracking-wider mb-3 inline-block"></span>
                        <h2 id="modalProductTitle" class="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3 tracking-tight"></h2>
                        <div class="flex items-center mb-4" id="modalProductStars"></div>
                        <div class="flex items-end gap-3 mb-2">
                            <span id="modalProductPrice" class="text-3xl font-bold text-gray-900 dark:text-white"></span>
                            <span id="modalProductOriginalPrice" class="text-lg text-gray-400 line-through mb-1"></span>
                            <span id="modalProductDiscount" class="text-xs font-bold text-white bg-brand-accent rounded-full mb-1.5 ml-2 px-2.5 py-1"></span>
                        </div>
                        <div id="modalSaveBadge" class="mb-6"></div>
                        <p id="modalProductDescription" class="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed"></p>
                        <div id="modalVariantsContainer" class="mb-8 space-y-6">
                            <div id="modalColorSection" class="hidden">
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select Color</h4>
                                <div id="modalColorOptions" class="flex flex-wrap gap-3"></div>
                            </div>
                            <div id="modalSizeSection" class="hidden">
                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select Size</h4>
                                <div id="modalSizeOptions" class="flex flex-wrap gap-3"></div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex gap-3">
                        <button id="modalAddToCartBtn" class="flex-1 bg-white text-gray-900 border border-gray-200 dark:bg-[#111] dark:text-white dark:border-gray-800 py-4 rounded-xl font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center justify-center">
                            <i data-lucide="shopping-cart" class="w-5 h-5 mr-2"></i> Add to Cart
                        </button>
                        <button id="modalBuyNowBtn" class="flex-1 bg-gray-900 text-white dark:bg-white dark:text-black font-medium rounded-xl py-4 px-6 flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                            Buy Now <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Admin Login -->
<div id="adminLoginModal" class="fixed inset-0 z-[70] bg-gray-900/60 hidden flex items-center justify-center p-4 backdrop-blur-md">
    <div class="bg-white dark:bg-black rounded-3xl w-full max-w-md p-10 shadow-2xl relative animate-fade-in border border-gray-100 dark:border-gray-800">
        <button onclick="closeAdminLogin()" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"><i data-lucide="x" class="w-5 h-5"></i></button>
        <div class="text-center mb-8">
            <div class="w-14 h-14 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-accent border border-transparent dark:border-gray-800">
                <i data-lucide="lock" class="w-6 h-6"></i>
            </div>
            <h2 class="text-2xl font-semibold dark:text-white">Admin Portal</h2>
            <p class="text-sm text-gray-500 mt-2">Sign in to manage Klass Kart</p>
        </div>
        <div class="space-y-5">
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" id="adminId" autocomplete="email" placeholder="admin@example.com" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none"></div>
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input type="password" id="adminPassword" autocomplete="current-password" class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-800 dark:bg-black dark:text-white transition-all outline-none"></div>
            <div id="loginError" class="text-white text-sm hidden text-center font-medium bg-red-500 rounded-lg py-3">Invalid Credentials!</div>
            <button onclick="loginAdmin()" class="w-full bg-gray-900 text-white dark:bg-white dark:text-black font-medium py-4 px-4 rounded-xl transition-all hover:bg-gray-800 dark:hover:bg-gray-200 shadow-md mt-2 border border-transparent dark:border-gray-800">Enter Dashboard</button>
        </div>
    </div>
</div>

<!-- Admin Panel -->
<div id="adminPanelModal" class="fixed inset-0 z-[80] bg-gray-50 dark:bg-black hidden overflow-y-auto animate-fade-in">
    <div class="min-h-screen pb-20">
        <div class="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-brand-accent/10 rounded-full flex items-center justify-center mr-3 text-brand-accent">
                        <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                    </div>
                    <h2 class="text-xl font-semibold dark:text-white">Klass Hub</h2>
                </div>
                <button onclick="logoutAdmin()" class="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all font-medium text-sm flex items-center border border-transparent dark:border-gray-800">
                    <i data-lucide="log-out" class="w-4 h-4 mr-2"></i> Sign Out
                </button>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div class="bg-white dark:bg-[#111] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-transform hover:-translate-y-1">
                    <div><p class="text-sm text-gray-500 font-medium uppercase tracking-wider">Products</p>
                        <h3 class="text-4xl font-bold mt-2 text-gray-900 dark:text-white" id="statTotalProducts">0</h3></div>
                    <div class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400"><i data-lucide="box" class="w-7 h-7"></i></div>
                </div>
                <div class="bg-white dark:bg-[#111] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-transform hover:-translate-y-1">
                    <div><p class="text-sm text-gray-500 font-medium uppercase tracking-wider">Orders</p>
                        <h3 class="text-4xl font-bold mt-2 text-gray-900 dark:text-white" id="statTotalOrders">0</h3></div>
                    <div class="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400"><i data-lucide="shopping-bag" class="w-7 h-7"></i></div>
                </div>
                <div class="bg-white dark:bg-[#111] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-transform hover:-translate-y-1">
                    <div><p class="text-sm text-gray-500 font-medium uppercase tracking-wider">Revenue</p>
                        <h3 class="text-4xl font-bold mt-2 text-brand-accent" id="statRevenue">₹0</h3></div>
                    <div class="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-brand-accent"><i data-lucide="indian-rupee" class="w-7 h-7"></i></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-1 bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 self-start">
                    <h3 class="text-lg font-semibold mb-6 dark:text-white flex items-center" id="formTitle">
                        <i data-lucide="plus-circle" class="w-5 h-5 mr-2 text-brand-accent"></i> Add Product
                    </h3>
                    <form id="productForm" onsubmit="saveProduct(event)">
                        <input type="hidden" id="adminEditId">
                        <div class="space-y-5">
                            <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Product Title</label>
                                <input type="text" id="adminTitle" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none"></div>
                            <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Category</label>
                                <select id="adminCategory" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none">
                                    ${['Electronics','Kart','Accessories','Kitchen','Home','Kids','Footwear','Sports'].map(c => `<option value="${c}">${c}</option>`).join('')}
                                </select></div>
                            <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Image URL</label>
                                <input type="url" id="adminImage" required placeholder="https://..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none"></div>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Price (₹)</label>
                                    <input type="number" id="adminPrice" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none"></div>
                                <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Orig. Price</label>
                                    <input type="number" id="adminOriginalPrice" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none"></div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Stock Status</label>
                                    <select id="adminStockStatus" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none">
                                        <option value="In Stock">In Stock</option><option value="Limited Stock">Limited Stock</option><option value="Out of Stock">Out of Stock</option>
                                    </select></div>
                                <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Stars (1-5)</label>
                                    <input type="number" step="0.1" max="5" min="1" id="adminStars" value="4.5" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none"></div>
                            </div>
                            <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Colors (Comma separated)</label>
                                <input type="text" id="adminColors" placeholder="e.g. Red, Black" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none"></div>
                            <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Sizes (Comma separated)</label>
                                <input type="text" id="adminSizes" placeholder="e.g. S, M, L" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all outline-none"></div>
                            <div><label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</label>
                                <textarea id="adminDesc" rows="3" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent dark:border-gray-700 dark:bg-black dark:text-white transition-all resize-none outline-none"></textarea></div>
                            <div class="flex gap-3 pt-2">
                                <button type="submit" class="flex-1 bg-gray-900 text-white dark:bg-white dark:text-black font-medium rounded-xl py-3 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 border border-transparent dark:border-gray-800">Save Product</button>
                                <button type="button" onclick="resetForm()" class="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hidden" id="cancelEditBtn">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="lg:col-span-2 bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold dark:text-white flex items-center"><i data-lucide="layers" class="w-5 h-5 mr-2 text-brand-accent"></i> Inventory</h3>
                        <button onclick="fetchProducts()" class="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium flex items-center transition-colors"><i data-lucide="refresh-cw" class="w-4 h-4 mr-1"></i> Sync</button>
                    </div>
                    <div class="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
                        <table class="w-full text-left border-collapse">
                            <thead><tr class="bg-gray-50 dark:bg-black text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                                <th class="p-4">Item</th><th class="p-4">Details</th><th class="p-4">Price</th><th class="p-4">Status</th><th class="p-4 text-center">Actions</th>
                            </tr></thead>
                            <tbody id="adminProductsList" class="text-sm dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-800"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="mt-8 bg-white dark:bg-[#111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold dark:text-white flex items-center"><i data-lucide="inbox" class="w-5 h-5 mr-2 text-brand-accent"></i> Order Management</h3>
                    <button onclick="fetchOrders()" class="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium flex items-center transition-colors"><i data-lucide="refresh-cw" class="w-4 h-4 mr-1"></i> Sync</button>
                </div>
                <div class="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
                    <table class="w-full text-left border-collapse">
                        <thead><tr class="bg-gray-50 dark:bg-black text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                            <th class="p-4">Order ID &amp; Client</th><th class="p-4">Product</th><th class="p-4">Value</th><th class="p-4">Status Update</th><th class="p-4 text-center">Delete</th>
                        </tr></thead>
                        <tbody id="adminOrdersList" class="text-sm dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-800"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <button onclick="closeAdminPanel()" class="fixed bottom-6 right-6 z-50 bg-gray-900 text-white dark:bg-white dark:text-black w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center border border-transparent dark:border-gray-800">
        <i data-lucide="x" class="w-6 h-6"></i>
    </button>
</div>

<!-- Cart Sidebar -->
<div id="cartBackdrop" class="fixed inset-0 bg-black/50 z-[85] hidden backdrop-blur-sm transition-opacity" onclick="toggleCart()"></div>
<div id="cartSidebar" class="fixed inset-y-0 right-0 z-[90] w-full max-w-sm bg-white dark:bg-black shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col border-l border-gray-100 dark:border-gray-800">
    <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
        <h2 class="text-xl font-semibold dark:text-white flex items-center"><i data-lucide="shopping-cart" class="w-5 h-5 mr-3"></i> Your Cart</h2>
        <button onclick="toggleCart()" class="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <div id="cartItems" class="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"></div>
    <div class="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111]">
        <div class="flex justify-between items-center text-lg font-bold dark:text-white mb-6">
            <span>Subtotal</span><span id="cartTotal" class="text-2xl text-brand-accent">₹0</span>
        </div>
        <button onclick="checkoutCart()" class="w-full bg-gray-900 text-white dark:bg-white dark:text-black py-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex justify-center items-center">
            Checkout Securely <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
        </button>
    </div>
</div>`;
