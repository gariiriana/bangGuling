import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle2, Package, Truck } from 'lucide-react';
import { useOrder } from '../hooks/useOrders';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useOrder(orderId);

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
          color: 'text-green-600',
          bg: 'bg-green-50',
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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
          <button
            onClick={() => navigate('/')}
            className="text-golden-600 font-medium"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const trackingSteps = [
    {
      label: 'Pesanan Dibuat',
      completed: true,
      time: order.placedAt?.toDate().toLocaleString('id-ID')
    },
    {
      label: 'Pesanan Dikonfirmasi',
      completed: order.status !== 'pending',
      time: order.confirmedAt?.toDate().toLocaleString('id-ID') || ''
    },
    {
      label: 'Sedang Diproses',
      completed: ['processing', 'on-delivery', 'delivered'].includes(order.status),
      time: order.confirmedAt?.toDate().toLocaleString('id-ID') || ''
    },
    {
      label: 'Dalam Pengiriman',
      completed: ['on-delivery', 'delivered'].includes(order.status),
      time: order.pickedUpAt?.toDate().toLocaleString('id-ID') || ''
    },
    {
      label: 'Pesanan Selesai',
      completed: order.status === 'delivered',
      time: order.deliveredAt?.toDate().toLocaleString('id-ID') || ''
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Detail Pesanan</h1>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto">
        {/* Status Card */}
        <div className={`m-4 p-4 rounded-xl ${statusInfo.bg}`}>
          <div className="flex items-center gap-3 mb-2">
            <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
            <div>
              <div className={`font-semibold ${statusInfo.color}`}>
                {statusInfo.text}
              </div>
              <div className="text-sm text-gray-600">Order #{order.id.substring(0, 12)}...</div>
            </div>
          </div>
          {order.status === 'pending' && (
            <div className="text-sm text-gray-600 mt-2">
              Pesanan Anda sedang menunggu konfirmasi dari penjual
            </div>
          )}
          {order.status === 'on-delivery' && (
            <div className="text-sm text-gray-600 mt-2">
              Pesanan sedang dalam perjalanan ke alamat Anda
            </div>
          )}
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-4">Status Pesanan</h3>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${step.completed
                      ? 'bg-golden-600 border-golden-600'
                      : 'bg-white border-gray-300'
                      }`}
                  />
                  {index < trackingSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${step.completed ? 'bg-golden-600' : 'bg-gray-300'
                        }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div
                    className={`text-sm ${step.completed ? 'font-medium' : 'text-gray-500'
                      }`}
                  >
                    {step.label}
                  </div>
                  {step.time && (
                    <div className="text-xs text-gray-500 mt-1">{step.time}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-3">Informasi Pengiriman</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="text-sm text-gray-600">Alamat Pengiriman</div>
                <div className="text-sm font-medium">{order.deliveryAddress}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-3">Detail Pesanan</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">x{item.quantity}</div>
                  <div className="text-sm font-semibold text-golden-600 mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-3">Rincian Pembayaran</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Biaya Pengiriman</span>
              <span className="text-green-600">Gratis</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Metode Pembayaran</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-golden-600">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 space-y-2">
          {order.status === 'delivered' && (
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-golden-600 to-golden-700 text-white py-3 rounded-lg font-medium"
            >
              Pesan Lagi
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full border border-golden-600 text-golden-600 py-3 rounded-lg font-medium"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
