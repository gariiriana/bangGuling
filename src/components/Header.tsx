import { Search, MapPin, Bell, ChevronDown } from 'lucide-react';
import logo from 'figma:asset/877ad0558b27a27f7de66e697939ba2ccf913439.png';
import { useNavigate } from 'react-router-dom';
import { useAddress } from '../context/AddressContext';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showLocation?: boolean;
}

export function Header({ title, showSearch, showLocation }: HeaderProps) {
  const navigate = useNavigate();
  const { selectedAddress } = useAddress();

  return (
    <div className="bg-gradient-to-r from-golden-600 via-black-700 to-black-800 text-white">
      <div className="max-w-screen-sm mx-auto px-4 pt-4 pb-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          {showLocation ? (
            <button 
              onClick={() => navigate('/address')}
              className="flex items-center gap-2 flex-1 mr-4"
            >
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="text-xs opacity-90">Dikirim ke</div>
                <div className="text-sm font-medium truncate flex items-center gap-1">
                  {selectedAddress?.address || 'Pilih alamat pengiriman'}
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <img src={logo} alt="Bang Guling" className="h-10 w-auto object-contain" />
            </div>
          )}
          <button className="p-2 flex-shrink-0">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="bg-white text-gray-700 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu kambing guling..."
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
