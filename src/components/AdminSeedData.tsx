import { useState } from 'react';
import { seedProducts } from '../scripts/seedProducts';

// Simple component to trigger seed
export function AdminSeedData() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleSeed = async () => {
        setLoading(true);
        setResult('');

        const res = await seedProducts();

        if (res.success) {
            setResult('✅ Products seeded successfully!');
        } else {
            setResult('❌ Error seeding products. Check console.');
        }

        setLoading(false);
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Seed Database</h2>
            <button
                onClick={handleSeed}
                disabled={loading}
                className="bg-golden-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-golden-700 disabled:opacity-50"
            >
                {loading ? 'Seeding...' : 'Seed Products'}
            </button>
            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                    {result}
                </div>
            )}
        </div>
    );
}
