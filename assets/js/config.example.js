// =============================================================
//  Klass Kart — local config TEMPLATE
//  -------------------------------------------------------------
//  STEPS:
//    1. Copy this file to:   assets/js/config.local.js
//    2. Fill in YOUR Firebase project values
//    3. NEVER commit config.local.js (already in .gitignore)
//
//  Admin login uses Firebase Authentication. Create an admin
//  user in Firebase Console → Authentication → Users → Add user.
// =============================================================

export const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:xxxxxxxxxxxxxxxx"
};

// WhatsApp business number used for order forwarding
export const whatsappNumber = "919387762313";
