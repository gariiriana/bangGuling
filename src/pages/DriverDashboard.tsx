import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDriverOrders, updateOrderStatus } from '../hooks/useOrders';
import { useLocationTracker } from '../hooks/useLocationTracker';
import { Package, MapPin, CheckCircle2, Navigation, DollarSign, Activity, Power } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function DriverDashboard() {
  const { user } = useAuth();
  const { orders, loading } = useDriverOrders(user?.uid);
  console.log('DEBUG: Driver Orders:', orders);
  console.log('DEBUG: User UID:', user?.uid);
  const [selectedTab, setSelectedTab] = useState<'available' | 'ongoing' | 'completed'>('available');
  const [processing, setProcessing] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(user?.isActive || false);

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
  const availableOrders = orders.filter((o) => o.status === 'processing');
  const ongoingOrders = orders.filter((o) => o.status === 'on-delivery' && o.driverId === user?.uid);
  const completedOrders = orders.filter((o) => o.status === 'delivered' && o.driverId === user?.uid);

  // Calculate today's earnings
  const todayEarnings = completedOrders.reduce((sum, order) => sum + (order.total * 0.1), 0); // 10% commission

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAcceptOrder = async (orderId: string) => {
    if (!user) return;
    setProcessing(orderId);
    await updateOrderStatus(orderId, 'on-delivery', user.uid);
    setProcessing(null);
    setSelectedTab('ongoing');
  };

  const handleCompleteOrder = async (orderId: string) => {
    setProcessing(orderId);
    await updateOrderStatus(orderId, 'delivered');
    setProcessing(null);
    setSelectedTab('completed');
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
      <div className="max-w-screen-sm mx-auto px-4 space-y-3">
        {displayOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {selectedTab === 'available' && 'Tidak ada pesanan tersedia'}
              {selectedTab === 'ongoing' && 'Tidak ada pesanan sedang diantar'}
              {selectedTab === 'completed' && 'Belum ada pesanan selesai hari ini'}
            </p>
          </div>
        ) : (
          displayOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-golden-50 to-golden-100 p-3 border-b border-golden-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-golden-600" />
                    <span className="font-semibold text-sm text-gray-900">{order.id.substring(0, 12)}...</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {order.placedAt?.toDate().toLocaleDateString('id-ID')}
                  </div>
                </div>
                <div className="text-lg font-bold text-golden-600">
                  {formatPrice(order.total)}
                </div>
                <div className="text-xs text-green-600 font-medium mt-1">
                  Komisi: {formatPrice(order.total * 0.1)}
                </div>
              </div>

              {/* Order Details */}
              <div className="p-3 space-y-2">
                {/* Items */}
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">Pesanan:</div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-golden-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-500 mb-0.5">Alamat Pengiriman:</div>
                    <div className="text-xs text-gray-900">{order.deliveryAddress}</div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-medium">Pembayaran:</span>
                  <span>{order.paymentMethod}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-gray-50 border-t">
                {selectedTab === 'available' && (
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    disabled={processing === order.id}
                    className="w-full bg-gradient-to-r from-golden-600 to-golden-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {processing === order.id ? 'Memproses...' : 'Terima Pesanan'}
                  </button>
                )}
                {selectedTab === 'ongoing' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`, '_blank')}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Buka Navigasi GPS
                    </button>
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={processing === order.id}
                      className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {processing === order.id ? 'Memproses...' : 'Selesaikan Pengiriman'}
                    </button>
                  </div>
                )}
                {selectedTab === 'completed' && (
                  <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium text-sm">Pengiriman Selesai</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
