# Klass Kart — Deployment & Admin Setup Guide

Site live URL: `https://<username>.github.io/klass-kart/`
Secrets are injected at build time from GitHub Secrets — never committed.

---

## 1. Enable Firebase Authentication (one-time)

Admin login now uses **Firebase Authentication** (no hardcoded passwords).

1. Open Firebase Console → **Authentication → Sign-in method**.
2. Enable **Email/Password** → Save.
3. Go to **Authentication → Users → Add user**.
4. Enter admin email (e.g. `admin@klasskart.in`) + a strong password → Add user.

ഈ email/password ഉപയോഗിച്ച് മാത്രമേ admin panel-ലേക്ക് login ചെയ്യാൻ പറ്റൂ.
പുതിയ admins വേണമെങ്കിൽ ഇതേ പേജിൽ "Add user" വീണ്ടും ചെയ്യുക.

---

## 2. Update Firestore Security Rules

Firebase Console → **Firestore → Rules** → repo-യിലെ `firestore.rules` content paste ചെയ്ത് **Publish**.

ഇത് നിർബന്ധം — ഇല്ലെങ്കിൽ ആർക്കും database write ചെയ്യാം.

---

## 3. GitHub repo ഉണ്ടാക്കുക

```bash
cd klass-kart
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/klass-kart.git
git push -u origin main
```

`.gitignore` `config.local.js`-നെ exclude ചെയ്യും. ✅

---

## 4. GitHub Secrets ചേർക്കുക

Repo → **Settings → Secrets and variables → Actions → New repository secret**.

| Secret Name | Value |
|---|---|
| `FIREBASE_API_KEY` | firebaseConfig.apiKey |
| `FIREBASE_AUTH_DOMAIN` | firebaseConfig.authDomain |
| `FIREBASE_DATABASE_URL` | firebaseConfig.databaseURL |
| `FIREBASE_PROJECT_ID` | firebaseConfig.projectId |
| `FIREBASE_STORAGE_BUCKET` | firebaseConfig.storageBucket |
| `FIREBASE_MESSAGING_SENDER_ID` | firebaseConfig.messagingSenderId |
| `FIREBASE_APP_ID` | firebaseConfig.appId |
| `WHATSAPP_NUMBER` | `919387762313` |

⚠️ Admin username/password ഇപ്പോൾ **Firebase Auth-ൽ** ആണ് — secrets ആവശ്യമില്ല.

---

## 5. GitHub Pages enable ചെയ്യുക

Repo → **Settings → Pages → Source: GitHub Actions**.

---

## 6. Deploy

`main`-ലേക്ക് push ചെയ്യുമ്പോൾ workflow ഓട്ടോമാറ്റിക് ആയി run ആകും.
**Actions** tab നോക്കുക → green ✅ ആയാൽ site live.

Manual: **Actions → Deploy to GitHub Pages → Run workflow**.

---

## 7. Live URL Verify

`https://<username>.github.io/klass-kart/`

- [ ] Homepage load ആകുന്നു
- [ ] Products വരുന്നു
- [ ] Cart / Checkout work ചെയ്യുന്നു
- [ ] Footer-ലെ admin link → email/password modal വരുന്നു
- [ ] തെറ്റായ password കൊടുത്താൽ "Invalid email or password"
- [ ] ശരിയായ Firebase Auth credentials കൊടുത്താൽ panel തുറക്കും, products add/edit/delete ചെയ്യാം

---

## പ്രശ്നങ്ങൾ?

- **"auth/operation-not-allowed"** → Firebase Console-ൽ Email/Password sign-in enable ചെയ്തിട്ടില്ല.
- **"Missing or insufficient permissions"** → Firestore Rules publish ചെയ്തിട്ടില്ല, അല്ലെങ്കിൽ login ചെയ്തിട്ടില്ല.
- **404 on live URL** → Pages source `GitHub Actions` ആണോ എന്ന് check.
- **Blank page** → Browser console നോക്കുക; എല്ലാ secrets-ഉം ചേർത്തോ verify ചെയ്യുക.

---

## പുതിയ admin ചേർക്കാൻ

Firebase Console → **Authentication → Users → Add user**. അത്രമാത്രം.
കോഡിലോ GitHub secrets-ലോ ഒന്നും മാറ്റേണ്ട ആവശ്യമില്ല.
