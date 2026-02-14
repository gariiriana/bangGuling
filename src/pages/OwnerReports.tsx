import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FileText, Download, TrendingUp, Package, DollarSign, Users, Calendar, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { OwnerSidebar } from '../components/OwnerSidebar';
import { OwnerHeader } from '../components/OwnerHeader';

export function OwnerReports() {
  const { orders } = useCart();
  const [reportPeriod, setReportPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

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

  // Sales data by month
  const salesData = [
    { month: 'Jan', revenue: 25000000, orders: 12 },
    { month: 'Feb', revenue: 28000000, orders: 15 },
    { month: 'Mar', revenue: 32000000, orders: 18 },
    { month: 'Apr', revenue: 30000000, orders: 16 },
    { month: 'Mei', revenue: 35000000, orders: 20 },
    { month: 'Jun', revenue: 38000000, orders: 22 },
  ];

  // Product performance
  const productData = [
    { name: 'Kambing Guling Utuh', value: 45, revenue: 15750000 },
    { name: 'Paket Lengkap', value: 30, revenue: 7500000 },
    { name: 'Paket Komplit', value: 15, revenue: 4800000 },
    { name: 'Paket Hemat', value: 10, revenue: 1800000 },
  ];

  // Payment methods
  const paymentData = [
    { name: 'GoPay', value: 35 },
    { name: 'OVO', value: 25 },
    { name: 'DANA', value: 20 },
    { name: 'Kartu Kredit', value: 15 },
    { name: 'COD', value: 5 },
  ];

  // Order status distribution
  const statusData = [
    { name: 'Selesai', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { name: 'Diantar', value: orders.filter(o => o.status === 'on-delivery').length, color: '#D4AF37' },
    { name: 'Diproses', value: orders.filter(o => o.status === 'processing').length, color: '#8b5cf6' },
    { name: 'Dikonfirmasi', value: orders.filter(o => o.status === 'confirmed').length, color: '#3b82f6' },
  ];

  const COLORS = ['#D4AF37', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

  const handleDownloadReport = () => {
    alert('Laporan akan diunduh dalam format PDF');
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

        <div className="-mt-16 relative z-10">
          <div className="px-8 py-6 space-y-6">
            {/* Period Selector and Download */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setReportPeriod('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportPeriod === 'week'
                      ? 'bg-golden-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Minggu Ini
                </button>
                <button
                  onClick={() => setReportPeriod('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportPeriod === 'month'
                      ? 'bg-golden-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Bulan Ini
                </button>
                <button
                  onClick={() => setReportPeriod('year')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    reportPeriod === 'year'
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
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentData.map((entry, index) => (
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
      </div>
    </div>
  );
}
