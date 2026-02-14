import { Header } from '../components/Header';
import { User, MapPin, Phone, Mail, ChevronRight, LogOut, CreditCard, Bell, HelpCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogoutModal } from '../components/LogoutModal';
import { useState } from 'react';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  // Redirect owner/driver to their dashboards if they try to access customer profile
  if (user?.role === 'owner') {
    window.location.href = '/owner'; // Force reload/redirect
    return null;
  }
  if (user?.role === 'driver') {
    window.location.href = '/driver';
    return null;
  }

  const menuItems = [
    { icon: User, label: 'Edit Profil', path: '/profile/edit' },
    { icon: MapPin, label: 'Alamat Tersimpan', path: '/address' },
    { icon: CreditCard, label: 'Metode Pembayaran', path: '/profile/payment' },
    { icon: Bell, label: 'Notifikasi', path: '/profile/notifications' },
    { icon: HelpCircle, label: 'Bantuan', path: '/profile/help' },
    { icon: Shield, label: 'Privasi & Keamanan', path: '/profile/privacy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Profil Saya" />

      <div className="max-w-screen-sm mx-auto">
        {/* User Info */}
        <div className="bg-white p-6 mb-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-amber-700" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{user?.displayName || 'User'}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{user?.phone || '-'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{user?.address || 'Belum ada alamat tersimpan'}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-4 mb-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-amber-600">12</div>
              <div className="text-xs text-gray-600 mt-1">Total Pesanan</div>
            </div>
            <div className="text-center border-l border-r">
              <div className="text-2xl font-semibold text-amber-600">3</div>
              <div className="text-xs text-gray-600 mt-1">Sedang Proses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-amber-600">9</div>
              <div className="text-xs text-gray-600 mt-1">Selesai</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white mb-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b' : ''
                  }`}
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div className="px-4 py-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-gray-500 py-4">
          Versi 1.0.0
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
