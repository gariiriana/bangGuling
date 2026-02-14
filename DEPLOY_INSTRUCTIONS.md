# 🚀 Deployment Instructions - Bang Guling

## 1. Deploy Firestore Security Rules ⚡

### Cara Deploy:

#### Option A: Firebase Console (Recommended - Mudah)
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project **test-eultra**
3. Klik **Firestore Database** di menu kiri
4. Klik tab **Rules** di bagian atas
5. **Copy semua isi file `firestore.rules`** yang sudah dibuat
6. **Paste** ke editor rules di Firebase Console
7. Klik **Publish** di kanan atas

#### Option B: Firebase CLI (Advanced)
```bash
# Install Firebase CLI jika belum
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (pilih Firestore)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### ✅ Verify Rules Berhasil:
Setelah deploy, coba:
1. Logout dari aplikasi
2. Coba browse products → **Harus bisa** (public read)
3. Coba create order tanpa login → **Harus error** (need auth)
4. Login sebagai customer → **Harus bisa** create order

---

## 2. Seed Products ke Firestore 📦

**⚠️ PENTING:** Database masih kosong, perlu di-populate dengan product data!

### Cara 1: Manual via Firebase Console
1. Buka Firebase Console → Firestore Database
2. Klik **Start collection**
3. Collection ID: `products`
4. Add documents dari `src/data.ts`:

**Product 1:**
```json
{
  "id": "1",
  "name": "Gule Kambing + Nasi Putih",
  "description": "Gule kambing spesial dengan bumbu rempah tradisional",
  "price": 10000,
  "category": "Makanan Utama",
  "image": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400",
  "rating": 4.9,
  "reviews": 856,
  "servings": "1 porsi",
  "isActive": true
}
```

**Product 2:**
```json
{
  "id": "2",
  "name": "Sate Kambing",
  "description": "Sate kambing empuk dengan bumbu kacang spesial",
  "price": 15000,
  "category": "Makanan Utama",
  "image": "https://images.unsplash.com/photo-1588347818036-4c0b5e8a8c3e?w=400",
  "rating": 4.8,
  "reviews": 642,
  "servings": "5 tusuk",
  "isActive": true
}
```

**Product 3:**
```json
{
  "id": "3",
  "name": "Sop Kambing",
  "description": "Sop kambing segar dengan kuah bening yang hangat",
  "price": 12000,
  "category": "Makanan Utama",
  "image": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400",
  "rating": 4.7,
  "reviews": 523,
  "servings": "1 mangkok",
  "isActive": true
}
```

Lanjutkan untuk semua products di `src/data.ts`

### Cara 2: Via Script (Automated) - RECOMMENDED
Gunakan seed script yang sudah dibuat:

```typescript
// Di browser console saat logged in as owner
import { seedProducts } from './src/scripts/seedProducts';
seedProducts();
```

Atau buat admin page khusus dengan button "Seed Database"

---

## 3. Testing Checklist ✅

### Test Customer Flow:
- [ ] Register account dengan role Customer
- [ ] Login berhasil
- [ ] Browse products (harus ada data dari Firestore)
- [ ] Add to cart
- [ ] Checkout berhasil
- [ ] View order tracking
- [ ] Lihat status pesanan real-time

### Test Driver Flow:
- [ ] Register account dengan role Driver
- [ ] Login berhasil
- [ ] Lihat available orders di tab "Tersedia"
- [ ] Accept order → pindah ke tab "Diantar"
- [ ] Klik "Buka Navigasi GPS" → Google Maps terbuka
- [ ] Complete delivery → pindah ke tab "Selesai"
- [ ] Check earnings di dashboard

### Test Owner Flow:
- [ ] Register account dengan role Owner
- [ ] Login berhasil
- [ ] Dashboard menampilkan stats: total omzet, orders, dll
- [ ] Charts menampilkan data
- [ ] View all orders dari semua customer

---

## 4. Production Deployment (Optional)

### Build for Production:
```bash
npm run build
```

### Deploy to Firebase Hosting:
```bash
# Install Firebase tools
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Set Environment Variables:
Pastikan Firebase config di `src/lib/firebase.ts` sudah benar untuk production.

---

## 🎯 Summary

**Must Do Now:**
1. ✅ Copy `firestore.rules` ke Firebase Console → Publish
2. ✅ Seed products ke Firestore (minimal 3-5 products)
3. ✅ Test dengan 3 role: Customer, Driver, Owner

**Application Ready!** 🚀

Setelah 2 langkah diatas, aplikasi langsung bisa digunakan!
