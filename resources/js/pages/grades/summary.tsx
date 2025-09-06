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

interface Grade {
    id: number;
    type: string;
    score: number;
    description?: string;
    date: string;
}

interface GradeSummary {
    student: {
        id: number;
        name: string;
        nis: string;
    };
    daily_grades: Grade[];
    daily_average: number | null;
    midterm_grade: Grade | null;
    final_grade: Grade | null;
    final_score: number | null;
    all_grades: Grade[];
}

interface GradeSummaryProps {
    assignment: Assignment;
    gradeSummary: GradeSummary[];
    [key: string]: unknown;
}

export default function GradeSummaryPage() {
    const { assignment, gradeSummary } = usePage<GradeSummaryProps>().props;

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-gray-400';
        if (score >= 85) return 'text-green-600 dark:text-green-400';
        if (score >= 75) return 'text-blue-600 dark:text-blue-400';
        if (score >= 65) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getGradeLabel = (score: number | null) => {
        if (score === null) return '-';
        if (score >= 85) return 'A';
        if (score >= 75) return 'B';
        if (score >= 65) return 'C';
        return 'D';
    };

    const formatScore = (score: number | null) => {
        return score !== null ? score.toFixed(1) : '-';
    };



    // Calculate statistics
    const validFinalScores = gradeSummary.filter(s => s.final_score !== null).map(s => s.final_score!);
    const averageScore = validFinalScores.length > 0 ? validFinalScores.reduce((a, b) => a + b, 0) / validFinalScores.length : 0;
    const highestScore = validFinalScores.length > 0 ? Math.max(...validFinalScores) : 0;
    const lowestScore = validFinalScores.length > 0 ? Math.min(...validFinalScores) : 0;

    const gradeDistribution = {
        A: validFinalScores.filter(s => s >= 85).length,
        B: validFinalScores.filter(s => s >= 75 && s < 85).length,
        C: validFinalScores.filter(s => s >= 65 && s < 75).length,
        D: validFinalScores.filter(s => s < 65).length,
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="📊 Rekap Nilai" />
                    <div className="flex gap-2">
                        <Link
                            href={route('grades.index', { assignment_id: assignment.id })}
                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            📝 Kelola Nilai
                        </Link>
                        <Link
                            href={route('grades.create', { assignment_id: assignment.id })}
                            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            ➕ Input Nilai
                        </Link>
                    </div>
                </div>

                {/* Class Info */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        📚 {assignment.subject.name} - Kelas {assignment.school_class.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tahun Ajaran {assignment.academic_year} • Total Siswa: {gradeSummary.length}
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                📊
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rata-rata Kelas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageScore.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                                📈
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nilai Tertinggi</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{highestScore.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                                📉
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nilai Terendah</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{lowestScore.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                                🎯
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Siswa Tuntas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {gradeDistribution.A + gradeDistribution.B + gradeDistribution.C}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grade Distribution */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        📈 Distribusi Nilai
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{gradeDistribution.A}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Grade A (85-100)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{gradeDistribution.B}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Grade B (75-84)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{gradeDistribution.C}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Grade C (65-74)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{gradeDistribution.D}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Grade D (0-64)</div>
                        </div>
                    </div>
                </div>

                {/* Student Details Table */}
                <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                    <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            👥 Detail Nilai Per Siswa
                        </h3>
                    </div>

                    <div className="p-6">
                        {gradeSummary.length > 0 ? (
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
                                                Harian
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                UTS
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                UAS
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Nilai Akhir
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                Grade
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {gradeSummary.map((summary, index) => (
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
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className={`text-sm font-bold ${getScoreColor(summary.daily_average)}`}>
                                                        {formatScore(summary.daily_average)}
                                                    </span>
                                                    {summary.daily_grades.length > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {summary.daily_grades.length} nilai
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className={`text-sm font-bold ${getScoreColor(summary.midterm_grade?.score ?? null)}`}>
                                                        {formatScore(summary.midterm_grade?.score ?? null)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className={`text-sm font-bold ${getScoreColor(summary.final_grade?.score ?? null)}`}>
                                                        {formatScore(summary.final_grade?.score ?? null)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className={`text-lg font-bold ${getScoreColor(summary.final_score)}`}>
                                                        {formatScore(summary.final_score)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getScoreColor(summary.final_score)}`}>
                                                        {getGradeLabel(summary.final_score)}
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
                                    Belum ada data nilai untuk kelas ini
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}