import { useState } from 'react';
import { Settings, Bell, Globe, Truck, Store, Save, LogOut } from 'lucide-react';
import { OwnerSidebar } from '../components/OwnerSidebar';
import { OwnerHeader } from '../components/OwnerHeader';
import { LogoutModal } from '../components/LogoutModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

export function OwnerSettings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { showNotification } = useNotification();

  const [settings, setSettings] = useState({
    storeName: 'Bang Guling',
    storePhone: '081234567890',
    storeAddress: 'Jl. Sudirman No. 123, Jakarta Selatan',
    deliveryRadius: 10,
    minOrderAmount: 500000,
    deliveryFee: 50000,
    operatingHours: {
      start: '08:00',
      end: '20:00',
    },
    notifications: {
      newOrder: true,
      orderStatus: true,
      payment: true,
      lowStock: false,
    },
    autoAcceptOrders: false,
    taxRate: 10,
  });

  const handleSave = () => {
    showNotification('Pengaturan berhasil disimpan!', 'success');
  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <OwnerHeader
          title="Pengaturan"
          subtitle="Kelola pengaturan bisnis Anda"
        />

        {/* Content with proper spacing */}
        <div className="-mt-16 relative z-10">
          <div className="px-8 py-6 space-y-6 pb-24">{/* Added more bottom padding */}
            {/* Store Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Store className="w-6 h-6 text-golden-600" />
                Informasi Toko
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Toko
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Toko
                  </label>
                  <textarea
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6 text-golden-600" />
                Pengaturan Pengiriman
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radius Pengiriman (km)
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryRadius}
                    onChange={(e) => setSettings({ ...settings, deliveryRadius: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Pesanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Pengiriman (Rp)
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryFee}
                    onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 text-golden-600" />
                Jam Operasional
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={settings.operatingHours.start}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: { ...settings.operatingHours, start: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={settings.operatingHours.end}
                    onChange={(e) => setSettings({
                      ...settings,
                      operatingHours: { ...settings.operatingHours, end: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-6 h-6 text-golden-600" />
                Notifikasi
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-700">Pesanan Baru</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newOrder}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newOrder: e.target.checked }
                    })}
                    className="w-5 h-5 text-golden-600 border-gray-300 rounded focus:ring-golden-600"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-700">Update Status Pesanan</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderStatus}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, orderStatus: e.target.checked }
                    })}
                    className="w-5 h-5 text-golden-600 border-gray-300 rounded focus:ring-golden-600"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-700">Pembayaran Diterima</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.payment}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, payment: e.target.checked }
                    })}
                    className="w-5 h-5 text-golden-600 border-gray-300 rounded focus:ring-golden-600"
                  />
                </label>
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <span className="text-gray-700">Stok Menipis</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.lowStock}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, lowStock: e.target.checked }
                    })}
                    className="w-5 h-5 text-golden-600 border-gray-300 rounded focus:ring-golden-600"
                  />
                </label>
              </div>
            </div>

            {/* Other Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-golden-600" />
                Pengaturan Lainnya
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <div className="text-gray-900 font-medium">Terima Pesanan Otomatis</div>
                    <div className="text-sm text-gray-500">Pesanan akan diterima secara otomatis</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoAcceptOrders}
                    onChange={(e) => setSettings({ ...settings, autoAcceptOrders: e.target.checked })}
                    className="w-5 h-5 text-golden-600 border-gray-300 rounded focus:ring-golden-600"
                  />
                </label>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pajak (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-600"
                  />
                </div>
              </div>
            </div>



            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-8 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-golden-600 text-white rounded-lg font-medium hover:bg-golden-700 transition-all flex items-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Simpan Pengaturan
              </button>
            </div>
          </div>

          <LogoutModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
