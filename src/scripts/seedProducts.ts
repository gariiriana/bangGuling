import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { products } from '../data';

// Seed products to Firestore
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

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedProducts().then(() => {
        console.log('Seed complete!');
        process.exit(0);
    });
}
