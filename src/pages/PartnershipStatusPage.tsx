import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DriverApplication } from '../types';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Calendar } from 'lucide-react';

export function PartnershipStatusPage() {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState<DriverApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!applicationId) {
            setError('ID aplikasi tidak valid');
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'driverApplications', applicationId);
        const unsubscribe = onSnapshot(
            docRef,
            (snapshot) => {
                if (snapshot.exists()) {
                    setApplication({ id: snapshot.id, ...snapshot.data() } as DriverApplication);
                } else {
                    setError('Aplikasi tidak ditemukan');
                }
                setLoading(false);
            },
            (err) => {
                setError('Gagal memuat data aplikasi');
                setLoading(false);
                console.error(err);
            }
        );

        return () => unsubscribe();
    }, [applicationId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-golden-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Aplikasi Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/partnership')}
                        className="w-full bg-golden-600 text-white py-3 rounded-lg font-semibold hover:bg-golden-700 transition-colors"
                    >
                        Kembali ke Partnership
                    </button>
                </div>
            </div>
        );
    }

    const steps = [
        {
            num: 1,
            title: 'Pendaftaran Online',
            desc: 'Form aplikasi terkirim',
            date: application.submittedAt?.toDate().toLocaleDateString('id-ID'),
        },
        {
            num: 2,
            title: 'Seleksi Administrasi',
            desc: 'Verifikasi dokumen',
            date: application.reviewedAt?.toDate().toLocaleDateString('id-ID'),
        },
        {
            num: 3,
            title: 'Interview Singkat',
            desc: 'Wawancara dengan tim',
            date: application.interviewDate?.toDate().toLocaleDateString('id-ID'),
        },
        {
            num: 4,
            title: 'Training',
            desc: 'Pelatihan SOP dan aplikasi',
            date: application.trainingStartDate?.toDate().toLocaleDateString('id-ID'),
        },
        {
            num: 5,
            title: 'Penempatan Wilayah',
            desc: 'Penentuan area kerja',
            date: application.assignedArea ? `Area: ${application.assignedArea}` : undefined,
        },
        {
            num: 6,
            title: 'Mulai Bekerja',
            desc: 'Akun driver diaktifkan',
            date: application.activatedAt?.toDate().toLocaleDateString('id-ID'),
        },
    ];

    const getStatusBadge = () => {
        if (application.status === 'rejected') {
            return (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                    <XCircle className="w-5 h-5" />
                    Ditolak
                </div>
            );
        }
        if (application.status === 'active') {
            return (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                    <CheckCircle2 className="w-5 h-5" />
                    Aktif
                </div>
            );
        }
        return (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                <Clock className="w-5 h-5" />
                Dalam Proses
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/partnership')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali
                    </button>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Status Aplikasi</h1>
                            <p className="text-gray-600">ID: {applicationId}</p>
                        </div>
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Progress Rekrutmen</h2>
                        <span className="text-2xl font-bold text-golden-600">
                            Tahap {application.currentStage} dari 6
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-golden-500 to-golden-600 transition-all duration-500"
                                style={{ width: `${(application.currentStage / 6) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Rejection Notice */}
                {application.status === 'rejected' && application.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-2">Aplikasi Ditolak</h3>
                                <p className="text-red-700">{application.rejectionReason}</p>
                                <p className="text-sm text-red-600 mt-2">
                                    Anda dapat mendaftar kembali setelah memenuhi persyaratan yang dibutuhkan.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Applicant Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Data Pendaftar</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Nama Lengkap</p>
                            <p className="font-semibold">{application.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-semibold">{application.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">No. HP</p>
                            <p className="font-semibold">{application.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Kendaraan</p>
                            <p className="font-semibold capitalize">{application.vehicleType} - {application.vehicleBrand}</p>
                        </div>
                    </div>
                </div>

                {/* Timeline Steps */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Timeline Rekrutmen</h2>
                    <div className="space-y-6">
                        {steps.map((step) => {
                            const isCompleted = application.currentStage >= step.num;
                            const isCurrent = application.currentStage === step.num;
                            const isRejected = application.status === 'rejected' && isCurrent;

                            return (
                                <div key={step.num} className="flex gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isRejected
                                                    ? 'bg-red-100 text-red-600'
                                                    : isCompleted
                                                        ? 'bg-green-100 text-green-600'
                                                        : isCurrent
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                }`}
                                        >
                                            {isRejected ? (
                                                <XCircle className="w-6 h-6" />
                                            ) : isCompleted ? (
                                                <CheckCircle2 className="w-6 h-6" />
                                            ) : isCurrent ? (
                                                <Clock className="w-6 h-6" />
                                            ) : (
                                                step.num
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-6 border-l-2 border-gray-200 pl-6 -ml-6">
                                        <h3
                                            className={`font-semibold mb-1 ${isCompleted ? 'text-gray-900' : 'text-gray-500'
                                                }`}
                                        >
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{step.desc}</p>
                                        {step.date && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                {step.date}
                                            </div>
                                        )}
                                        {isCurrent && !isRejected && (
                                            <div className="mt-2 text-sm text-blue-600 font-medium">
                                                ← Tahap saat ini
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Admin Notes */}
                {application.adminNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Catatan Admin</h3>
                        <p className="text-blue-700">{application.adminNotes}</p>
                    </div>
                )}

                {/* Next Steps */}
                {application.status !== 'rejected' && application.status !== 'active' && (
                    <div className="bg-golden-50 border border-golden-200 rounded-lg p-6 mt-6">
                        <h3 className="font-semibold text-golden-900 mb-2">Langkah Selanjutnya</h3>
                        <p className="text-golden-700">
                            {application.currentStage === 1 && 'Tim kami sedang meninjau dokumen Anda. Kami akan menghubungi Anda dalam 1-3 hari kerja.'}
                            {application.currentStage === 2 && 'Silakan tunggu jadwal interview yang akan dikirimkan via email/WhatsApp.'}
                            {application.currentStage === 3 && 'Setelah interview, kami akan mengirimkan jadwal training.'}
                            {application.currentStage === 4 && 'Ikuti training yang telah dijadwalkan untuk melanjutkan ke tahap berikutnya.'}
                            {application.currentStage === 5 && 'Area kerja Anda sedang ditentukan oleh tim.'}
                        </p>
                    </div>
                )}

                {/* Active Status */}
                {application.status === 'active' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6 text-center">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-900 mb-2">Selamat!</h3>
                        <p className="text-green-700 mb-4">
                            Akun driver Anda sudah aktif. Silakan login menggunakan email dan password yang telah dikirimkan.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Login Sebagai Driver
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
