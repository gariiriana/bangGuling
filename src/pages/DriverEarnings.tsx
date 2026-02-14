import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { DollarSign, TrendingUp, Calendar, Clock, CheckCircle2, Award } from 'lucide-react';

export function DriverEarnings() {
  const { orders } = useCart();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate driver earnings (20% of order total)
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const totalEarnings = completedOrders.reduce((sum, order) => sum + order.total * 0.2, 0);
  const todayEarnings = totalEarnings; // Mock data - in real app would filter by date
  const thisWeekEarnings = totalEarnings;
  const thisMonthEarnings = totalEarnings;

  const getEarningsByPeriod = () => {
    switch (selectedPeriod) {
      case 'today':
        return todayEarnings;
      case 'week':
        return thisWeekEarnings;
      case 'month':
        return thisMonthEarnings;
      default:
        return 0;
    }
  };

  const currentEarnings = getEarningsByPeriod();

  // Mock daily earnings for the week
  const dailyEarnings = [
    { day: 'Sen', amount: 120000 },
    { day: 'Sel', amount: 150000 },
    { day: 'Rab', amount: 180000 },
    { day: 'Kam', amount: 140000 },
    { day: 'Jum', amount: 200000 },
    { day: 'Sab', amount: 250000 },
    { day: 'Min', amount: 220000 },
  ];

  const maxEarning = Math.max(...dailyEarnings.map((d) => d.amount));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-golden-600 via-black-700 to-black-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Pendapatan Driver</h1>
        <p className="text-golden-200">Pantau penghasilan Anda</p>
      </div>

      <div className="max-w-screen-sm mx-auto p-4 space-y-4">
        {/* Period Selector */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('today')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                selectedPeriod === 'today'
                  ? 'bg-golden-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                selectedPeriod === 'week'
                  ? 'bg-golden-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                selectedPeriod === 'month'
                  ? 'bg-golden-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Bulan Ini
            </button>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-gradient-to-br from-golden-600 to-golden-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              <span className="text-golden-100">Total Pendapatan</span>
            </div>
            <TrendingUp className="w-6 h-6 text-golden-200" />
          </div>
          <div className="text-4xl font-bold mb-2">
            {formatPrice(currentEarnings)}
          </div>
          <div className="flex items-center gap-2 text-golden-100">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {selectedPeriod === 'today' && 'Hari Ini'}
              {selectedPeriod === 'week' && 'Minggu Ini'}
              {selectedPeriod === 'month' && 'Bulan Ini'}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm">Pesanan Selesai</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {completedOrders.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-5 h-5 text-golden-600" />
              <span className="text-sm">Rata-rata/Pesanan</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {completedOrders.length > 0
                ? formatPrice(totalEarnings / completedOrders.length)
                : formatPrice(0)}
            </div>
          </div>
        </div>

        {/* Daily Earnings Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Pendapatan Minggu Ini
          </h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {dailyEarnings.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-golden-600 to-golden-400 rounded-t-lg transition-all hover:from-golden-700 hover:to-golden-500"
                    style={{
                      height: `${(item.amount / maxEarning) * 100}%`,
                      minHeight: '20px',
                    }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-600">{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Award className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Driver Bintang 5</h3>
              <p className="text-sm text-purple-100">
                Pertahankan performa terbaik Anda!
              </p>
            </div>
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Riwayat Pendapatan
          </h2>
          <div className="space-y-3">
            {completedOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    +{formatPrice(order.total * 0.2)}
                  </div>
                  <div className="text-xs text-gray-500">20% komisi</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
