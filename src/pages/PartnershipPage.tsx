import { Users, TrendingUp, Package, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PartnershipPage() {
    const benefits = [
        { icon: TrendingUp, title: 'Penghasilan Menarik', desc: 'Komisi 10% per orderan + bonus mingguan' },
        { icon: CheckCircle2, title: 'Flexible Hours', desc: 'Atur jadwal kerja sesuai kebutuhanmu' },
        { icon: Package, title: 'Training Gratis', desc: 'Pelatihan lengkap sebelum mulai bekerja' },
        { icon: Users, title: 'Komunitas Driver', desc: 'Bergabung dengan ribuan mitra driver' }
    ];

    const requirements = [
        'Usia 21-50 tahun',
        'Memiliki motor/mobil sendiri',
        'SIM C/A yang masih aktif',
        'Smartphone Android/iOS',
        'Bersedia bekerja di area yang ditentukan',
        'Berkomitmen dan jujur'
    ];

    const steps = [
        { num: 1, title: 'Pendaftaran Online', desc: 'Isi form dan upload dokumen' },
        { num: 2, title: 'Seleksi Administrasi', desc: 'Verifikasi data dan dokumen' },
        { num: 3, title: 'Interview Singkat', desc: 'Wawancara online/offline' },
        { num: 4, title: 'Training', desc: 'Pelatihan SOP dan aplikasi' },
        { num: 5, title: 'Penempatan Wilayah', desc: 'Penentuan area kerja' },
        { num: 6, title: 'Mulai Bekerja', desc: 'Terima orderan pertama!' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-golden-600 via-golden-700 to-golden-800 text-white">
                <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            🚗 Bergabung Sebagai Mitra Driver
                        </h1>
                        <p className="text-xl md:text-2xl mb-2 opacity-90">
                            Penghasilan Hingga <span className="font-bold">Rp 5 Juta/Bulan</span>
                        </p>
                        <p className="text-lg mb-8 opacity-80">
                            Flexible Working Hours • Bonus Mingguan • Asuransi Kesehatan
                        </p>
                        <Link
                            to="/partnership/apply"
                            className="inline-block bg-white text-golden-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Benefits Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Keuntungan Bergabung
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <benefit.icon className="w-12 h-12 text-golden-600 mb-4" />
                                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Requirements Section */}
                <section className="mb-16">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Syarat & Ketentuan
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                            {requirements.map((req, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{req}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recruitment Process Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        Proses Rekrutmen
                    </h2>
                    <p className="text-center text-gray-600 mb-10">
                        Cepat, transparan, tanpa pungutan
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {steps.map((step) => (
                            <div key={step.num} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-golden-100 text-golden-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
                                        {step.num}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                                        <p className="text-gray-600 text-sm">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-golden-600 to-golden-700 text-white rounded-lg p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Siap Bergabung?
                    </h2>
                    <p className="text-lg mb-6 opacity-90">
                        Ratusan driver sudah bergabung dan mendapat penghasilan tambahan setiap bulan!
                    </p>
                    <Link
                        to="/partnership/apply"
                        className="inline-block bg-white text-golden-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Daftar Menjadi Mitra Driver
                    </Link>
                </section>
            </div>
        </div>
    );
}
