import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, getDoc, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

// Get all active products
export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, 'products'),
            where('isActive', '==', true)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const productsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(productsData);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { products, loading, error };
}

// Get products by category
export function useProductsByCategory(category: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, 'products'),
            where('isActive', '==', true),
            where('category', '==', category)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const productsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(productsData);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [category]);

    return { products, loading, error };
}

// Get single product
export function useProduct(productId: string | undefined) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'products', productId);

        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setProduct({ id: snapshot.id, ...snapshot.data() } as Product);
                } else {
                    setProduct(null);
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [productId]);

    return { product, loading, error };
}
