import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNotification } from '../context/NotificationContext';

export function EditProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(user?.photoURL || null);
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran (max 2MB sebelum kompresi)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Ukuran foto terlalu besar (maks 2MB)', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize jika terlalu besar (max 500px)
                const MAX_SIZE = 500;
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Kompresi (quality 0.7)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                setImagePreview(dataUrl);
                setBase64Image(dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!auth.currentUser) throw new Error('No authenticated user');

            const updates: any = {
                displayName: formData.displayName,
                phone: formData.phone,
                address: formData.address,
                updatedAt: new Date(),
            };

            // Include photoURL if changed
            if (base64Image) {
                updates.photoURL = base64Image;
            }

            // Update Firebase Auth Profile
            await updateProfile(auth.currentUser, {
                displayName: formData.displayName,
                photoURL: base64Image || user?.photoURL,
            });

            // Update Firestore User Doc
            const userRef = doc(db, 'users', user!.uid);
            await updateDoc(userRef, updates);

            showNotification('Profil berhasil diperbarui!', 'success');

            // Force reload to refresh context state and navigate back
            setTimeout(() => {
                navigate('/profile');
            }, 500);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            showNotification('Gagal memperbarui profil: ' + error.message, 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-40">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-screen-sm mx-auto px-4 py-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold">Edit Profil</h1>
                </div>
            </div>

            <div className="max-w-screen-sm mx-auto p-4">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100">

                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 ring-1 ring-gray-100">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                            </div>

                            {/* Pencil Button */}
                            <label className="absolute bottom-0 right-0 bg-white text-golden-600 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-all active:scale-95 border border-gray-100">
                                <span className="sr-only">Ubah Foto</span>
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 font-medium tracking-wide">Format: AVG, PNG (Maks. 2MB)</p>
                    </div>

                    <div className="space-y-5">
                        {/* Nama Lengkap */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Nama Lengkap
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-golden-600 transition-colors pointer-events-none">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                    className="block w-full pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-golden-500 focus:ring-4 focus:ring-golden-500/10 transition-all placeholder:text-gray-400 font-medium text-gray-900 shadow-sm"
                                    style={{ paddingLeft: '60px' }}
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                            </div>
                        </div>

                        {/* No. Telepon */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                No. Telepon
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-golden-600 transition-colors pointer-events-none">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="block w-full pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-golden-500 focus:ring-4 focus:ring-golden-500/10 transition-all placeholder:text-gray-400 font-medium text-gray-900 shadow-sm"
                                    style={{ paddingLeft: '60px' }}
                                    placeholder="Contoh: 081234567890"
                                />
                            </div>
                        </div>

                        {/* Alamat */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 ml-1">
                                Alamat Lengkap
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-golden-600 transition-colors pointer-events-none">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="block w-full pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-golden-500 focus:ring-4 focus:ring-golden-500/10 transition-all placeholder:text-gray-400 font-medium text-gray-900 shadow-sm min-h-[100px] resize-none"
                                    style={{ paddingLeft: '60px' }}
                                    placeholder="Masukkan alamat lengkap"
                                />
                            </div>
                        </div>




                    </div>

                    <div className="pt-8 pb-10 mb-8">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-golden-600 to-golden-700 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-golden-600/25 hover:shadow-xl hover:shadow-golden-600/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Simpan Perubahan</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
