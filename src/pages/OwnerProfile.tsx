import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Briefcase, Building2, Edit2, Camera, Shield, Bell, Globe } from 'lucide-react';
import { OwnerSidebar } from '../components/OwnerSidebar';
import { OwnerHeader } from '../components/OwnerHeader';

export function OwnerProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <OwnerHeader
          title="Profil Owner"
          subtitle="Kelola informasi bisnis Anda"
        />

        <div className="px-8 -mt-16">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-8">
              <div className="relative -mt-20">
                <div className="w-32 h-32 bg-gradient-to-br from-golden-500 to-golden-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-golden-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-golden-700">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.name}
                </h2>
                <p className="text-gray-600 mb-4">Pemilik Bisnis</p>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-golden-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-golden-700 transition-all inline-flex items-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  {isEditing ? 'Simpan Perubahan' : 'Edit Profil'}
                </button>
              </div>

              {/* Business Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-golden-50 rounded-xl">
                  <div className="text-3xl font-bold text-golden-600">4.8</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-600">Pesanan</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Tahun</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-golden-600" />
                Informasi Pribadi
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <User className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Nama Lengkap</div>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">{user?.name}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Email</div>
                    {isEditing ? (
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">{user?.email}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Nomor Telepon</div>
                    {isEditing ? (
                      <input
                        type="tel"
                        defaultValue="+62 812-9999-8888"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">+62 812-9999-8888</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Alamat</div>
                    {isEditing ? (
                      <textarea
                        defaultValue="Jl. Bisnis Raya No. 100, Jakarta Selatan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                        rows={2}
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">
                        Jl. Bisnis Raya No. 100, Jakarta Selatan
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-golden-600" />
                Informasi Bisnis
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <Building2 className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Nama Bisnis</div>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue="Bang Guling"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">Bang Guling</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Jenis Usaha</div>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue="Kuliner & Katering"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">Kuliner & Katering</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Alamat Bisnis</div>
                    {isEditing ? (
                      <textarea
                        defaultValue="Jl. Kuliner No. 77, Jakarta Selatan"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                        rows={2}
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">
                        Jl. Kuliner No. 77, Jakarta Selatan
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">Website</div>
                    {isEditing ? (
                      <input
                        type="url"
                        defaultValue="www.kambinggulingpremium.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 text-lg">www.kambinggulingpremium.com</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Cards */}
          <div className="grid grid-cols-2 gap-6 mt-6 pb-8">
            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-golden-600" />
                Keamanan
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-golden-50 transition-all">
                  <div className="font-medium text-gray-900 mb-1">Ubah Password</div>
                  <div className="text-sm text-gray-600">Perbarui kata sandi Anda</div>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-golden-50 transition-all">
                  <div className="font-medium text-gray-900 mb-1">Autentikasi 2 Faktor</div>
                  <div className="text-sm text-gray-600">Tambahkan lapisan keamanan ekstra</div>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-golden-50 transition-all">
                  <div className="font-medium text-gray-900 mb-1">Perangkat Terpercaya</div>
                  <div className="text-sm text-gray-600">Kelola perangkat yang terhubung</div>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-golden-600" />
                Notifikasi
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Pesanan Baru</div>
                    <div className="text-sm text-gray-600">Notifikasi pesanan masuk</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-golden-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-golden-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Update Status</div>
                    <div className="text-sm text-gray-600">Perubahan status pesanan</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-golden-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-golden-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900">Laporan Harian</div>
                    <div className="text-sm text-gray-600">Ringkasan performa harian</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-golden-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-golden-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
