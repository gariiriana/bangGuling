import { ArrowLeft, MapPin, CreditCard, Wallet, ChevronRight, Clock, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../hooks/useOrders';
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useCart();
  const { selectedAddress } = useAddress();
  const { user, setIntendedPath } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState('gopay');
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('2026-02-13');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const paymentMethods = [
    { id: 'gopay', name: 'GoPay', icon: Wallet, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'ovo', name: 'OVO', icon: Wallet, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'dana', name: 'DANA', icon: Wallet, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'card', name: 'Kartu Kredit/Debit', icon: CreditCard, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { id: 'qris', name: 'QRIS', icon: QrCode, color: 'text-golden-600', bgColor: 'bg-golden-50' },
  ];

  const getFinalTotal = () => {
    const subtotal = getTotal();
    const serviceFee = 5000;
    return subtotal + serviceFee;
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      showNotification('Silakan pilih alamat pengiriman terlebih dahulu', 'error');
      return;
    }

    if (!user) {
      showNotification('Silakan login terlebih dahulu', 'info');
      setIntendedPath('/checkout');
      navigate('/login');
      return;
    }

    setLoading(true);

    const paymentMethodName = paymentMethods.find((p) => p.id === selectedPayment)?.name || 'GoPay';

    // Create order in Firestore
    const result = await createOrder(
      user.uid,
      cart,
      getFinalTotal(),
      selectedAddress.address,
      paymentMethodName
    );

    setLoading(false);

    if (result.success) {
      clearCart();
      navigate(`/order/${result.orderId}`);
    } else {
      showNotification('Gagal membuat pesanan. Silakan coba lagi.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto">
        {/* Delivery Address */}
        <button
          onClick={() => navigate('/address')}
          className="bg-white p-4 mb-2 w-full text-left"
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-golden-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">Alamat Pengiriman</h3>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
              {selectedAddress ? (
                <>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {selectedAddress.name} • {selectedAddress.phone}
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {selectedAddress.address}
                  </div>
                  {selectedAddress.detail && (
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedAddress.detail}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-red-600">
                  Pilih alamat pengiriman
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Delivery Date */}
        <div className="bg-white p-4 mb-2">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-golden-600" />
            <h3 className="font-semibold">Tanggal & Waktu Pengiriman</h3>
          </div>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            * Minimal pemesanan H-1 hari sebelumnya
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-3">Pesanan Anda</h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.quantity} x {formatPrice(item.price)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Notes */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-2">Catatan untuk Penjual (Opsional)</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Bumbu tidak terlalu pedas"
            className="w-full text-sm border border-gray-300 rounded-lg p-3"
            rows={3}
          />
        </div>

        {/* Payment Method */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-3">Metode Pembayaran</h3>
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-3 p-3 border-2 rounded-xl transition-all ${selectedPayment === method.id
                    ? 'border-golden-500 bg-golden-50'
                    : 'border-gray-200 hover:border-golden-300'
                    }`}
                >
                  <div className={`w-10 h-10 ${method.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${method.color}`} />
                  </div>
                  <span className="flex-1 text-left text-sm font-medium">{method.name}</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id
                      ? 'border-golden-600 bg-golden-600'
                      : 'border-gray-300'
                      }`}
                  >
                    {selectedPayment === method.id && (
                      <div className="text-white text-xs">✓</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white p-4 mb-2">
          <h3 className="font-semibold mb-3">Rincian Pembayaran</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Biaya Pengiriman</span>
              <span className="text-green-600">Gratis</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Biaya Layanan</span>
              <span>{formatPrice(5000)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total Pembayaran</span>
              <span className="text-golden-600">{formatPrice(getFinalTotal())}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <button
            onClick={handleCheckout}
            disabled={!selectedAddress || loading}
            className={`w-full py-3.5 rounded-xl font-semibold transition-all ${selectedAddress && !loading
              ? 'bg-gradient-to-r from-golden-600 to-golden-700 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {loading ? 'Memproses Pesanan...' : selectedAddress ? `Bayar ${formatPrice(getFinalTotal())}` : 'Pilih Alamat Dulu'}
          </button>
        </div>
      </div>

    </div>
  );
}
