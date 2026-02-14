import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';
import { useNotification } from '../context/NotificationContext';
import { useOwnerOrders } from '../hooks/useOrders';
import { FileText, Download, TrendingUp, Package, DollarSign, Users, Truck, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OwnerSidebar } from '../components/OwnerSidebar';
import { OwnerHeader } from '../components/OwnerHeader';

export function OwnerReports() {
  const { orders, loading } = useOwnerOrders();
  const [reportPeriod, setReportPeriod] = useState('month');
  const { showNotification } = useNotification();
  const [drivers, setDrivers] = useState<User[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const q = query(collection(db, 'users'), where('role', '==', 'driver'));
      const snapshot = await getDocs(q);
      const driverData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as User[];
      setDrivers(driverData);
    };
    fetchDrivers();
  }, []);

  // Aggregate sales by driver
  const driverSalesData = drivers.map(driver => {
    const driverOrders = orders.filter(o => o.driverId === driver.uid);
    const revenue = driverOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      name: driver.displayName || 'Driver Tanpa Nama',
      revenue,
      orders: driverOrders.length,
      id: driver.uid
    };
  }).filter(d => d.orders > 0).sort((a, b) => b.revenue - a.revenue);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate distribution of payment methods from real orders
  const paymentMethodsList = ['GoPay', 'OVO', 'DANA', 'COD', 'Kartu Kredit'];
  const paymentData = paymentMethodsList.map(method => ({
    name: method,
    value: orders.length > 0 ? Math.round((orders.filter(o => o.paymentMethod === method).length / orders.length) * 100) : 0
  })).filter(d => d.value > 0);

  // Calculate product performance from real orders
  const productPerformance: Record<string, { count: number, revenue: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productPerformance[item.name]) {
        productPerformance[item.name] = { count: 0, revenue: 0 };
      }
      productPerformance[item.name].count += item.quantity;
      productPerformance[item.name].revenue += item.price * item.quantity;
    });
  });

  const productData = Object.entries(productPerformance).map(([name, stats]) => ({
    name,
    value: stats.count,
    revenue: stats.revenue
  })).sort((a, b) => b.value - a.value);

  // Sales data by month (derived from orders)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const currentMonthIdx = new Date().getMonth();
  const salesData = months.map((m, idx) => {
    const monthOrders = orders.filter(o => {
      const orderDate = new Date(o.date || '');
      return orderDate.getMonth() === idx && orderDate.getFullYear() === new Date().getFullYear();
    });
    return {
      month: m,
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
      orders: monthOrders.length
    };
  }).slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1);

  // Order status distribution
  const statusData = [
    { name: 'Selesai', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { name: 'Diantar', value: orders.filter(o => o.status === 'on-delivery').length, color: '#D4AF37' },
    { name: 'Diproses', value: orders.filter(o => o.status === 'processing').length, color: '#8b5cf6' },
    { name: 'Menunggu', value: orders.filter(o => o.status === 'pending').length, color: '#3b82f6' },
  ];

  const COLORS = ['#D4AF37', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

  const handleDownloadReport = () => {
    showNotification('Laporan akan diunduh dalam format PDF', 'info');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <OwnerSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <OwnerHeader
          title="Laporan & Analitik"
          subtitle="Pantau performa bisnis Anda"
        />

        {loading ? (
          <div className="flex-1 flex items-center justify-center -mt-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-golden-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Menganalisis data laporan...</p>
            </div>
          </div>
        ) : (
          <div className="-mt-16 relative z-10">
            <div className="px-8 py-6 space-y-6">
              {/* Period Selector and Download */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setReportPeriod('week')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${reportPeriod === 'week'
                      ? 'bg-golden-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    Minggu Ini
                  </button>
                  <button
                    onClick={() => setReportPeriod('month')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${reportPeriod === 'month'
                      ? 'bg-golden-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    Bulan Ini
                  </button>
                  <button
                    onClick={() => setReportPeriod('year')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${reportPeriod === 'year'
                      ? 'bg-golden-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    Tahun Ini
                  </button>
                </div>
                <button
                  onClick={handleDownloadReport}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-golden-500 to-golden-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-10 h-10 opacity-80" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-sm opacity-90 mb-1">Total Pendapatan</div>
                  <div className="text-3xl font-bold">{formatPrice(totalRevenue)}</div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Package className="w-10 h-10 opacity-80" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-sm opacity-90 mb-1">Total Pesanan</div>
                  <div className="text-3xl font-bold">{totalOrders}</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-10 h-10 opacity-80" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-sm opacity-90 mb-1">Rata-rata Order</div>
                  <div className="text-3xl font-bold">{formatPrice(averageOrderValue)}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Users className="w-10 h-10 opacity-80" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="text-sm opacity-90 mb-1">Pesanan Selesai</div>
                  <div className="text-3xl font-bold">{completedOrders.length}</div>
                </div>
              </div>

              {/* Sales Trend Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-golden-600" />
                  Tren Penjualan
                </h2>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} name="Pendapatan" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Product Performance */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-6 h-6 text-golden-600" />
                    Performa Produk
                  </h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={productData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#D4AF37" name="Jumlah Terjual" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-golden-600" />
                    Metode Pembayaran
                  </h2>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={paymentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-golden-600" />
                  Distribusi Status Pesanan
                </h2>
                <div className="grid grid-cols-4 gap-6">
                  {statusData.map((status) => (
                    <div
                      key={status.name}
                      className="p-6 rounded-xl border-2"
                      style={{ borderColor: status.color }}
                    >
                      <div className="text-4xl font-bold mb-2" style={{ color: status.color }}>
                        {status.value}
                      </div>
                      <div className="text-sm text-gray-600">{status.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales per Gerobak Section */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-golden-600" />
                  Penjualan per Gerobak (Mitra)
                </h2>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Driver Chart */}
                  <div className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={driverSalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => `Rp${val / 1000000}jt`} />
                        <Tooltip formatter={(value) => formatPrice(Number(value))} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#D4AF37" name="Total Omzet" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Driver Table List */}
                  <div className="lg:col-span-1 border border-gray-100 rounded-xl overflow-hidden self-start">
                    <div className="bg-gray-50 p-3 border-b border-gray-100 text-xs font-bold uppercase text-gray-500 flex justify-between">
                      <span>Nama Mitra</span>
                      <span>Omzet</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {driverSalesData.slice(0, 5).map((d, i) => (
                        <div key={d.id} className="p-3 flex items-center justify-between hover:bg-golden-50 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 bg-golden-100 text-golden-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-900 truncate">{d.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900 ml-2">{formatPrice(d.revenue)}</span>
                        </div>
                      ))}
                      {driverSalesData.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-xs italic">
                          Belum ada data penjualan per mitra
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Product Table */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-golden-600" />
                  Detail Produk Terlaris
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Produk</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-medium">Terjual</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-medium">Pendapatan</th>
                        <th className="text-right py-3 px-4 text-gray-600 font-medium">Persentase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((product, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{product.value}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">
                            {formatPrice(product.revenue)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-3 py-1 bg-golden-100 text-golden-700 rounded-full text-sm font-medium">
                              {product.value}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
