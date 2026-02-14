import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { useAddress, Address } from '../context/AddressContext';
import { useNotification } from '../context/NotificationContext';

export function AddressFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addresses, addAddress, updateAddress } = useAddress();
    const { showNotification } = useNotification();

    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Omit<Address, 'id'>>({
        label: '',
        name: '',
        phone: '',
        address: '',
        detail: '',
        isDefault: false
    });

    useEffect(() => {
        if (isEdit && id) {
            const existingAddress = addresses.find(a => a.id === id);
            if (existingAddress) {
                const { id: _, ...rest } = existingAddress;
                setFormData(rest);
            } else {
                showNotification('Alamat tidak ditemukan', 'error');
                navigate('/address');
            }
        }
    }, [isEdit, id, addresses, navigate, showNotification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.phone || !formData.address || !formData.label) {
            showNotification('Mohon isi semua bidang yang wajib', 'error');
            return;
        }

        setLoading(true);
        try {
            if (isEdit && id) {
                updateAddress(id, formData);
                showNotification('Alamat berhasil diperbarui', 'success');
            } else {
                addAddress(formData);
                showNotification('Alamat baru berhasil ditambahkan', 'success');
            }
            navigate('/address');
        } catch (error) {
            showNotification('Gagal menyimpan alamat', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-screen-sm mx-auto px-4 py-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold">
                        {isEdit ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                    </h1>
                </div>
            </div>

            <div className="max-w-screen-sm mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Label Alamat */}
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Label Alamat (Contoh: Rumah, Kantor) *
                            </label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                placeholder="Masukkan label alamat"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent outline-none transition-all text-sm"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Penerima *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nama Lengkap"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    No. Telepon *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0812xxxx"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Alamat Lengkap *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan"
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Catatan / Patokan (Opsional)
                            </label>
                            <input
                                type="text"
                                value={formData.detail}
                                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                                placeholder="Contoh: Rumah warna hijau, depan pos satpam"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Default Address */}
                    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-900">Jadikan Alamat Utama</div>
                            <div className="text-xs text-gray-500">Gunakan sebagai alamat pengiriman utama</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-golden-600"></div>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-golden-600 to-golden-700 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Alamat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
