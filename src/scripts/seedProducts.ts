import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { products } from '../data';

// Seed products to Firestore (Always overwrites existing based on fixed IDs 1, 2, 3)
export async function seedProducts() {
    console.log('🌱 Seeding products to Firestore...');
    try {
        for (const product of products) {
            await setDoc(doc(db, 'products', product.id), {
                ...product,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Added product: ${product.name}`);
        }
        console.log('🎉 All products seeded successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        return { success: false, error };
    }
}

// Seed random dummy orders (Appends new data every time)
export async function seedDummyOrders(count: number = 20, customerEmail: string = 'customer@gmail.com', driverEmail: string = 'driver@gmail.com') {
    console.log(`🌱 Seeding ${count} dummy orders...`);
    console.log(`Target Customer: ${customerEmail}`);
    console.log(`Target Driver: ${driverEmail}`);

    try {
        const statuses = ['pending', 'processing', 'on-delivery', 'delivered'] as const;
        const payments = ['GoPay', 'OVO', 'DANA', 'QRIS', 'Kartu Kredit'];

        const { getDocs, query, where, collection: fsCol } = await import('firebase/firestore');

        // Helper to find user by email
        const findUserByEmail = async (email: string) => {
            if (!email) return null;
            const q = query(fsCol(db, 'users'), where('email', '==', email));
            const snap = await getDocs(q);
            if (!snap.empty) return snap.docs[0].id;
            return null;
        };

        // Resolve UIDs
        const customerId = await findUserByEmail(customerEmail);
        const driverId = await findUserByEmail(driverEmail);

        if (!customerId) console.warn(`⚠️ User ${customerEmail} not found, using dummy ID`);
        if (!driverId) console.warn(`⚠️ User ${driverEmail} not found, using dummy/random ID`);

        // Get all drivers for fallback if specific driver not found
        let drivers: any[] = [];
        if (!driverId) {
            const driverQuery = query(fsCol(db, 'users'), where('role', '==', 'driver'));
            const driverSnapshot = await getDocs(driverQuery);
            drivers = driverSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        }

        for (let i = 0; i < count; i++) {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomPayment = payments[Math.floor(Math.random() * payments.length)];

            // Determine driver for this order
            let assignedDriverId = driverId || (drivers.length > 0 ? drivers[Math.floor(Math.random() * drivers.length)].uid : 'dummy-driver');

            // If status is pending, no driver is assigned yet
            if (randomStatus === 'pending') {
                assignedDriverId = null;
            }

            // Pick 1-2 random products
            const numItems = Math.floor(Math.random() * 2) + 1;
            const orderItems = [];
            let total = 0;

            for (let j = 0; j < numItems; j++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                orderItems.push({
                    ...product,
                    quantity
                });
                total += (product.price * quantity);
            }

            // Create order with random date in last 30 days
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            // Add random time
            date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            const orderData: any = {
                customerId: customerId || `dummy-customer-${Math.floor(Math.random() * 1000)}`,
                status: randomStatus,
                items: orderItems,
                total,
                deliveryAddress: 'Jl. Test Data No. ' + Math.floor(Math.random() * 100),
                paymentMethod: randomPayment,
                placedAt: date,
                createdAt: date,
                updatedAt: date
            };

            // Add driver info if assigned
            if (assignedDriverId) {
                orderData.driverId = assignedDriverId;

                if (randomStatus !== 'pending') {
                    orderData.confirmedAt = date;
                }
                if (['on-delivery', 'delivered'].includes(randomStatus)) {
                    orderData.pickedUpAt = new Date(date.getTime() + 15 * 60000); // +15 mins
                }
                if (randomStatus === 'delivered') {
                    orderData.deliveredAt = new Date(date.getTime() + 45 * 60000); // +45 mins
                }
            }

            await addDoc(collection(db, 'orders'), orderData);
        }

        console.log(`🎉 Successfully added ${count} dummy orders for ${customerEmail} & ${driverEmail}!`);
        return { success: true, count };
    } catch (error) {
        console.error('❌ Error seeding orders:', error);
        return { success: false, error };
    }
}


