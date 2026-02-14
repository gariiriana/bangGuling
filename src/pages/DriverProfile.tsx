import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Star, Package, TrendingUp, Edit2, Camera, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LogoutModal } from '../components/LogoutModal';

export function DriverProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { orders } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const rating = 4.9;
  const totalDeliveries = completedOrders.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Profile Picture */}
      <div className="bg-gradient-to-r from-golden-600 via-black-700 to-black-800 text-white pt-6 pb-20">
        <div className="max-w-screen-sm mx-auto px-4">
          <h1 className="text-2xl font-bold mb-2">Profil Driver</h1>
          <p className="text-golden-200">Kelola informasi akun Anda</p>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto px-4 -mt-12">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex flex-col items-center -mt-16 mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-golden-500 to-golden-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-golden-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-golden-700">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user?.name}
            </h2>
            <div className="flex items-center justify-center gap-1 text-golden-600">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-bold text-lg">{rating}</span>
              <span className="text-gray-500 text-sm ml-1">
                ({totalDeliveries} pengiriman)
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-golden-50 rounded-xl">
              <Package className="w-6 h-6 text-golden-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">{totalDeliveries}</div>
              <div className="text-xs text-gray-600">Selesai</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-xs text-gray-600">On-Time</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <Star className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-gray-900">{rating}</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full bg-golden-600 text-white py-3 rounded-xl font-medium hover:bg-golden-700 transition-all flex items-center justify-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            {isEditing ? 'Simpan Perubahan' : 'Edit Profil'}
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Informasi Pribadi
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Nama Lengkap</div>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                ) : (
                  <div className="font-medium text-gray-900">{user?.name}</div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Email</div>
                {isEditing ? (
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                ) : (
                  <div className="font-medium text-gray-900">{user?.email}</div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Nomor Telepon</div>
                {isEditing ? (
                  <input
                    type="tel"
                    defaultValue="+62 812-3456-7890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                ) : (
                  <div className="font-medium text-gray-900">+62 812-3456-7890</div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1">Alamat</div>
                {isEditing ? (
                  <textarea
                    defaultValue="Jl. Merdeka No. 45, Jakarta Pusat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    rows={2}
                  />
                ) : (
                  <div className="font-medium text-gray-900">
                    Jl. Merdeka No. 45, Jakarta Pusat
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Informasi Kendaraan
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Jenis Kendaraan</div>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue="Motor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              ) : (
                <div className="font-medium text-gray-900">Motor</div>
              )}
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Nomor Plat</div>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue="B 1234 XYZ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              ) : (
                <div className="font-medium text-gray-900">B 1234 XYZ</div>
              )}
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Merk & Model</div>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue="Honda Vario 160"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              ) : (
                <div className="font-medium text-gray-900">Honda Vario 160</div>
              )}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Pencapaian
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl text-white">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-xs font-medium">Top Driver</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl text-white">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-xs font-medium">Fast Delivery</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-400 to-green-500 rounded-xl text-white">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-xs font-medium">5 Star Rating</div>
            </div>
          </div>
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
