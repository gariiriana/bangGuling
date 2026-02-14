import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FeatureComingSoonPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-amber-100/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Construction className="w-10 h-10 text-golden-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Segera Hadir!
            </h1>

            <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                Fitur ini sedang dalam tahap pengembangan. Nantikan update selanjutnya ya!
            </p>

            <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </button>
        </div>
    );
}
