# 🚀 Vercel Deployment Guide - Bang Guling

## Prerequisites
- ✅ Firebase project setup complete
- ✅ Firestore rules published
- ✅ Products seeded to Firestore
- ✅ Code ready for production

---

## Step-by-Step Deployment

### 1. Push Code to GitHub (if not already)
```bash
# Initialize git if needed
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create repo on GitHub and push
git remote add origin https://github.com/your-username/bang-guling.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com/)
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. **Configure Project:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add these:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyDKrV_gy9AtPp3tz68U2eK1k-k9KH2G_jc
   VITE_FIREBASE_AUTH_DOMAIN=test-eultra.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=test-eultra
   VITE_FIREBASE_STORAGE_BUCKET=test-eultra.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=517963991929
   VITE_FIREBASE_APP_ID=1:517963991929:web:bddb2cc78385e6e3e4cdc3
   ```
   *(Use values from your Firebase config)*

6. Click **"Deploy"**
7. Wait 2-3 minutes for build to complete

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

### 3. Post-Deployment Configuration

#### Update Firebase Auth Domain
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project **test-eultra**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain: `your-app.vercel.app`

#### Update Firestore Rules (if needed)
No changes needed - rules work for any domain.

---

## 🔍 Verification Checklist

After deployment, test these:

### ✅ Customer Flow (Mobile View)
- [ ] Visit: `https://your-app.vercel.app`
- [ ] Register new customer account
- [ ] Login successfully
- [ ] Browse products (loaded from Firestore)
- [ ] Add to cart
- [ ] Checkout & create order
- [ ] View order tracking

### ✅ Driver Flow (Mobile View)
- [ ] Register driver account
- [ ] Login
- [ ] View available orders
- [ ] Accept order
- [ ] GPS navigation works
- [ ] Complete delivery

### ✅ Owner Flow (Desktop View)
- [ ] Register owner account
- [ ] Login
- [ ] Dashboard shows stats
- [ ] Charts display correctly
- [ ] View all orders

---

## 🐛 Common Issues & Solutions

### Issue 1: "Page Not Found" on Refresh
**Cause:** SPA routing not configured  
**Solution:** Vercel.json already configured with rewrites - should work automatically

### Issue 2: Firebase Connection Error
**Cause:** Environment variables not set  
**Solution:** 
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all VITE_FIREBASE_* variables
3. Redeploy: `vercel --prod`

### Issue 3: Build Fails
**Cause:** TypeScript errors or missing dependencies  
**Solution:**
```bash
# Test build locally first
npm run build

# If successful, push to GitHub
git push
```

### Issue 4: Blank Page After Deploy
**Cause:** Incorrect base path in vite.config  
**Solution:** Already handled - no changes needed

---

## 🎯 Performance Optimization (Optional)

### Enable Vercel Analytics
1. Go to Vercel Dashboard → Analytics tab
2. Enable "Web Analytics"

### Add Progressive Web App (PWA)
```bash
npm install vite-plugin-pwa -D
```

---

## 📝 Environment Variables Reference

All environment variables must start with `VITE_` to be accessible in browser:

| Variable | Value | Required |
|----------|-------|----------|
| VITE_FIREBASE_API_KEY | Your API key | ✅ Yes |
| VITE_FIREBASE_AUTH_DOMAIN | test-eultra.firebaseapp.com | ✅ Yes |
| VITE_FIREBASE_PROJECT_ID | test-eultra | ✅ Yes |
| VITE_FIREBASE_STORAGE_BUCKET | test-eultra.appspot.com | ✅ Yes |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Your sender ID | ✅ Yes |
| VITE_FIREBASE_APP_ID | Your app ID | ✅ Yes |

---

## 🔄 Continuous Deployment

Once connected to GitHub, Vercel automatically:
- ✅ Builds on every push to `main`
- ✅ Creates preview deployments for PRs
- ✅ Runs your build command
- ✅ Serves from `dist` folder

To update your app:
```bash
git add .
git commit -m "Update feature"
git push
```
Vercel will auto-deploy in 2-3 minutes.

---

## ✅ Success!

Your app is now live at:
- **Production URL:** `https://your-app.vercel.app`
- **Custom Domain:** (optional) Add in Vercel Dashboard

Share the link with users and test all 3 roles! 🎉
