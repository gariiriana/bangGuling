import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { seedProducts } from '../scripts/seedProducts';

/**
 * Background component that automatically ensures database consistency.
 * It checks for legacy image paths and triggers a resync if needed.
 */
export function AutoDataSync() {
    const { user } = useAuth();
    const hasChecked = useRef(false);

    useEffect(() => {
        // Only trigger check for Owners to ensure they have write permissions
        // and only once per app session
        if (user?.role === 'owner' && !hasChecked.current) {
            hasChecked.current = true;
            checkAndSync();
        }
    }, [user]);

    const checkAndSync = async () => {
        try {
            console.log('[AutoDataSync] Checking product data consistency...');
            const q = query(collection(db, 'products'), limit(10));
            const snapshot = await getDocs(q);

            let needsSync = false;

            if (snapshot.empty) {
                console.log('[AutoDataSync] No products found. Seeding initial data...');
                needsSync = true;
            } else {
                const { products } = await import('../data');
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const localProduct = products.find(p => p.id === doc.id);

                    // Check for legacy /src/assets paths
                    if (data.image && typeof data.image === 'string' && data.image.includes('/src/assets/')) {
                        needsSync = true;
                    }

                    // NEW: Check if name or description has changed in data.ts
                    if (localProduct && (data.name !== localProduct.name || data.description !== localProduct.description)) {
                        needsSync = true;
                    }
                });
            }

            if (needsSync) {
                console.log('[AutoDataSync] Legacy data detected. Updating Firestore with stable asset paths...');
                const result = await seedProducts();
                if (result.success) {
                    console.log('[AutoDataSync] Successfully synchronized product catalog.');
                }
            } else {
                console.log('[AutoDataSync] Database is healthy.');
            }
        } catch (error) {
            console.error('[AutoDataSync] Verification failed:', error);
        }
    };

    return null; // Background component, no UI
}
