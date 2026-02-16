import { useState } from 'react';
import { useOwnerOrders, updateOrderStatus as updateOrderInDb } from '../hooks/useOrders';
import { Package, Search, CheckCircle2, Clock, Truck, XCircle, Eye, MapPin, Loader2, Camera } from 'lucide-react';
import { OwnerSidebar } from '../components/OwnerSidebar';
import { OwnerHeader } from '../components/OwnerHeader';

export function OwnerOrders() {
  const { orders, loading } = useOwnerOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Dibayar', color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
      case 'confirmed':
        return { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 };
      case 'processing':
        return { label: 'Diproses', color: 'bg-purple-100 text-purple-800', icon: Package };
      case 'pesanan_dibuat':
        return { label: 'Mencari Driver', color: 'bg-amber-100 text-amber-800', icon: Clock };
      case 'driver_tiba_di_restoran':
        return { label: 'Driver di Resto', color: 'bg-blue-100 text-blue-800', icon: MapPin };
      case 'pesanan_diambil_driver':
        return { label: 'Pesanan Diambil', color: 'bg-indigo-100 text-indigo-800', icon: Package };
      case 'otw_menuju_lokasi':
        return { label: 'Driver OTW', color: 'bg-orange-100 text-orange-800', icon: Truck };
      case 'pesanan_selesai':
      case 'delivered':
        return { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
      case 'cancelled':
        return { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Package };
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderInDb(orderId, newStatus as any);
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'paid').length,
    active: orders.filter((o) => !['delivered', 'pesanan_selesai', 'cancelled'].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === 'delivered' || o.status === 'pesanan_selesai').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <OwnerHeader
          title="Kelola Pesanan"
          subtitle="Pantau dan kelola semua pesanan masuk"
        />

        <div className="-mt-16 relative z-10">
          <div className="px-8 py-6 space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari ID pesanan atau alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-golden-600"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { key: 'all', label: 'Semua', count: statusCounts.all },
                  { key: 'pending', label: 'Menunggu/Dibayar', count: statusCounts.pending },
                  { key: 'active', label: 'Aktif/Proses', count: statusCounts.active },
                  { key: 'delivered', label: 'Selesai', count: statusCounts.delivered },
                  { key: 'cancelled', label: 'Dibatalkan', count: statusCounts.cancelled },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setStatusFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${statusFilter === filter.key
                      ? 'bg-golden-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Total Pesanan</div>
                <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Sedang Diproses</div>
                <div className="text-3xl font-bold text-golden-600">
                  {orders.filter((o) => ['pending', 'confirmed', 'processing'].includes(o.status)).length}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Dalam Pengiriman</div>
                <div className="text-3xl font-bold text-blue-600">
                  {statusCounts.active}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="text-sm text-gray-600 mb-2">Selesai</div>
                <div className="text-3xl font-bold text-green-600">
                  {statusCounts.delivered}
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Loader2 className="w-16 h-16 text-golden-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Memuat pesanan...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Tidak ada pesanan
                  </h3>
                  <p className="text-gray-500">
                    Belum ada pesanan yang sesuai dengan filter Anda
                  </p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  const isExpanded = selectedOrder === order.id;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-bold text-gray-900 text-lg mb-1">
                              {order.id}
                            </div>
                            <div className="text-sm text-gray-500">{order.date}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{order.deliveryAddress}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-gray-900">
                            {formatPrice(order.total)}
                          </div>
                          <button
                            onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
                            className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg font-medium hover:bg-amber-100 transition-all flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            {isExpanded ? 'Tutup' : 'Detail'}
                          </button>
                        </div>
                      </div>

                      {/* Order Details (Expanded) */}
                      {isExpanded && (
                        <div className="p-4 bg-gray-50">
                          {/* Items */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Item Pesanan:</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between bg-white p-3 rounded-lg">
                                  <div>
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-sm text-gray-500">Jumlah: {item.quantity}</div>
                                  </div>
                                  <div className="font-medium text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Photo (Proof) */}
                          {order.completionPhoto && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <Camera className="w-4 h-4 text-golden-600" />
                                Bukti Foto Delivery:
                              </h4>
                              <div className="bg-white p-2 rounded-xl border border-gray-200">
                                <img
                                  src={order.completionPhoto}
                                  alt="Bukti Foto"
                                  className="w-full h-auto rounded-lg shadow-sm"
                                  onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                              </div>
                            </div>
                          )}

                          {/* Payment Method */}
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Metode Pembayaran:</h4>
                            <div className="bg-white p-3 rounded-lg">
                              <span className="text-gray-700">{order.paymentMethod}</span>
                            </div>
                          </div>

                          {/* Change Status */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Ubah Status:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {['confirmed', 'processing', 'on-delivery', 'delivered'].map((status) => {
                                const config = getStatusConfig(status);
                                return (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(order.id, status)}
                                    disabled={order.status === status}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${order.status === status
                                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                      : 'bg-amber-600 text-white hover:bg-amber-700'
                                      }`}
                                  >
                                    {config.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
