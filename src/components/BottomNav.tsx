import { Home, ShoppingBag, User, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { isAuthenticated, setIntendedPath } = useAuth();

  const handleNavClick = (path: string) => {
    // For orders and profile, require login
    if ((path === '/orders' || path === '/profile') && !isAuthenticated) {
      setIntendedPath(path);
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { icon: Home, label: 'Beranda', path: '/' },
    { icon: Clock, label: 'Pesanan', path: '/orders', requiresAuth: true },
    { icon: ShoppingBag, label: 'Keranjang', path: '/cart', badge: cart.length },
    { icon: User, label: 'Profil', path: '/profile', requiresAuth: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="max-w-screen-sm mx-auto grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="flex flex-col items-center justify-center gap-1 relative transition-all active:scale-95"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-golden-600' : 'text-gray-500'
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-golden-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-golden-600' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
