import { useMemo } from 'react';
import { useOwnerOrders } from '../hooks/useOrders';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  MapPin,
  Calendar,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { OwnerSidebar } from '../components/OwnerSidebar';
import { OwnerHeader } from '../components/OwnerHeader';

export function OwnerDashboard() {
  const { orders } = useOwnerOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate stats from real Firebase data
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const activeOrders = orders.filter((o) => ['pending', 'processing', 'on-delivery'].includes(o.status)).length;

  // Revenue trend data (mock)
  const revenueTrendData = [
    { day: 'Sen', revenue: 2500000 },
    { day: 'Sel', revenue: 3200000 },
    { day: 'Rab', revenue: 2800000 },
    { day: 'Kam', revenue: 4100000 },
    { day: 'Jum', revenue: 5200000 },
    { day: 'Sab', revenue: 6800000 },
    { day: 'Min', revenue: 7500000 },
  ];

  // Popular products data
  const popularProductsData = [
    { name: 'Paket Lengkap', value: 45, amount: 18500000 },
    { name: 'Paket Komplit', value: 30, amount: 12000000 },
    { name: 'Paket Hemat', value: 25, amount: 7500000 },
  ];

  const COLORS = ['#D4AF37', '#B8941F', '#8F7318'];

  // Order status distribution
  const orderStatusData = [
    { name: 'Selesai', value: completedOrders },
    { name: 'Sedang Proses', value: activeOrders },
    { name: 'Dibatalkan', value: orders.filter((o) => o.status === 'cancelled').length },
  ];

  const STATUS_COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  // Peak hours data (mock)
  const peakHoursData = [
    { hour: '08:00', orders: 5 },
    { hour: '10:00', orders: 12 },
    { hour: '12:00', orders: 25 },
    { hour: '14:00', orders: 18 },
    { hour: '16:00', orders: 22 },
    { hour: '18:00', orders: 35 },
    { hour: '20:00', orders: 28 },
  ];

  // Location heatmap data (mock)
  const locationData = [
    { area: 'Jakarta Selatan', orders: 45, revenue: 18500000 },
    { area: 'Jakarta Pusat', orders: 32, revenue: 14200000 },
    { area: 'Jakarta Barat', orders: 28, revenue: 11800000 },
    { area: 'Jakarta Timur', orders: 25, revenue: 10500000 },
    { area: 'Jakarta Utara', orders: 20, revenue: 8200000 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <OwnerHeader
          title="Dashboard Owner"
          subtitle="Kelola bisnis Anda"
        />

        {/* Content wrapper with proper overlap */}
        <div className="-mt-16 relative z-10">
          {/* Stats Cards */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-golden-500 to-golden-600 rounded-xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-10 h-10 opacity-80" />
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">{formatPrice(totalRevenue)}</div>
                <div className="text-sm opacity-90">Total Omzet</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-10 h-10 opacity-80" />
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">{totalOrders}</div>
                <div className="text-sm opacity-90">Total Pesanan</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-10 h-10 opacity-80" />
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">{completedOrders}</div>
                <div className="text-sm opacity-90">Pesanan Selesai</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-10 h-10 opacity-80" />
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">{activeOrders}</div>
                <div className="text-sm opacity-90">Pesanan Aktif</div>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tren Pendapatan</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>7 Hari Terakhir</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `${value / 1000000}jt`} />
                  <Tooltip
                    formatter={(value: number) => formatPrice(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D4AF37"
                    strokeWidth={3}
                    dot={{ fill: '#D4AF37', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Popular Products */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu Populer</h2>
                <div className="space-y-4">
                  {popularProductsData.map((product, index) => (
                    <div key={product.name} className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: COLORS[index] }}
                      >
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.value} pesanan</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-golden-600">{formatPrice(product.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Pesanan</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {orderStatusData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[index] }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Peak Hours */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Jam Sibuk Pemesanan</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="orders" fill="#D4AF37" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Location Heatmap */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Heatmap Lokasi Pengiriman</h2>
                <MapPin className="w-5 h-5 text-golden-600" />
              </div>
              <div className="space-y-3">
                {locationData.map((location, index) => {
                  const maxOrders = Math.max(...locationData.map((l) => l.orders));
                  const percentage = (location.orders / maxOrders) * 100;
                  return (
                    <div key={location.area}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{location.area}</span>
                        <span className="text-sm text-gray-600">{location.orders} pesanan</span>
                      </div>
                      <div className="relative w-full h-10 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-golden-500 to-golden-600 rounded-lg flex items-center justify-end px-4"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-sm font-semibold text-white">{formatPrice(location.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
