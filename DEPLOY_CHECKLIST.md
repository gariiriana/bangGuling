# Quick Deployment Checklist

## ✅ Pre-Deployment (Already Done)
- [x] Firebase configuration added
- [x] Firestore rules created (`firestore.rules`)
- [x] All features implemented
- [x] TypeScript errors fixed
- [x] Vercel config created (`vercel.json`)

## 📋 Before You Deploy

### 1. Publish Firestore Rules (5 minutes)
```bash
# Go to: https://console.firebase.google.com/
# 1. Select project: test-eultra
# 2. Firestore Database → Rules tab
# 3. Copy content from firestore.rules
# 4. Paste and click "Publish"
```

### 2. Seed Products to Firestore (10 minutes)
```bash
# Go to: https://console.firebase.google.com/
# 1. Firestore Database → Data tab
# 2. Start collection: "products"
# 3. Add 3-5 products (see DEPLOY_INSTRUCTIONS.md)
```

### 3. Test Locally
```bash
npm run build
npm run preview
# Visit: http://localhost:4173
# Test: Register → Login → Browse → Order
```

## 🚀 Deploy to Vercel (5 minutes)

### Quick Deploy via GitHub
1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Ready for Vercel"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repo
   - **IMPORTANT:** Add environment variables:
     ```
     VITE_FIREBASE_API_KEY=AIzaSyDKrV_gy9AtPp3tz68U2eK1k-k9KH2G_jc
     VITE_FIREBASE_AUTH_DOMAIN=test-eultra.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=test-eultra
     VITE_FIREBASE_STORAGE_BUCKET=test-eultra.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=517963991929
     VITE_FIREBASE_APP_ID=1:517963991929:web:bddb2cc78385e6e3e4cdc3
     ```
   - Click "Deploy"

3. **Add Domain to Firebase:**
   - After deploy, copy your Vercel URL (e.g., `bang-guling.vercel.app`)
   - Go to Firebase Console → Authentication → Settings
   - Add domain to "Authorized domains"

## ✅ Post-Deployment Testing

Visit your Vercel URL and test:
- [ ] Register as Customer
- [ ] Login works
- [ ] Products load from Firestore
- [ ] Create order succeeds
- [ ] Order tracking shows real-time updates

## 🎉 Done!

Your app is now live! Share the URL:
- **Customer Mobile:** `https://your-app.vercel.app`
- **Driver Mobile:** `https://your-app.vercel.app/login` (register as driver)
- **Owner Desktop:** `https://your-app.vercel.app/login` (register as owner)

---

**Need Help?** See full guide in `VERCEL_DEPLOY.md`
