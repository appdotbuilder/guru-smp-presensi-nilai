import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface DashboardData {
    teacherAssignments: Array<{
        id: number;
        school_class: {
            id: number;
            name: string;
            grade: string;
        };
        subject: {
            id: number;
            name: string;
            code: string;
        };
        academic_year: number;
    }>;
    todayAttendanceCount: number;
    totalStudents: number;
    recentGrades: number;
}

export default function Dashboard() {
    const { teacherAssignments, todayAttendanceCount, totalStudents, recentGrades } = usePage<SharedData & DashboardData>().props;

    return (
        <AppShell>
            <div className="space-y-8">
                <Heading title="📊 Dashboard Guru" />

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                👥
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Siswa</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                                ✅
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Presensi Hari Ini</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayAttendanceCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                                📚
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mata Pelajaran</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{teacherAssignments.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                                📝
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nilai Terbaru</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentGrades}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            🎯 Aksi Cepat
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Link
                                href={route('attendance.index')}
                                className="flex items-center justify-center rounded-lg bg-green-50 p-4 text-center hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                            >
                                <div>
                                    <div className="mb-2 text-2xl">✅</div>
                                    <div className="text-sm font-medium text-green-800 dark:text-green-300">
                                        Input Presensi
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={route('grades.index')}
                                className="flex items-center justify-center rounded-lg bg-blue-50 p-4 text-center hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
                            >
                                <div>
                                    <div className="mb-2 text-2xl">📝</div>
                                    <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                        Input Nilai
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={route('attendance.index')}
                                className="flex items-center justify-center rounded-lg bg-purple-50 p-4 text-center hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
                            >
                                <div>
                                    <div className="mb-2 text-2xl">📊</div>
                                    <div className="text-sm font-medium text-purple-800 dark:text-purple-300">
                                        Rekap Presensi
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={route('grades.index')}
                                className="flex items-center justify-center rounded-lg bg-orange-50 p-4 text-center hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30"
                            >
                                <div>
                                    <div className="mb-2 text-2xl">📈</div>
                                    <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                        Rekap Nilai
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                            📚 Kelas & Mata Pelajaran
                        </h2>
                        <div className="max-h-96 space-y-3 overflow-y-auto">
                            {teacherAssignments.length > 0 ? (
                                teacherAssignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {assignment.subject.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Kelas {assignment.school_class.name} • {assignment.subject.code}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('attendance.index', { assignment_id: assignment.id })}
                                                    className="rounded bg-green-100 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30"
                                                >
                                                    Presensi
                                                </Link>
                                                <Link
                                                    href={route('grades.index', { assignment_id: assignment.id })}
                                                    className="rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
                                                >
                                                    Nilai
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                                    <div className="text-4xl mb-4">🎓</div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Belum ada kelas yang ditugaskan
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                    <h2 className="mb-2 text-2xl font-bold">
                        Selamat datang di EduTrack SMP! 🎉
                    </h2>
                    <p className="text-indigo-100">
                        Platform lengkap untuk mengelola presensi dan penilaian siswa. 
                        Mulai dengan memilih kelas dan mata pelajaran yang ingin Anda kelola.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}