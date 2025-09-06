import React from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Link, usePage } from '@inertiajs/react';

interface Assignment {
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
}

interface AttendanceSummary {
    student: {
        id: number;
        name: string;
        nis: string;
    };
    total: number;
    present: number;
    sick: number;
    permission: number;
    absent: number;
    percentage: number;
}

interface AttendanceSummaryProps {
    assignment: Assignment;
    attendanceSummary: AttendanceSummary[];
    [key: string]: unknown;
}

export default function AttendanceSummaryPage() {
    const { assignment, attendanceSummary } = usePage<AttendanceSummaryProps>().props;

    const getPercentageColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 dark:text-green-400';
        if (percentage >= 80) return 'text-yellow-600 dark:text-yellow-400';
        if (percentage >= 70) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const totalDays = attendanceSummary.length > 0 ? Math.max(...attendanceSummary.map(s => s.total)) : 0;
    const totalPresent = attendanceSummary.reduce((sum, s) => sum + s.present, 0);
    const totalSick = attendanceSummary.reduce((sum, s) => sum + s.sick, 0);
    const totalPermission = attendanceSummary.reduce((sum, s) => sum + s.permission, 0);
    const totalAbsent = attendanceSummary.reduce((sum, s) => sum + s.absent, 0);
    const overallPercentage = totalDays > 0 ? (totalPresent / (attendanceSummary.length * totalDays)) * 100 : 0;

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="📊 Rekap Presensi" />
                    <Link
                        href={route('attendance.index', { assignment_id: assignment.id })}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        ✅ Input Presensi
                    </Link>
                </div>

                {/* Class Info */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        📚 {assignment.subject.name} - Kelas {assignment.school_class.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Periode: 30 hari terakhir • Tahun Ajaran {assignment.academic_year}
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                📅
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hari</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDays}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                                ✅
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hadir</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPresent}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                                🤒
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sakit</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSick}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                📝
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Izin</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPermission}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                                ❌
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alfa</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAbsent}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overall Statistics */}
                <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">📈 Statistik Keseluruhan</h3>
                    <p className="text-indigo-100 mb-4">
                        Persentase kehadiran rata-rata kelas: <span className="text-2xl font-bold">{overallPercentage.toFixed(1)}%</span>
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                            className="bg-white h-3 rounded-full transition-all duration-300"
                            style={{ width: `${overallPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Student Details Table */}
                <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                    <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            👥 Detail Presensi Per Siswa
                        </h3>
                    </div>

                    <div className="p-6">
                        {attendanceSummary.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                No
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                NIS
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Nama Siswa
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Hadir
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Sakit
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Izin
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Alfa
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Persentase
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {attendanceSummary.map((summary, index) => (
                                            <tr key={summary.student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {index + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {summary.student.nis}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    {summary.student.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                                                    {summary.total}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                                        {summary.present}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                                                        {summary.sick}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                        {summary.permission}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                                        {summary.absent}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className={`text-sm font-bold ${getPercentageColor(summary.percentage)}`}>
                                                        {summary.percentage}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <div className="text-4xl mb-4">📊</div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Belum ada data presensi untuk kelas ini
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}