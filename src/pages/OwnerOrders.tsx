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

            {/* Orders List Redesign */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal & Waktu</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <Loader2 className="w-8 h-8 text-golden-600 animate-spin mx-auto mb-2" />
                          Memuat data...
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                          Tidak ada pesanan ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const isExpanded = selectedOrder === order.id;

                        return (
                          <React.Fragment key={order.id}>
                            <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-amber-50/30' : ''}`}>
                              <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">#{order.id.substring(0, 8)}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{order.id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                  {new Date(order.date || Date.now()).toLocaleDateString('id-ID')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(order.date || Date.now()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                  {statusConfig.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {order.driverId ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-golden-100 flex items-center justify-center text-golden-700">
                                      <Truck className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs">
                                      <div className="font-semibold text-gray-900">Driver Aktif</div>
                                      <div className="text-gray-500">#{order.driverId.substring(0, 6)}</div>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">Belum ada driver</span>
                                )}
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-900">
                                {formatPrice(order.total)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => setSelectedOrder(isExpanded ? null : order.id)}
                                  className="p-2 hover:bg-gray-200 rounded-lg transition-all text-gray-600"
                                  title="Lihat Detail"
                                >
                                  <Eye className={`w-5 h-5 ${isExpanded ? 'text-golden-600' : ''}`} />
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-gray-50/50">
                                <td colSpan={6} className="px-6 py-6 border-b border-gray-100">
                                  <div className="grid grid-cols-3 gap-8">
                                    {/* Items & Payment */}
                                    <div className="col-span-2 space-y-6">
                                      <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Item Pesanan</h4>
                                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                          {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between p-3 border-b border-gray-50 last:border-0">
                                              <div>
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                              </div>
                                              <div className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Metode Bayar</h4>
                                          <div className="text-sm font-bold text-gray-800">{order.paymentMethod}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Alamat Kirim</h4>
                                          <div className="text-xs font-medium text-gray-800 line-clamp-2">{order.deliveryAddress}</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Photo & Actions */}
                                    <div className="space-y-6">
                                      {order.completionPhoto ? (
                                        <div>
                                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bukti Pengiriman</h4>
                                          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-100">
                                            <img src={order.completionPhoto} className="w-full h-full object-cover" alt="Proof" />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="aspect-video bg-gray-100 rounded-xl flex flex-col items-center justify-center border border-dashed border-gray-300">
                                          <Camera className="w-8 h-8 text-gray-300 mb-2" />
                                          <span className="text-[10px] text-gray-400">Belum ada foto bukti</span>
                                        </div>
                                      )}

                                      <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Update Progress</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                          {['confirmed', 'processing', 'on-delivery', 'delivered'].map((status) => (
                                            <button
                                              key={status}
                                              onClick={() => handleStatusChange(order.id, status)}
                                              disabled={order.status === status}
                                              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${order.status === status
                                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                  : 'bg-golden-600 text-white hover:bg-golden-700 shadow-sm shadow-golden-200'
                                                }`}
                                            >
                                              {getStatusConfig(status).label.toUpperCase()}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
