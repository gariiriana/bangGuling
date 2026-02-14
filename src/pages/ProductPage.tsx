import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { product, loading, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/cart');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">Detail Produk</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">Detail Produk</h1>
          </div>
        </div>
        <div className="max-w-screen-sm mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700">Produk tidak ditemukan</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-golden-600 text-white rounded-lg hover:bg-golden-700"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Detail Produk</h1>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto">
        {/* Product Image */}
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />

        {/* Product Info */}
        <div className="px-4 py-4">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-semibold flex-1">{product.name}</h2>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-golden-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 fill-golden-600 text-golden-600" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews} ulasan)
            </span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">{product.servings}</span>
          </div>

          <div className="text-2xl font-semibold text-golden-600 mb-4">
            {formatPrice(product.price)}
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Deskripsi</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t pt-4 mb-4">
            <h3 className="font-medium mb-3">Informasi Tambahan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Waktu Persiapan</span>
                <span className="font-medium">4-6 jam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimal Pemesanan</span>
                <span className="font-medium">H-1 hari sebelumnya</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Area Pengiriman</span>
                <span className="font-medium">Jabodetabek</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-golden-600 to-golden-700 text-white py-3 rounded-lg font-medium hover:from-golden-700 hover:to-golden-800 transition-all shadow-lg"
            >
              {showSuccess ? '✓ Ditambahkan!' : 'Tambah ke Keranjang'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
