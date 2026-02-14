import { collection, getDocs, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNotification } from '../context/NotificationContext';
import { products } from '../data';
import { useState } from 'react';
import { Order, DriverApplication, Product } from '../types';

export function useDataManagement() {
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const clearAllData = async () => {
        setLoading(true);
        try {
            const batch = writeBatch(db);

            // 1. Clear Orders
            const ordersSnap = await getDocs(collection(db, 'orders'));
            ordersSnap.forEach((d) => batch.delete(d.ref));

            // 2. Clear Applications
            const appsSnap = await getDocs(collection(db, 'driverApplications'));
            appsSnap.forEach((d) => batch.delete(d.ref));

            // 3. Clear Products
            const productsSnap = await getDocs(collection(db, 'products'));
            productsSnap.forEach((d) => batch.delete(d.ref));

            await batch.commit();
            showNotification('Semua data berhasil dihapus!', 'success');
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            showNotification('Gagal menghapus data', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const generateDummyData = async () => {
        setLoading(true);
        try {
            const batch = writeBatch(db);

            // 1. Seed Products
            for (const product of products) {
                const productRef = doc(db, 'products', product.id);
                batch.set(productRef, {
                    ...product,
                    isActive: true,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });
            }

            // 2. Seed Mock Driver Applications
            const mockApps: Partial<DriverApplication>[] = [
                {
                    id: 'app_1',
                    fullName: 'Budi Santoso',
                    email: 'budi@example.com',
                    phone: '08123456789',
                    dateOfBirth: '1990-05-15',
                    address: 'Jl. Melati No. 12, Jakarta',
                    ktpNumber: '3171234567890001',
                    simNumber: '123456789012',
                    vehicleType: 'motor',
                    vehicleBrand: 'Honda Vario',
                    vehicleYear: 2022,
                    platNumber: 'B 1234 ABC',
                    status: 'pending_review',
                    currentStage: 1,
                    submittedAt: Timestamp.now(),
                },
                {
                    id: 'app_2',
                    fullName: 'Siti Aminah',
                    email: 'siti@example.com',
                    phone: '08771234567',
                    dateOfBirth: '1995-10-20',
                    address: 'Jl. Mawar No. 5, Jakarta',
                    ktpNumber: '3171234567890002',
                    simNumber: '987654321098',
                    vehicleType: 'motor',
                    vehicleBrand: 'Yamaha NMAX',
                    vehicleYear: 2023,
                    platNumber: 'B 5678 DEF',
                    status: 'interview_scheduled',
                    currentStage: 2,
                    submittedAt: Timestamp.now(),
                }
            ];

            for (const app of mockApps) {
                const appRef = doc(db, 'driverApplications', app.id!);
                batch.set(appRef, { ...app, submittedAt: Timestamp.now() });
            }

            // 3. Seed Mock Orders (Integrated with products)
            const mockOrders: Partial<Order>[] = [
                {
                    id: 'order_1',
                    customerId: 'dummy_customer_1',
                    status: 'pending',
                    items: [
                        { ...products[0], quantity: 2 },
                        { ...products[1], quantity: 1 }
                    ],
                    total: (products[0].price * 2) + products[1].price,
                    deliveryAddress: 'Gedung Cyber, Kuningan, Jakarta',
                    paymentMethod: 'Midtrans',
                    placedAt: Timestamp.now(),
                },
                {
                    id: 'order_2',
                    customerId: 'dummy_customer_2',
                    status: 'delivered',
                    items: [
                        { ...products[2], quantity: 3 }
                    ],
                    total: products[2].price * 3,
                    deliveryAddress: 'Apartemen Sudirman Park, Jakarta',
                    paymentMethod: 'OVO',
                    placedAt: Timestamp.now(),
                    deliveredAt: Timestamp.now(),
                }
            ];

            for (const order of mockOrders) {
                const orderRef = doc(db, 'orders', order.id!);
                batch.set(orderRef, order);
            }

            await batch.commit();
            showNotification('Data dummy terintegrasi berhasil dibuat!', 'success');
            return true;
        } catch (error) {
            console.error('Error generating dummy data:', error);
            showNotification('Gagal membuat data dummy', 'error');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        clearAllData,
        generateDummyData
    };
}
