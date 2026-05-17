// Tailwind runtime config (loaded after cdn.tailwindcss.com)
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                brand: {
                    accent: '#C5A880', /* Elegant Gold/Beige */
                    dark: '#000000',
                    light: '#f8fafc',
                    gray: '#111111'
                }
            }
        }
    }
};
