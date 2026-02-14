import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const { isAuthenticated, setIntendedPath } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Save intended path and redirect to login
      setIntendedPath('/checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Keranjang Saya</h1>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Keranjang Kosong</h2>
            <p className="text-gray-500 text-center mb-6">
              Yuk, mulai pesan kambing guling favoritmu!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-golden-600 to-golden-700 text-white px-6 py-3 rounded-lg font-medium hover:from-golden-700 hover:to-golden-800 transition-all shadow-lg"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm">
                  <div className="flex gap-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {item.servings}
                      </p>
                      <div className="text-sm font-semibold text-golden-600">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 h-fit hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white border-t border-gray-200 p-4 space-y-3">
              <h3 className="font-semibold">Ringkasan Belanja</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Total Harga ({cart.reduce((sum, item) => sum + item.quantity, 0)} item)
                  </span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-golden-600">{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="p-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-golden-600 to-golden-700 text-white py-3 rounded-lg font-medium hover:from-golden-700 hover:to-golden-800 transition-all shadow-lg"
              >
                {isAuthenticated ? 'Lanjut ke Pembayaran' : 'Login untuk Melanjutkan'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
