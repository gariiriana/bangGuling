import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDriverOrders, updateOrderStatus } from '../hooks/useOrders';
import { useLocationTracker } from '../hooks/useLocationTracker';
import { Package, MapPin, CheckCircle2, Navigation, DollarSign, Activity, Power } from 'lucide-react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Component to display real-time customer info
function CustomerInfo({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    if (!customerId) return;

    const unsub = onSnapshot(doc(db, 'users', customerId), (doc) => {
      if (doc.exists()) {
        setCustomer(doc.data());
      }
    });

    return () => unsub();
  }, [customerId]);

  if (!customer) return <span className="text-xs text-gray-500">Loading customer...</span>;

  return (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-golden-200">
      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        {customer.photoURL ? (
          <img src={customer.photoURL} alt={customer.displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-800">{customer.displayName || 'Pelanggan'}</div>
        <div className="text-[10px] text-gray-500">{customer.phone || '-'}</div>
      </div>
    </div>
  );
}

export function DriverDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(user?.isActive || false);
  const { orders, loading } = useDriverOrders(user?.uid, isOnline);
  const [selectedTab, setSelectedTab] = useState<'available' | 'ongoing' | 'completed'>('available');
  const [processing, setProcessing] = useState<string | null>(null);

  // Initialize location tracking
  const { error: locationError } = useLocationTracker(user?.uid, isOnline);

  const toggleOnlineStatus = async () => {
    if (!user) return;
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isActive: newStatus
      });
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  // Filter orders for driver
  const availableOrders = orders.filter((o) => o.status === 'paid' || o.status === 'processing');
  const ongoingOrders = orders.filter((o) =>
    ['pesanan_dibuat', 'driver_tiba_di_restoran', 'pesanan_diambil_driver', 'otw_menuju_lokasi', 'on-delivery'].includes(o.status)
    && o.driverId === user?.uid
  );
  const completedOrders = orders.filter((o) => (o.status === 'delivered' || o.status === 'pesanan_selesai') && o.driverId === user?.uid);

  // Calculate today's earnings
  const todayEarnings = completedOrders.reduce((sum, order) => sum + (order.total * 0.1), 0); // 10% commission

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateStatus = async (orderId: string, status: any, photo?: string) => {
    if (!user) return;
    setProcessing(orderId);
    await updateOrderStatus(orderId, status, user.uid, photo);
    setProcessing(null);
    if (status === 'pesanan_dibuat') setSelectedTab('ongoing');
    if (status === 'pesanan_selesai') setSelectedTab('completed');
  };

  const capturePhotoMock = () => {
    // Return a dummy base64 string to simulate photo capture
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  };

  const getOrdersByTab = () => {
    switch (selectedTab) {
      case 'available':
        return availableOrders;
      case 'ongoing':
        return ongoingOrders;
      case 'completed':
        return completedOrders;
      default:
        return [];
    }
  };

  const displayOrders = getOrdersByTab();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-golden-600 via-black-700 to-black-800 text-white">
        <div className="max-w-screen-sm mx-auto px-4 pt-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Driver</h1>
              <p className="text-golden-200 text-sm">Kelola pengiriman Anda</p>
            </div>
            <button
              onClick={toggleOnlineStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-lg ${isOnline
                ? 'bg-green-500 text-white animate-pulse'
                : 'bg-gray-600 text-gray-300'
                }`}
            >
              <Power className="w-4 h-4" />
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>

          {locationError && (
            <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-2 flex items-center gap-2 text-xs">
              <Activity className="w-4 h-4 text-red-500" />
              <span>Gagal mendapatkan lokasi: {locationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-screen-sm mx-auto px-4 -mt-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-xl p-3 shadow-md">
            <div className="text-xl font-bold text-golden-600">{availableOrders.length}</div>
            <div className="text-[10px] text-gray-600 mt-1">Tersedia</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md">
            <div className="text-xl font-bold text-blue-600">{ongoingOrders.length}</div>
            <div className="text-[10px] text-gray-600 mt-1">Diantar</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md">
            <div className="text-xl font-bold text-green-600">{completedOrders.length}</div>
            <div className="text-[10px] text-gray-600 mt-1">Selesai</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md">
            <DollarSign className="w-4 h-4 text-green-600 mb-1" />
            <div className="text-[9px] font-semibold text-green-600">{formatPrice(todayEarnings)}</div>
            <div className="text-[8px] text-gray-500">Hari Ini</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-screen-sm mx-auto px-4 mb-4">
        <div className="bg-white rounded-xl p-1 flex gap-1 shadow-sm">
          <button
            onClick={() => setSelectedTab('available')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${selectedTab === 'available'
              ? 'bg-golden-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Tersedia ({availableOrders.length})
          </button>
          <button
            onClick={() => setSelectedTab('ongoing')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${selectedTab === 'ongoing'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Diantar ({ongoingOrders.length})
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${selectedTab === 'completed'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            Selesai ({completedOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-screen-sm mx-auto px-4 pb-4">
        {displayOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {selectedTab === 'available' && 'Tidak ada pesanan tersedia'}
              {selectedTab === 'ongoing' && 'Tidak ada pesanan sedang diantar'}
              {selectedTab === 'completed' && 'Belum ada pesanan selesai hari ini'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {displayOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                {/* Header: ID, Status, Price */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">#{order.id.substring(0, 8)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.date || new Date().toISOString()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {order.items.length} Barang
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-golden-600 text-sm">{formatPrice(order.total)}</div>
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize mt-1 ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                        order.status === 'pesanan_dibuat' ? 'bg-blue-100 text-blue-700' :
                          (order.status === 'delivered' || order.status === 'pesanan_selesai') ? 'bg-gray-100 text-gray-600' :
                            'bg-golden-50 text-golden-700'
                      }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Location (Compact) */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600 line-clamp-1">{order.deliveryAddress}</p>
                </div>

                {/* Customer Info (Compact) */}
                {order.customerId && (
                  <div className="mb-3 pl-5 border-l-2 border-golden-100">
                    <CustomerInfo customerId={order.customerId} />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-3">
                  {selectedTab === 'available' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'pesanan_dibuat')}
                      disabled={processing === order.id}
                      className="w-full bg-golden-600 hover:bg-golden-700 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                    >
                      {processing === order.id ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <CheckCircle2 className="w-4 h-4" />}
                      AMBIL PESANAN
                    </button>
                  )}

                  {selectedTab === 'ongoing' && (
                    <div className="grid grid-cols-1 gap-2">
                      {/* Contextual Action Button based on Status */}
                      {order.status === 'pesanan_dibuat' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'driver_tiba_di_restoran')}
                          disabled={processing === order.id}
                          className="w-full bg-golden-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        >
                          TIBA DI RESTORAN
                        </button>
                      )}
                      {order.status === 'driver_tiba_di_restoran' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'pesanan_diambil_driver')}
                          disabled={processing === order.id}
                          className="w-full bg-golden-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        >
                          PESANAN DIAMBIL
                        </button>
                      )}
                      {order.status === 'pesanan_diambil_driver' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'otw_menuju_lokasi')}
                          disabled={processing === order.id}
                          className="w-full bg-golden-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        >
                          OTW KE LOKASI
                        </button>
                      )}
                      {order.status === 'otw_menuju_lokasi' && (
                        <button
                          onClick={() => {
                            const photo = capturePhotoMock();
                            handleUpdateStatus(order.id, 'pesanan_selesai', photo);
                          }}
                          disabled={processing === order.id}
                          className="w-full bg-golden-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        >
                          SELESAIKAN PESANAN
                        </button>
                      )}

                      <button
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.deliveryAddress)}`, '_blank')}
                        className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-golden-700 bg-golden-50 py-2 rounded-lg border border-golden-100"
                      >
                        <Navigation className="w-3 h-3" />
                        Arahkan GPS
                      </button>
                    </div>
                  )}

                  {selectedTab === 'completed' && (
                    <div className="flex items-center gap-2 text-green-600 text-xs font-medium bg-green-50 p-2 rounded-lg border border-green-100">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai pada {order.completedAt ? new Date(order.completedAt.toDate()).toLocaleTimeString('id-ID') : '-'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
