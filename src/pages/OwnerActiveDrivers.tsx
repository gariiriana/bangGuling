import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';
import { Truck, MapPin, Search, Activity, Clock } from 'lucide-react';
import { OwnerSidebar } from '../components/OwnerSidebar';
import { OwnerHeader } from '../components/OwnerHeader';

export function OwnerActiveDrivers() {
    const [activeDrivers, setActiveDrivers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const q = query(
            collection(db, 'users'),
            where('role', '==', 'driver'),
            where('isActive', '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const drivers = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            })) as User[];
            setActiveDrivers(drivers);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredDrivers = activeDrivers.filter(d =>
        d.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <OwnerSidebar />
            <div className="flex-1 flex flex-col">
                <OwnerHeader title="Monitoring Gerobak" subtitle="Pantau lokasi driver secara real-time" />

                <main className="flex-1 p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Monitoring Gerobak Aktif</h1>
                                <p className="text-gray-500 mt-1">Pantau lokasi dan status mitra driver secara real-time</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-green-200">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    {activeDrivers.length} Gerobak Online
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Drivers List */}
                            <div className="lg:col-span-1 border border-golden-100 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col h-[700px]">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari driver..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-600 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                    {loading ? (
                                        <div className="p-8 text-center text-gray-400 italic">Memuat data driver...</div>
                                    ) : filteredDrivers.length === 0 ? (
                                        <div className="p-8 text-center text-gray-400 italic">Tidak ada gerobak aktif saat ini</div>
                                    ) : (
                                        filteredDrivers.map(driver => (
                                            <div
                                                key={driver.uid}
                                                className="p-4 rounded-xl border border-gray-100 hover:border-golden-200 hover:bg-golden-50 transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-golden-100 rounded-full flex items-center justify-center text-golden-700 flex-shrink-0">
                                                        <Truck className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-gray-900 truncate">{driver.displayName}</div>
                                                        <div className="text-xs text-gray-500 mb-2 truncate">{driver.email}</div>
                                                        <div className="flex items-center gap-2 text-[10px]">
                                                            {driver.location ? (
                                                                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                                                                    <MapPin className="w-3 h-3" />
                                                                    Terlacak
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full font-medium">
                                                                    <Activity className="w-3 h-3" />
                                                                    Lokasi Belum Ada
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1 text-gray-500">
                                                                <Clock className="w-3 h-3" />
                                                                {driver.lastActive ? 'Aktif' : 'Baru'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Map Interface (Mock) */}
                            <div className="lg:col-span-2 bg-gray-100 border border-golden-100 rounded-2xl shadow-sm overflow-hidden relative min-h-[500px]">
                                <div className="absolute inset-0 bg-slate-200 overflow-hidden flex items-center justify-center">
                                    {/* Mock Map Background */}
                                    <div className="absolute inset-0 opacity-20 grayscale" style={{
                                        backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)',
                                        backgroundSize: '20px 20px'
                                    }}></div>

                                    {/* Mock Map Points */}
                                    {filteredDrivers.map((driver, idx) => (
                                        driver.location && (
                                            <div
                                                key={driver.uid}
                                                className="absolute group"
                                                style={{
                                                    left: `${30 + (idx * 15) % 60}%`,
                                                    top: `${20 + (idx * 12) % 70}%`
                                                }}
                                            >
                                                <div className="relative">
                                                    {/* Label Container */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none">
                                                            {driver.displayName}
                                                        </div>
                                                        <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1"></div>
                                                    </div>

                                                    {/* Pulsing Dot */}
                                                    <div className="w-8 h-8 flex items-center justify-center">
                                                        <div className="absolute inset-0 bg-golden-400 rounded-full animate-ping opacity-25"></div>
                                                        <div className="relative bg-golden-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                                                            <Truck className="w-3 h-3" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}

                                    {/* Empty State / Legend */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-md border border-golden-100">
                                        <h3 className="text-xs font-bold text-gray-900 mb-2">Legenda</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-golden-600 rounded-full border border-white"></div>
                                                <span className="text-[10px] text-gray-600">Gerobak Online</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full"></div>
                                                <span className="text-[10px] text-gray-600">Off-duty / Tertutup</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="z-0 text-gray-400 text-sm font-medium flex flex-col items-center">
                                        <MapPin className="w-12 h-12 mb-2 opacity-20" />
                                        Peta Interaktif (Mock)
                                        <p className="text-[10px] mt-1 opacity-60 max-w-[200px] text-center italic">
                                            Integrasi Google/MapLibre Maps diperlukan untuk detail jalan yang akurat
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
