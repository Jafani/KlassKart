# Klass Kart — Premium E-commerce (Static Site)

Single-page HTML app refactored into a clean multi-file structure so it can
be hosted on **GitHub Pages** (or any static host) and reused across
projects without leaking your Firebase / admin secrets.

---

## 📁 Folder layout

```
klass-kart/
├── index.html                # Markup shell (header, footer, view roots)
├── firestore.rules           # Paste into Firebase Console → Firestore → Rules
├── .gitignore                # Hides config.local.js from Git
├── README.md
└── assets/
    ├── css/
    │   └── styles.css        # Custom CSS (glass effect, animations, loader)
    └── js/
        ├── tailwind.config.js   # Tailwind theme + brand colors
        ├── config.example.js    # Template — commit this
        ├── config.local.js      # YOUR secrets — gitignored
        ├── firebase.js          # Firebase init + Firestore exports
        ├── main.js              # Entry point
        ├── data/
        │   ├── dummy-products.js
        │   └── slides.js
        └── modules/
            ├── templates.js     # HTML fragments for header/footer/views/modals
            ├── state.js         # Shared global state
            ├── ui.js            # Toast, dark-mode, navigation, slideshow
            ├── cart.js          # Cart sidebar + persistence
            ├── products.js      # Fetch / render / product modal
            ├── checkout.js      # Order summary + WhatsApp handoff
            ├── tracking.js      # Order tracking
            └── admin.js         # Admin login + product/order CRUD
```

---

## 🚀 Setup (first time)

1. Copy the secrets template and fill in your own values:

   ```bash
   cp assets/js/config.example.js assets/js/config.local.js
   ```

   Edit `assets/js/config.local.js`:
   - `firebaseConfig` — from Firebase Console → Project Settings → Your apps
   - `adminCredentials.id` / `.password` — your admin login
   - `whatsappNumber` — your business WhatsApp number (no `+`, with country code)

2. **Apply the Firestore security rules.**
   Open `firestore.rules` and paste into:
   Firebase Console → Firestore Database → **Rules** → **Publish**.

3. Test locally:

   ```bash
   # any static server works — examples:
   python3 -m http.server 8000
   # or
   npx serve .
   ```

   Open <http://localhost:8000>.

---

## ☁️ Deploy to GitHub Pages

1. Create a new GitHub repo and push:

   ```bash
   git init
   git add .
   git commit -m "Initial Klass Kart"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

   `config.local.js` is in `.gitignore`, so your secrets are NOT pushed.

2. In the GitHub repo: **Settings → Pages → Source = `main` branch, `/ (root)`** → Save.

3. Your site goes live at `https://<you>.github.io/<repo>/`.

4. **Important:** after Pages deploys, the site won't work yet because
   `config.local.js` is missing on the server. Pick ONE option:

   - **Option A — Public Firebase config (recommended).** Firebase web
     `apiKey` is actually NOT a secret (it just identifies your project;
     real protection is via Firestore Rules). Rename
     `config.local.js` → `config.public.js`, remove the `.gitignore`
     entry, commit it, and update `firebase.js` + `admin.js` +
     `checkout.js` imports to point at the new file. **Then DELETE the
     admin credentials from it and move admin auth to Firebase Auth
     (see "Hardening" below).**

   - **Option B — Build-time inject via GitHub Actions.** Add your
     config as repo Secrets and have an Action write `config.local.js`
     before deploying. Heavier setup; needed only if you truly want the
     `apiKey` private.

---

## 🔐 What is and isn't secret

| Value | Truly secret? | Why |
|---|---|---|
| Firebase `apiKey`, `projectId`, etc. | ❌ No | Public by design — protection is in **Firestore Rules**. |
| Admin `id` / `password` (current code) | ✅ Yes | Hardcoded in JS = anyone can read it. **Move to Firebase Auth.** |
| WhatsApp number | ❌ No | Already visible in the footer. |
| Service account JSON | ✅ Yes | NEVER put in this repo. |

### 🛡️ Hardening (recommended next step)

The current admin login is checked in the browser, so anyone can read the
password from `config.local.js`. To fix:

1. Firebase Console → **Authentication → Enable Email/Password**.
2. Create one admin user (your email + a strong password).
3. Replace `loginAdmin()` in `assets/js/modules/admin.js` with
   `signInWithEmailAndPassword(auth, email, password)`.
4. In `firestore.rules`, change the admin-gated rules from `if false`
   to `if request.auth != null` (or check a custom claim).
5. Delete `adminCredentials` from `config.local.js`.

---

## 🧩 Reusing this template for another shop

1. Copy the whole folder.
2. Create a NEW Firebase project + new `config.local.js`.
3. Apply `firestore.rules` to the new project.
4. Tweak brand colors in `assets/js/tailwind.config.js` and
   `assets/css/styles.css`.
5. Update WhatsApp number, footer, slideshow images.

Done — same code, different shop, no secret leakage.
