import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    doc,
    addDoc,
    updateDoc,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, CartItem } from '../types';

// Get user's orders
export function useOrders(userId: string | undefined) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'orders'),
            where('customerId', '==', userId),
            orderBy('placedAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const ordersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().placedAt?.toDate().toISOString() || new Date().toISOString()
                })) as Order[];
                setOrders(ordersData);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    return { orders, loading, error };
}

// Get single order with real-time updates
export function useOrder(orderId: string | undefined) {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'orders', orderId);

        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setOrder({
                        id: snapshot.id,
                        ...data,
                        date: data.placedAt?.toDate().toISOString() || new Date().toISOString()
                    } as Order);
                } else {
                    setOrder(null);
                }
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [orderId]);

    return { order, loading, error };
}

// Get orders for driver (status: processing or on-delivery)
export function useDriverOrders(driverId: string | undefined, isOnline: boolean) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!driverId || !isOnline) {
            setOrders([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'orders'),
            where('status', 'in', [
                'pending',
                'paid',
                'processing',
                'pesanan_dibuat',
                'driver_tiba_di_restoran',
                'pesanan_diambil_driver',
                'otw_menuju_lokasi',
                'on-delivery',
                'delivered',
                'pesanan_selesai'
            ]),
            orderBy('placedAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const ordersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().placedAt?.toDate().toISOString() || new Date().toISOString()
                })) as Order[];
                setOrders(ordersData);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [driverId, isOnline]);

    return { orders, loading, error };
}

// Get all orders for owner
export function useOwnerOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(
            collection(db, 'orders'),
            orderBy('placedAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const ordersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().placedAt?.toDate().toISOString() || new Date().toISOString()
                })) as Order[];
                setOrders(ordersData);
                setLoading(false);
            },
            (err) => {
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { orders, loading, error };
}

// Create new order
export async function createOrder(
    customerId: string,
    items: CartItem[],
    total: number,
    deliveryAddress: string,
    paymentMethod: string
) {
    try {
        const orderData = {
            customerId,
            items,
            total,
            deliveryAddress,
            paymentMethod,
            status: 'pending',
            placedAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        return { success: true, orderId: docRef.id };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error };
    }
}

// Update order status
export async function updateOrderStatus(
    orderId: string,
    status: Order['status'],
    driverId?: string,
    photoData?: string // B64 encoded photo
) {
    try {
        const docRef = doc(db, 'orders', orderId);
        const updateData: any = { status };

        if (status === 'paid') {
            updateData.paidAt = Timestamp.now();
        } else if (status === 'pesanan_dibuat' && driverId) {
            updateData.driverId = driverId;
            updateData.confirmedAt = Timestamp.now();
        } else if (status === 'driver_tiba_di_restoran') {
            updateData.arrivedAtRestoAt = Timestamp.now();
        } else if (status === 'pesanan_diambil_driver') {
            updateData.pickedUpAt = Timestamp.now();
        } else if (status === 'otw_menuju_lokasi') {
            updateData.onTheWayAt = Timestamp.now();
        } else if (status === 'pesanan_selesai') {
            updateData.completedAt = Timestamp.now();
            updateData.deliveredAt = Timestamp.now();
            if (photoData) {
                updateData.completionPhoto = photoData;
            }
        } else if (status === 'processing' && driverId) {
            updateData.driverId = driverId;
            updateData.confirmedAt = Timestamp.now();
        } else if (status === 'on-delivery') {
            updateData.pickedUpAt = Timestamp.now();
        } else if (status === 'delivered') {
            updateData.deliveredAt = Timestamp.now();
        } else if (status === 'cancelled') {
            updateData.cancelledAt = Timestamp.now();
        }

        await updateDoc(docRef, updateData);
        return { success: true };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error };
    }
}
