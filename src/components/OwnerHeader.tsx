import { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogoutModal } from './LogoutModal';

export function OwnerHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/owner/profile');
  };

  return (
    <>
      <div className="bg-gradient-to-r from-golden-600 via-black-700 to-black-800 text-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-golden-200">{subtitle}</p>}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-black-800/50 hover:bg-black-800 transition-all px-4 py-3 rounded-xl border border-golden-600/30"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-golden-500 to-golden-600 rounded-full flex items-center justify-center text-white font-bold">

              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{user?.name}</div>
                <div className="text-xs text-golden-300">Owner</div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                  >
                    <User className="w-5 h-5 text-golden-600" />
                    <span>Lihat Profil</span>
                  </button>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
