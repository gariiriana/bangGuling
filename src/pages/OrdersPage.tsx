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
          text: 'Menunggu Konfirmasi',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          icon: Clock,
        };
      case 'processing':
        return {
          text: 'Sedang Diproses',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          icon: Package,
        };
      case 'on-delivery':
        return {
          text: 'Dalam Pengiriman',
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          icon: Truck,
        };
      case 'delivered':
        return {
          text: 'Selesai',
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          icon: CheckCircle2,
        };
      default:
        return {
          text: 'Dibatalkan',
          color: 'text-red-600',
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
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm cursor-pointer active:scale-98 transition-transform"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      {order.date} • #{order.id}
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.bg}`}
                    >
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                      <span className={`text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-amber-600">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-xs text-gray-500 pl-15">
                        +{order.items.length - 2} item lainnya
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-gray-600">Total Belanja</div>
                    <div className="font-semibold">{formatPrice(order.total)}</div>
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
