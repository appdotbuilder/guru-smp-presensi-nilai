import React, { useState } from 'react';
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

interface Student {
    id: number;
    name: string;
    nis: string;
}

interface CreateGradeProps {
    assignment: Assignment;
    students: Student[];
    gradeType: string;
    [key: string]: unknown;
}

export default function CreateGrade() {
    const { assignment, students, gradeType } = usePage<CreateGradeProps>().props;
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [scores, setScores] = useState<Record<number, string>>({});

    const handleScoreChange = (studentId: number, score: string) => {
        setScores(prev => ({
            ...prev,
            [studentId]: score
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const grades = students.map(student => ({
            student_id: student.id,
            score: parseFloat(scores[student.id] || '0')
        })).filter(grade => grade.score > 0);

        router.post(route('grades.store'), {
            assignment_id: assignment.id,
            type: gradeType,
            date: date,
            description: description,
            grades: grades
        });
    };

    const getTypeLabel = (type: string) => {
        const labels = {
            daily: 'Nilai Harian',
            midterm: 'Nilai UTS',
            final: 'Nilai UAS'
        };
        return labels[type as keyof typeof labels] || type;
    };

    const getTypeIcon = (type: string) => {
        const icons = {
            daily: '📚',
            midterm: '🎯',
            final: '🏆'
        };
        return icons[type as keyof typeof icons] || '📝';
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title={`${getTypeIcon(gradeType)} Input ${getTypeLabel(gradeType)}`} />
                    <Link
                        href={route('grades.index', { assignment_id: assignment.id })}
                        className="inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    >
                        ← Kembali
                    </Link>
                </div>

                {/* Class Info */}
                <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        📚 {assignment.subject.name} - Kelas {assignment.school_class.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Jenis Nilai: {getTypeLabel(gradeType)} • Tahun Ajaran {assignment.academic_year}
                    </p>
                </div>

                {/* Form */}
                <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                    <form onSubmit={handleSubmit}>
                        {/* Form Header */}
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tanggal Nilai
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Keterangan (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Ulangan Harian Bab 1"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Students Table */}
                        <div className="p-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    👥 Daftar Siswa
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Masukkan nilai untuk setiap siswa (0-100). Kosongkan jika siswa tidak mengikuti ujian.
                                </p>
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
                                                Nilai (0-100)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {students.map((student, index) => (
                                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {index + 1}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                    {student.nis}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                    {student.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        placeholder="0"
                                                        value={scores[student.id] || ''}
                                                        onChange={(e) => handleScoreChange(student.id, e.target.value)}
                                                        className="w-20 rounded border border-gray-300 px-3 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Siswa yang akan dinilai: {Object.values(scores).filter(score => parseFloat(score) > 0).length} dari {students.length}
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={route('grades.index', { assignment_id: assignment.id })}
                                        className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
                                    >
                                        💾 Simpan Nilai
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                💡
                            </div>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                Tips Input Nilai
                            </h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Nilai dimasukkan dalam skala 0-100</li>
                                    <li>Kosongkan kolom nilai jika siswa tidak mengikuti ujian</li>
                                    <li>Sistem akan otomatis menghitung nilai akhir berdasarkan bobot yang sama</li>
                                    <li>Nilai dapat diubah setelah disimpan dengan menginput nilai baru</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}