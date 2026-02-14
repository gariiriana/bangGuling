import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Package, FileText, Settings } from 'lucide-react';
import logo from 'figma:asset/877ad0558b27a27f7de66e697939ba2ccf913439.png';

export function OwnerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/owner', icon: BarChart3, label: 'Dashboard' },
    { path: '/owner/orders', icon: Package, label: 'Pesanan' },
    { path: '/owner/reports', icon: FileText, label: 'Laporan' },
    { path: '/owner/settings', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-black-800 to-black-900 text-white flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-golden-600/30">
        <button 
          onClick={() => navigate('/owner')}
          className="flex items-center gap-3 mb-2 hover:opacity-80 transition-opacity w-full text-left"
        >
          <img src={logo} alt="Bang Guling" className="h-12 w-auto object-contain" />
        </button>
        <p className="text-xs text-golden-300">Owner Dashboard</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-golden-600 to-golden-700 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-black-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
