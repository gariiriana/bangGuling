import { useNavigate, useLocation } from 'react-router-dom';
import { User as UserIcon, Package, DollarSign } from 'lucide-react';

export function DriverBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50 shadow-lg">
      <div className="max-w-screen-sm mx-auto grid grid-cols-3 h-16">
        <button
          onClick={() => navigate('/driver')}
          className="flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
        >
          <Package className={`w-6 h-6 transition-colors ${location.pathname === '/driver' ? 'text-golden-600' : 'text-gray-600'}`} />
          <span className={`text-xs transition-colors ${location.pathname === '/driver' ? 'text-golden-600' : 'text-gray-600'}`}>Pesanan</span>
        </button>
        <button
          onClick={() => navigate('/driver/earnings')}
          className="flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
        >
          <DollarSign className={`w-6 h-6 transition-colors ${location.pathname === '/driver/earnings' ? 'text-golden-600' : 'text-gray-600'}`} />
          <span className={`text-xs transition-colors ${location.pathname === '/driver/earnings' ? 'text-golden-600' : 'text-gray-600'}`}>Pendapatan</span>
        </button>
        <button
          onClick={() => navigate('/driver/profile')}
          className="flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
        >
          <UserIcon className={`w-6 h-6 transition-colors ${location.pathname === '/driver/profile' ? 'text-golden-600' : 'text-gray-600'}`} />
          <span className={`text-xs transition-colors ${location.pathname === '/driver/profile' ? 'text-golden-600' : 'text-gray-600'}`}>Profil</span>
        </button>
      </div>
    </div>
  );
}
