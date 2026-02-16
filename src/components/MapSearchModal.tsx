import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Banknote } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, User } from '../types';

// Character asset for driver
import driverCharImg from '../assets/driver_character.png';

interface MapSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice?: number;
    orderId?: string;
}

export function MapSearchModal({ isOpen, onClose, totalPrice = 0, orderId }: MapSearchModalProps) {
    const navigate = useNavigate();
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const driverMarkerRef = useRef<L.Marker | null>(null);
    const [driverData, setDriverData] = useState<User | null>(null);
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Coordinates for the center (mock user location)
    const userLocation: [number, number] = [-6.2088, 106.8456]; // Jakarta center

    const nearbyDriverMarkersRef = useRef<L.Marker[]>([]);

    useEffect(() => {
        if (!isOpen || !orderId) return;

        let unsubOrder: () => void;
        let unsubDriver: () => void;

        const initMap = () => {
            if (!mapRef.current || mapInstanceRef.current) return;

            if (mapRef.current.clientHeight === 0) {
                const timer = setTimeout(() => setRetryCount(prev => prev + 1), 100);
                return () => clearTimeout(timer);
            }

            const leafletMap = L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: true
            }).setView(userLocation, 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(leafletMap);

            // Radar Pulse
            const radarIcon = L.divIcon({
                className: 'radar-container',
                html: '<div class="radar-ripple"></div><div class="radar-ripple" style="animation-delay: 1.5s"></div>',
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            });
            L.marker(userLocation, { icon: radarIcon }).addTo(leafletMap);

            // User Icon
            const userIcon = L.divIcon({
                className: 'custom-user-icon',
                html: '<div class="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg ring-4 ring-yellow-400/50 animate-pulse"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            L.marker(userLocation, { icon: userIcon }).addTo(leafletMap);

            // --- FAKE NEARBY DRIVERS ---
            // Create 3 fake drivers
            const fakeDriversStartPos = [
                [userLocation[0] + 0.002, userLocation[1] + 0.002],
                [userLocation[0] - 0.002, userLocation[1] + 0.003],
                [userLocation[0] + 0.001, userLocation[1] - 0.002],
            ];

            fakeDriversStartPos.forEach((pos) => {
                const icon = L.icon({
                    iconUrl: driverCharImg,
                    iconSize: [35, 35], // Slightly smaller than real driver
                    iconAnchor: [17, 17],
                    className: 'nearby-driver-icon opacity-80 transition-all duration-1000 ease-in-out' // CSS transition class
                });
                const marker = L.marker(pos as [number, number], { icon }).addTo(leafletMap);
                nearbyDriverMarkersRef.current.push(marker);
            });

            // Animate fake drivers
            const animateDrivers = () => {
                nearbyDriverMarkersRef.current.forEach(marker => {
                    const currentLatLng = marker.getLatLng();
                    // Move slightly randomly
                    const moveLat = (Math.random() - 0.5) * 0.0002;
                    const moveLng = (Math.random() - 0.5) * 0.0002;

                    marker.setLatLng([currentLatLng.lat + moveLat, currentLatLng.lng + moveLng]);
                });
            };

            const intervalId = setInterval(animateDrivers, 2000); // Move every 2 seconds

            mapInstanceRef.current = leafletMap;

            // Subscribe to Order (Real Driver Logic)
            unsubOrder = onSnapshot(doc(db, 'orders', orderId), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.data() as Order;
                    setOrderData(data);

                    // If REAL driver is assigned, subscribe to driver
                    if (data.driverId) {
                        if (unsubDriver) unsubDriver();
                        unsubDriver = onSnapshot(doc(db, 'users', data.driverId), (driverSnap) => {
                            if (driverSnap.exists()) {
                                const dData = driverSnap.data() as User;
                                setDriverData(dData);

                                if (dData.location) {
                                    const { lat, lng } = dData.location;

                                    if (!driverMarkerRef.current && mapInstanceRef.current) {
                                        const icon = L.icon({
                                            iconUrl: driverCharImg,
                                            iconSize: [50, 50], // Bigger real driver
                                            iconAnchor: [25, 25],
                                            className: 'drop-shadow-2xl z-[1000]'
                                        });
                                        driverMarkerRef.current = L.marker([lat, lng], { icon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current);
                                    } else if (driverMarkerRef.current) {
                                        driverMarkerRef.current.setLatLng([lat, lng]);
                                    }
                                }
                            }
                        });
                    }
                }
            });

            [100, 400, 800].forEach(delay => setTimeout(() => mapInstanceRef.current?.invalidateSize(), delay));

            return () => clearInterval(intervalId);
        };

        const cleanup = initMap();

        return () => {
            if (cleanup) cleanup();
            if (unsubOrder) unsubOrder();
            if (unsubDriver) unsubDriver();
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                driverMarkerRef.current = null;
                nearbyDriverMarkersRef.current = [];
            }
        };
    }, [isOpen, orderId, retryCount]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/40 flex justify-center items-center backdrop-blur-sm animate-fade-in px-0 sm:px-4">
            <div className="bg-white w-full max-w-screen-sm h-full sm:h-[90vh] sm:rounded-3xl flex flex-col overflow-hidden relative shadow-2xl [isolation:isolate]">
                {/* Map Area */}
                <div className="relative w-full flex-1 overflow-hidden">

                    <div
                        ref={mapRef}
                        className="absolute inset-0 z-0 bg-gray-100"
                    />
                </div>

                {/* Details Section on Bottom - Compact Bottom Sheet */}
                <div className="flex-none bg-white relative z-20 border-t border-gray-100 pb-10 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
                    {/* Drag Handle Style */}
                    <div className="flex justify-center py-4">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </div>

                    <div className="px-6">
                        {/* Driver Detail Card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 mb-4 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 relative flex-shrink-0 bg-golden-50 rounded-2xl p-2">
                                <img src={driverCharImg} alt="Driver" className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                            <div className="flex-1">
                                {driverData ? (
                                    <>
                                        <h4 className="text-[15px] font-bold text-gray-900 leading-tight">{driverData.displayName}</h4>
                                        <p className="text-[13px] text-gray-500 mt-0.5">{driverData.vehiclePlate || 'B 1234 ABC'} • Honda Vario</p>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="text-[15px] font-bold text-gray-900 leading-tight">Mencari driver terdekat...</h4>
                                        <p className="text-[13px] text-gray-500 mt-0.5">Sabar ya, lagi disiapin</p>
                                    </>
                                )}
                            </div>
                            {driverData?.phone && (
                                <button
                                    onClick={() => window.open(`tel:${driverData.phone}`)}
                                    className="p-3 bg-green-50 text-green-600 rounded-2xl active:scale-90 transition-all"
                                >
                                    <Navigation className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Status Pulse Banner */}
                        {orderData?.status && (
                            <div className="flex items-center gap-2 mb-4 px-2">
                                <div className="w-2 h-2 bg-golden-600 rounded-full animate-ping" />
                                <span className="text-[11px] font-black uppercase text-golden-700 tracking-wider">
                                    {orderData.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        )}

                        {/* Payment Info Card */}
                        <div className="bg-white border border-gray-100 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-600 px-2 py-0.5 rounded flex items-center justify-center">
                                    <span className="text-[10px] font-black text-white italic">VISA</span>
                                </div>
                                <span className="text-sm font-bold text-gray-400">•• 2468</span>
                                <Navigation className="w-3 h-3 text-gray-300 rotate-90" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Banknote className="w-5 h-5 text-green-500" />
                                <span className="text-base font-black text-gray-900">{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                        {/* FOOLPROOF NAVIGATION BUTTON - BOLD GOLDEN BUTTON */}
                        <div className="mt-6 mb-2">
                            <button
                                onClick={() => navigate('/orders')}
                                className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black rounded-2xl shadow-[0_8px_30px_rgba(234,179,8,0.3)] active:scale-95 transition-all text-[15px] flex items-center justify-center uppercase tracking-tight border-2 border-yellow-500/20"
                            >
                                KEMBALI KE PESANAN
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes radar-ripple {
                    0% { transform: scale(0.1); opacity: 0.8; }
                    100% { transform: scale(3.5); opacity: 0; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .custom-user-icon {
                    overflow: visible !important;
                }
                .radar-container {
                    overflow: visible !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                .radar-ripple {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border: 2px solid #EAB308;
                    background: rgba(234, 179, 8, 0.15);
                    border-radius: 50%;
                    animation: radar-ripple 3s cubic-bezier(0, 0.2, 0.8, 1) infinite;
                    pointer-events: none;
                }
                /* Leaflet UI Cleanup */
                .leaflet-control-zoom { display: none !important; }
                .leaflet-control-attribution { font-size: 8px !important; opacity: 0.5; }
            `}} />
        </div>
    );
}
