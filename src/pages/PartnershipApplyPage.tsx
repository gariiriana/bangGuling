import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

export function PartnershipApplyPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [applicationId, setApplicationId] = useState('');
    const { showNotification } = useNotification();

    // Form data
    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',

        // Step 2: Documents
        ktpNumber: '',
        ktpPhoto: null as File | null,
        simNumber: '',
        simPhoto: null as File | null,

        // Step 3: Vehicle
        vehicleType: 'motor' as 'motor' | 'mobil',
        vehicleBrand: '',
        vehicleYear: new Date().getFullYear(),
        platNumber: '',
        stnkPhoto: null as File | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (field: string, file: File | null) => {
        if (file && file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, [field]: 'Ukuran file maksimal 2MB' }));
            return;
        }
        setFormData(prev => ({ ...prev, [field]: file }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.fullName) newErrors.fullName = 'Nama lengkap wajib diisi';
            if (!formData.email) newErrors.email = 'Email wajib diisi';
            if (!formData.phone) newErrors.phone = 'No. HP wajib diisi';
            if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Tanggal lahir wajib diisi';
            if (!formData.address) newErrors.address = 'Alamat wajib diisi';
        } else if (step === 2) {
            if (!formData.ktpNumber) newErrors.ktpNumber = 'No. KTP wajib diisi';
            if (!formData.ktpPhoto) newErrors.ktpPhoto = 'Foto KTP wajib diupload';
            if (!formData.simNumber) newErrors.simNumber = 'No. SIM wajib diisi';
            if (!formData.simPhoto) newErrors.simPhoto = 'Foto SIM wajib diupload';
        } else if (step === 3) {
            if (!formData.vehicleBrand) newErrors.vehicleBrand = 'Merk kendaraan wajib diisi';
            if (!formData.platNumber) newErrors.platNumber = 'Plat nomor wajib diisi';
            if (!formData.stnkPhoto) newErrors.stnkPhoto = 'Foto STNK wajib diupload';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadFile = async (file: File, path: string): Promise<string> => {
        const storageRef = ref(storage, `driver-applications/${path}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(3)) return;

        setLoading(true);
        try {
            // Upload files
            const ktpUrl = formData.ktpPhoto ? await uploadFile(formData.ktpPhoto, `ktp-${Date.now()}.jpg`) : '';
            const simUrl = formData.simPhoto ? await uploadFile(formData.simPhoto, `sim-${Date.now()}.jpg`) : '';
            const stnkUrl = formData.stnkPhoto ? await uploadFile(formData.stnkPhoto, `stnk-${Date.now()}.jpg`) : '';

            // Create application document
            const applicationData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address,
                ktpNumber: formData.ktpNumber,
                ktpPhoto: ktpUrl,
                simNumber: formData.simNumber,
                simPhoto: simUrl,
                vehicleType: formData.vehicleType,
                vehicleBrand: formData.vehicleBrand,
                vehicleYear: formData.vehicleYear,
                platNumber: formData.platNumber,
                stnkPhoto: stnkUrl,
                status: 'pending_review',
                currentStage: 1,
                submittedAt: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, 'driverApplications'), applicationData);
            setApplicationId(docRef.id);
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            showNotification('Gagal mengirim aplikasi. Silakan coba lagi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Aplikasi Berhasil Dikirim!</h2>
                    <p className="text-gray-600 mb-6">
                        Terima kasih telah mendaftar sebagai mitra driver Bang Guling.
                        Kami akan menghubungi Anda dalam 1-3 hari kerja.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">ID Aplikasi Anda:</p>
                        <p className="font-mono text-sm font-semibold">{applicationId}</p>
                    </div>
                    <button
                        onClick={() => navigate(`/partnership/status/${applicationId}`)}
                        className="w-full bg-golden-600 text-white py-3 rounded-lg font-semibold hover:bg-golden-700 transition-colors mb-3"
                    >
                        Lacak Status Aplikasi
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full text-gray-600 py-2 hover:text-gray-800"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/partnership')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali
                    </button>
                    <h1 className="text-3xl font-bold">Formulir Pendaftaran Mitra Driver</h1>
                    <p className="text-gray-600 mt-2">Lengkapi data di bawah untuk bergabung sebagai mitra driver</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step ? 'bg-golden-600 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-golden-600' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Data Pribadi</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    placeholder="Masukkan nama lengkap sesuai KTP"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    placeholder="contoh@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    No. HP/WhatsApp <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    placeholder="08xxxxxxxxxx"
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Lahir <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                />
                                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat Lengkap <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Documents */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Dokumen</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    No. KTP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.ktpNumber}
                                    onChange={(e) => handleInputChange('ktpNumber', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    placeholder="16 digit nomor KTP"
                                    maxLength={16}
                                />
                                {errors.ktpNumber && <p className="text-red-500 text-sm mt-1">{errors.ktpNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto KTP <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-golden-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('ktpPhoto', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="ktp-upload"
                                    />
                                    <label htmlFor="ktp-upload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            {formData.ktpPhoto ? formData.ktpPhoto.name : 'Klik untuk upload foto KTP'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Maksimal 2MB (JPG, PNG)</p>
                                    </label>
                                </div>
                                {errors.ktpPhoto && <p className="text-red-500 text-sm mt-1">{errors.ktpPhoto}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    No. SIM <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.simNumber}
                                    onChange={(e) => handleInputChange('simNumber', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    placeholder="Nomor SIM C/A"
                                />
                                {errors.simNumber && <p className="text-red-500 text-sm mt-1">{errors.simNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto SIM <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-golden-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('simPhoto', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="sim-upload"
                                    />
                                    <label htmlFor="sim-upload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            {formData.simPhoto ? formData.simPhoto.name : 'Klik untuk upload foto SIM'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Maksimal 2MB (JPG, PNG)</p>
                                    </label>
                                </div>
                                {errors.simPhoto && <p className="text-red-500 text-sm mt-1">{errors.simPhoto}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Vehicle */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Data Kendaraan</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Kendaraan <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange('vehicleType', 'motor')}
                                        className={`p-4 border-2 rounded-lg font-medium transition-colors ${formData.vehicleType === 'motor'
                                            ? 'border-golden-600 bg-golden-50 text-golden-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        🏍️ Motor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange('vehicleType', 'mobil')}
                                        className={`p-4 border-2 rounded-lg font-medium transition-colors ${formData.vehicleType === 'mobil'
                                            ? 'border-golden-600 bg-golden-50 text-golden-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        🚗 Mobil
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Merk & Model Kendaraan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.vehicleBrand}
                                    onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    placeholder="Contoh: Honda Beat, Toyota Avanza"
                                />
                                {errors.vehicleBrand && <p className="text-red-500 text-sm mt-1">{errors.vehicleBrand}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tahun Kendaraan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.vehicleYear}
                                    onChange={(e) => handleInputChange('vehicleYear', parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    min={2000}
                                    max={new Date().getFullYear()}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Plat Nomor <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.platNumber}
                                    onChange={(e) => handleInputChange('platNumber', e.target.value.toUpperCase())}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent"
                                    placeholder="B 1234 XYZ"
                                />
                                {errors.platNumber && <p className="text-red-500 text-sm mt-1">{errors.platNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto STNK <span className="text-red-500">*</span>
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-golden-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange('stnkPhoto', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="stnk-upload"
                                    />
                                    <label htmlFor="stnk-upload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            {formData.stnkPhoto ? formData.stnkPhoto.name : 'Klik untuk upload foto STNK'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Maksimal 2MB (JPG, PNG)</p>
                                    </label>
                                </div>
                                {errors.stnkPhoto && <p className="text-red-500 text-sm mt-1">{errors.stnkPhoto}</p>}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Kembali
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-golden-600 text-white rounded-lg font-semibold hover:bg-golden-700 transition-colors"
                            >
                                Selanjutnya
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-3 bg-golden-600 text-white rounded-lg font-semibold hover:bg-golden-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Mengirim...' : 'Kirim Aplikasi'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
