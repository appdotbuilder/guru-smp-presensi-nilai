import React from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Link, router, usePage } from '@inertiajs/react';

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

interface GradeData {
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
}

interface GradesIndexProps {
    assignments: Assignment[];
    selectedAssignment: Assignment | null;
    gradeData: GradeData[];
    [key: string]: unknown;
}

export default function GradesIndex() {
    const { assignments, selectedAssignment, gradeData } = usePage<GradesIndexProps>().props;

    const handleAssignmentChange = (assignmentId: string) => {
        if (assignmentId) {
            router.get(route('grades.index'), { assignment_id: assignmentId });
        } else {
            router.get(route('grades.index'));
        }
    };

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-gray-400';
        if (score >= 85) return 'text-green-600 dark:text-green-400';
        if (score >= 75) return 'text-blue-600 dark:text-blue-400';
        if (score >= 65) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const formatScore = (score: number | null) => {
        return score !== null ? score.toFixed(1) : '-';
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="📝 Kelola Nilai" />
                    {selectedAssignment && (
                        <div className="flex gap-2">
                            <Link
                                href={route('grades.show', { assignment_id: selectedAssignment.id })}
                                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                                📊 Lihat Rekap
                            </Link>
                            <Link
                                href={route('grades.create', { assignment_id: selectedAssignment.id })}
                                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                ➕ Input Nilai
                            </Link>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pilih Kelas & Mata Pelajaran
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                            value={selectedAssignment?.id || ''}
                            onChange={(e) => handleAssignmentChange(e.target.value)}
                        >
                            <option value="">-- Pilih Kelas --</option>
                            {assignments.map((assignment) => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.school_class.name} - {assignment.subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedAssignment && (
                    <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                📚 {selectedAssignment.subject.name} - Kelas {selectedAssignment.school_class.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tahun Ajaran {selectedAssignment.academic_year}
                            </p>
                        </div>

                        <div className="p-6">
                            {gradeData.length > 0 ? (
                                <>
                                    {/* Quick Actions */}
                                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                                        <Link
                                            href={route('grades.create', { 
                                                assignment_id: selectedAssignment.id, 
                                                type: 'daily' 
                                            })}
                                            className="flex items-center justify-center rounded-lg bg-blue-50 p-4 text-center hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
                                        >
                                            <div>
                                                <div className="mb-2 text-2xl">📚</div>
                                                <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                                    Input Nilai Harian
                                                </div>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route('grades.create', { 
                                                assignment_id: selectedAssignment.id, 
                                                type: 'midterm' 
                                            })}
                                            className="flex items-center justify-center rounded-lg bg-orange-50 p-4 text-center hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30"
                                        >
                                            <div>
                                                <div className="mb-2 text-2xl">🎯</div>
                                                <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                                    Input Nilai UTS
                                                </div>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route('grades.create', { 
                                                assignment_id: selectedAssignment.id, 
                                                type: 'final' 
                                            })}
                                            className="flex items-center justify-center rounded-lg bg-purple-50 p-4 text-center hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30"
                                        >
                                            <div>
                                                <div className="mb-2 text-2xl">🏆</div>
                                                <div className="text-sm font-medium text-purple-800 dark:text-purple-300">
                                                    Input Nilai UAS
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

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
                                                        Rata-rata Harian
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Nilai UTS
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Nilai UAS
                                                    </th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Nilai Akhir
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                                {gradeData.map((data, index) => (
                                                    <tr key={data.student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                            {index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                            {data.student.nis}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                            {data.student.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <span className={`text-sm font-bold ${getScoreColor(data.daily_average)}`}>
                                                                {formatScore(data.daily_average)}
                                                            </span>
                                                            {data.daily_grades.length > 0 && (
                                                                <div className="text-xs text-gray-500">
                                                                    ({data.daily_grades.length} nilai)
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <span className={`text-sm font-bold ${getScoreColor(data.midterm_grade?.score ?? null)}`}>
                                                                {formatScore(data.midterm_grade?.score ?? null)}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <span className={`text-sm font-bold ${getScoreColor(data.final_grade?.score ?? null)}`}>
                                                                {formatScore(data.final_grade?.score ?? null)}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-center">
                                                            <span className={`text-lg font-bold ${getScoreColor(data.final_score)}`}>
                                                                {formatScore(data.final_score)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="text-4xl mb-4">👥</div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Tidak ada data siswa untuk kelas ini
                                    </p>
                                    <Link
                                        href={route('grades.create', { assignment_id: selectedAssignment.id })}
                                        className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
                                    >
                                        ➕ Mulai Input Nilai
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!selectedAssignment && (
                    <div className="rounded-lg bg-white p-12 shadow-md text-center dark:bg-gray-800">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Pilih Kelas dan Mata Pelajaran
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Silakan pilih kelas dan mata pelajaran untuk mulai mengelola nilai siswa
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}