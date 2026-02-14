import { Header } from '../components/Header';
import { useProducts } from '../hooks/useProducts';
import { Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LoginRequiredModal } from '../components/LoginRequiredModal';

export function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const categories = [
    { id: 'all', name: 'Semua', icon: '🍽️', gradient: 'from-golden-500 to-golden-700' },
    { id: 'Makanan Utama', name: 'Makanan Utama', icon: '🍛', gradient: 'from-orange-500 to-red-600' },
    { id: 'Snack', name: 'Snack', icon: '🔥', gradient: 'from-red-500 to-pink-600' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFilteredProducts = () => {
    if (!products) return [];

    let filtered = products;

    // Search filter first (Global)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Then apply category filter if not "all"
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header showSearch showLocation />
        <div className="max-w-screen-sm mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat produk...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header showSearch showLocation />
        <div className="max-w-screen-sm mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 mb-2">Gagal memuat produk</p>
            <p className="text-sm text-red-600">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header showSearch showLocation />
        <div className="max-w-screen-sm mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-700 mb-2">Belum ada produk tersedia</p>
            <p className="text-sm text-yellow-600">Silakan hubungi admin untuk menambahkan produk</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header showSearch showLocation onSearch={setSearchQuery} />


      {/* Categories - Enhanced */}
      <div className="max-w-screen-sm mx-auto px-4 py-3">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col items-center gap-2 min-w-[90px] transition-all ${selectedCategory === cat.id ? 'scale-105' : 'scale-100'
                }`}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-md transition-all ${selectedCategory === cat.id
                  ? 'ring-4 ring-golden-300 shadow-lg'
                  : 'opacity-70'
                  }`}
              >
                {cat.icon}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${selectedCategory === cat.id
                  ? 'text-golden-700'
                  : 'text-gray-600'
                  }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Menu */}
      <div className="max-w-screen-sm mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Menu Populer</h2>
          <button className="text-sm text-golden-600 hover:text-golden-700 transition-colors">Lihat Semua</button>
        </div>

        <div className="grid gap-3">
          {filteredProducts.slice(0, 3).map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex gap-3 cursor-pointer active:scale-98 transition-transform"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-28 h-28 object-cover"
              />
              <div className="flex-1 p-3 pr-2">
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <Star className="w-3 h-3 fill-golden-500 text-golden-500" />
                  <span>{product.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{product.servings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-golden-600">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    className="bg-gradient-to-r from-golden-600 to-black-700 text-white p-1.5 rounded-lg hover:from-golden-700 hover:to-black-800 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        setShowLoginModal(true);
                        return;
                      }
                      addToCart({ ...product, quantity: 1 });
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Menu */}
      <div className="max-w-screen-sm mx-auto px-4 py-4">
        <h2 className="text-lg font-semibold mb-3">Semua Menu</h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer active:scale-98 transition-transform"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <Star className="w-3 h-3 fill-golden-500 text-golden-500" />
                  <span className="text-xs">{product.rating}</span>
                </div>
                <div className="text-sm font-semibold text-golden-600">
                  {formatPrice(product.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal Login Required */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
