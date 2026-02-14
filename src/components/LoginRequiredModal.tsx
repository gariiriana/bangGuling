import { X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-golden-50 rounded-full flex items-center justify-center ring-8 ring-golden-50/50">
                        <LogIn className="w-10 h-10 text-golden-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Login Diperlukan
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Silakan login atau daftar akun terlebih dahulu untuk melakukan pemesanan dan menikmati fitur lengkap.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full px-4 py-3.5 bg-gradient-to-r from-golden-600 to-golden-700 text-white rounded-xl font-semibold hover:from-golden-700 hover:to-golden-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                    >
                        Login / Daftar Sekarang
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Nanti Saja
                    </button>
                </div>
            </div>
        </div>
    );
}
