import { Header } from '../components/Header';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Package, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function OrdersPage() {
  const { user } = useAuth();
  const { orders, loading } = useOrders(user?.uid);
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Belum Dibayar',
          color: 'text-zinc-500',
          bg: 'bg-zinc-50',
          icon: Clock,
        };
      case 'paid':
        return {
          text: 'Mencari Driver',
          color: 'text-amber-800',
          bg: 'bg-amber-50',
          icon: Clock,
        };
      case 'pesanan_dibuat':
      case 'driver_tiba_di_restoran':
        return {
          text: 'Driver di Lokasi',
          color: 'text-emerald-800',
          bg: 'bg-emerald-50',
          icon: Package,
        };
      case 'pesanan_diambil_driver':
      case 'otw_menuju_lokasi':
      case 'on-delivery':
        return {
          text: 'Sedang Diantar',
          color: 'text-blue-800',
          bg: 'bg-blue-50',
          icon: Truck,
        };
      case 'pesanan_selesai':
      case 'delivered':
        return {
          text: 'Selesai',
          color: 'text-zinc-800',
          bg: 'bg-zinc-100',
          icon: CheckCircle2,
        };
      default:
        return {
          text: 'Dibatalkan',
          color: 'text-red-800',
          bg: 'bg-red-50',
          icon: Clock,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Pesanan Saya" />

      <div className="max-w-screen-sm mx-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            <p className="text-gray-500">Memuat pesanan Anda...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">Belum Ada Pesanan</h2>
            <p className="text-gray-500 text-center mb-6">
              Pesanan yang kamu buat akan muncul di sini
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Mulai Pesan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const dateObj = order.date ? new Date(order.date) : null;
              const formattedDate = dateObj ? dateObj.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : 'Baru saja';

              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all mb-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600 font-medium">
                      {formattedDate} • #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusInfo.bg}`}
                    >
                      <statusInfo.icon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                      <span className={`text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.quantity} x {formatPrice(item.price)}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500 pl-1">
                        +{order.items.length - 2} item lainnya
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-600">Total Belanja</div>
                    <div className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
