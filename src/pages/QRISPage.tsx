import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CheckCircle2 } from 'lucide-react';
import { useOrder, updateOrderStatus } from '../hooks/useOrders';
import { useNotification } from '../context/NotificationContext';

export function QRISPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { order, loading } = useOrder(orderId);
    const { showNotification } = useNotification();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleCompletePayment = async () => {
        if (!orderId) return;

        // In a mockup flow, we'll navigate immediately for a better user experience
        // and try to update the status in the background
        showNotification('Pembayaran Berhasil! Pesanan Anda sedang diproses.', 'success');
        navigate(`/order/${orderId}`);

        // Update status in background
        try {
            await updateOrderStatus(orderId, 'paid');
        } catch (error) {
            console.error('Background status update failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golden-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
                <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
                <button onClick={() => navigate('/')} className="text-golden-600 font-medium"> Kembali ke Beranda </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold">Pembayaran QRIS</h1>
                </div>
            </div>

            <div className="max-w-screen-sm mx-auto px-4 mt-6">
                {/* Payment Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-6">
                    <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                    <h2 className="text-2xl font-bold text-golden-600 mb-4">
                        {formatPrice(order.total)}
                    </h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full text-yellow-700 text-xs font-semibold uppercase tracking-wider">
                        Waiting for Payment
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 flex flex-col items-center text-center">
                    <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 mb-8 shadow-inner">
                        <QrCode className="w-64 h-64 text-gray-900" />
                    </div>

                    <div className="space-y-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Scan QRIS untuk Bayar</h3>
                        <p className="text-base text-gray-500 px-4 leading-relaxed">
                            Gunakan aplikasi bank atau e-wallet pilihan Anda untuk memindai kode di atas.
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                    <button
                        onClick={handleCompletePayment}
                        className="w-full bg-gradient-to-r from-golden-600 to-golden-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-golden-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        SAYA SUDAH BAYAR
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 px-8">
                        Pembayaran akan terverifikasi otomatis setelah Anda menekan tombol di atas (Mockup Flow).
                    </p>
                </div>
            </div>
        </div>
    );
}
