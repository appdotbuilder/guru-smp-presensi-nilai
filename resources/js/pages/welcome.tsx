import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Presensi & Penilaian SMP">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
                <header className="mb-8 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                                📚
                            </div>
                            <span className="text-xl font-bold">EduTrack SMP</span>
                        </div>
                        <div className="flex gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main className="w-full max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
                            📊 Sistem Presensi & Penilaian
                            <span className="block text-indigo-600 dark:text-indigo-400">untuk Guru SMP</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
                            Platform lengkap untuk mengelola presensi siswa dan penilaian akademik dengan mudah dan efisien. 
                            Dilengkapi dengan sistem pelaporan yang komprehensif.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                        <div className="rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 text-2xl dark:bg-green-900">
                                ✅
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Presensi Digital</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Input presensi per mata pelajaran</li>
                                <li>• Status: Hadir, Sakit, Izin, Alfa</li>
                                <li>• Rekap kehadiran otomatis</li>
                                <li>• Laporan PDF siap cetak</li>
                            </ul>
                        </div>

                        <div className="rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900">
                                📝
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Sistem Penilaian</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Nilai Harian, UTS, dan UAS</li>
                                <li>• Perhitungan otomatis nilai akhir</li>
                                <li>• Bobot penilaian yang sama</li>
                                <li>• Input nilai per kelas</li>
                            </ul>
                        </div>

                        <div className="rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-100 text-2xl dark:bg-purple-900">
                                📈
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Laporan Lengkap</h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Rekap presensi per kelas</li>
                                <li>• Analisis kehadiran siswa</li>
                                <li>• Rekap nilai komprehensif</li>
                                <li>• Export ke format PDF</li>
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-12 shadow-2xl dark:bg-gray-800">
                        <div className="grid gap-12 md:grid-cols-2">
                            <div>
                                <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                                    🎯 Fitur Unggulan
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Manajemen Kelas Terintegrasi</h4>
                                            <p className="text-gray-600 dark:text-gray-300">Kelola multiple kelas dan mata pelajaran dalam satu platform</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Dashboard Interaktif</h4>
                                            <p className="text-gray-600 dark:text-gray-300">Visualisasi data yang mudah dipahami dengan grafik dan statistik</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-sm">
                                            ✓
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">Akses Mobile Friendly</h4>
                                            <p className="text-gray-600 dark:text-gray-300">Responsive design untuk akses dari berbagai perangkat</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white">
                                <h3 className="mb-4 text-2xl font-bold">Mulai Sekarang</h3>
                                <p className="mb-6 text-indigo-100">
                                    Bergabunglah dengan ribuan guru yang telah menggunakan EduTrack SMP 
                                    untuk mengelola presensi dan penilaian siswa dengan lebih efisien.
                                </p>
                                {!auth.user ? (
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-indigo-600 hover:bg-gray-100"
                                        >
                                            Daftar Gratis
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white hover:bg-white/10"
                                        >
                                            Masuk
                                        </Link>
                                    </div>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-medium text-indigo-600 hover:bg-gray-100"
                                    >
                                        Ke Dashboard →
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
                        <p>© 2024 EduTrack SMP. Dibuat dengan ❤️ untuk pendidikan yang lebih baik.</p>
                    </footer>
                </main>
            </div>
        </>
    );
}