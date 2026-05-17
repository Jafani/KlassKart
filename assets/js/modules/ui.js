// Generic UI helpers: icons, toast, dark-mode, navigation, slideshow
import { slideImages } from "../data/slides.js";

export function updateIcons() {
    if (window.lucide) window.lucide.createIcons();
}
window.updateIcons = updateIcons;

export function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `px-5 py-4 shadow-lg rounded-2xl font-medium text-sm transform transition-all duration-300 translate-x-full flex items-center border ${type === 'success' ? 'bg-[#25D366] text-white border-transparent' : 'bg-red-500 text-white border-transparent'}`;
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5 mr-3"></i> <span>${msg}</span>`;
    document.getElementById('toastContainer').appendChild(toast);
    updateIcons();
    setTimeout(() => toast.classList.remove('translate-x-full'), 10);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
window.showToast = showToast;

export function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const icon = document.getElementById('darkModeIcon');
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    updateIcons();
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
window.toggleDarkMode = toggleDarkMode;

export function applyInitialTheme() {
    if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        const icon = document.getElementById('darkModeIcon');
        if (icon) icon.setAttribute('data-lucide', 'sun');
    }
}

export function navigate(view) {
    document.getElementById('mainView').classList.add('hidden');
    document.getElementById('checkoutView').classList.add('hidden');
    document.getElementById('trackingView').classList.add('hidden');

    if (view === 'home') {
        document.getElementById('mainView').classList.remove('hidden');
        try {
            window.history.pushState({}, '', window.location.pathname);
        } catch (e) {}
    } else if (view === 'checkout') {
        document.getElementById('checkoutView').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'track') {
        document.getElementById('trackingView').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    updateIcons();
}
window.navigate = navigate;

let currentSlide = 0;
export function initSlideshow() {
    const container = document.getElementById('slideshow-container');
    if (!container) return;
    container.innerHTML = slideImages.map((src, i) =>
        `<img src="${src}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === 0 ? 'opacity-100' : 'opacity-0'}" id="slide-${i}">`
    ).join('');
    setInterval(() => {
        document.getElementById(`slide-${currentSlide}`).classList.replace('opacity-100', 'opacity-0');
        currentSlide = (currentSlide + 1) % slideImages.length;
        document.getElementById(`slide-${currentSlide}`).classList.replace('opacity-0', 'opacity-100');
    }, 3500);
}
window.initSlideshow = initSlideshow;
