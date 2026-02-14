import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { useAddress } from '../context/AddressContext';
import { useState } from 'react';

export function AddressPage() {
  const navigate = useNavigate();
  const { addresses, selectedAddress, setSelectedAddress, deleteAddress } = useAddress();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSelectAddress = (address: typeof addresses[0]) => {
    setSelectedAddress(address);
    navigate(-1);
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-screen-sm mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">Pilih Alamat Pengiriman</h1>
        </div>
      </div>

      <div className="max-w-screen-sm mx-auto">
        {/* Add New Address Button */}
        <div className="p-4">
          <button
            onClick={() => navigate('/address/new')}
            className="w-full bg-white border-2 border-dashed border-golden-400 rounded-xl p-4 flex items-center gap-3 text-golden-600 hover:bg-golden-50 transition-colors"
          >
            <div className="w-10 h-10 bg-golden-100 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-medium">Tambah Alamat Baru</div>
              <div className="text-sm opacity-80">Simpan alamat untuk pengiriman</div>
            </div>
          </button>
        </div>

        {/* Address List */}
        <div className="px-4 space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Alamat Tersimpan</div>
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl p-4 border-2 transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-golden-500 shadow-md'
                  : 'border-gray-200 hover:border-golden-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleSelectAddress(address)}
                  className="flex-1"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-3 py-1 bg-golden-100 text-golden-700 text-xs font-medium rounded-full">
                      {address.label}
                    </div>
                    {address.isDefault && (
                      <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                        Utama
                      </div>
                    )}
                  </div>
                  <div className="font-medium text-gray-900 mb-1">{address.name}</div>
                  <div className="text-sm text-gray-600 mb-1">{address.phone}</div>
                  <div className="text-sm text-gray-700 mb-1">{address.address}</div>
                  <div className="text-xs text-gray-500">{address.detail}</div>
                </button>
                
                {selectedAddress?.id === address.id && (
                  <div className="w-6 h-6 bg-golden-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                <button
                  onClick={() => navigate(`/address/edit/${address.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-golden-600 hover:bg-golden-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(address.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Hapus Alamat?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Alamat yang dihapus tidak dapat dikembalikan lagi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
