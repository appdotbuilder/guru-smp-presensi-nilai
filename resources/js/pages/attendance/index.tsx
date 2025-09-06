import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { router, usePage } from '@inertiajs/react';

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

interface AttendanceRecord {
    student: {
        id: number;
        name: string;
        nis: string;
    };
    attendance: {
        id: number;
        status: string;
        notes?: string;
    } | null;
    status: string | null;
}

interface AttendanceIndexProps {
    assignments: Assignment[];
    selectedAssignment: Assignment | null;
    attendanceData: AttendanceRecord[];
    selectedDate: string;
    [key: string]: unknown;
}

export default function AttendanceIndex() {
    const { assignments, selectedAssignment, attendanceData, selectedDate } = usePage<AttendanceIndexProps>().props;
    
    const [currentDate, setCurrentDate] = useState(selectedDate);
    const [attendanceStatuses, setAttendanceStatuses] = useState<Record<number, { status: string; notes?: string }>>(() => {
        const statuses: Record<number, { status: string; notes?: string }> = {};
        attendanceData.forEach((record) => {
            if (record.attendance) {
                statuses[record.student.id] = {
                    status: record.attendance.status,
                    notes: record.attendance.notes || ''
                };
            }
        });
        return statuses;
    });

    const handleAssignmentChange = (assignmentId: string) => {
        if (assignmentId) {
            router.get(route('attendance.index'), { 
                assignment_id: assignmentId, 
                date: currentDate 
            });
        } else {
            router.get(route('attendance.index'));
        }
    };

    const handleDateChange = (date: string) => {
        setCurrentDate(date);
        if (selectedAssignment) {
            router.get(route('attendance.index'), { 
                assignment_id: selectedAssignment.id, 
                date: date 
            });
        }
    };

    const handleStatusChange = (studentId: number, status: string) => {
        setAttendanceStatuses(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };

    const handleNotesChange = (studentId: number, notes: string) => {
        setAttendanceStatuses(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], notes }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedAssignment) return;

        const attendances = attendanceData.map(record => ({
            student_id: record.student.id,
            status: attendanceStatuses[record.student.id]?.status || 'absent',
            notes: attendanceStatuses[record.student.id]?.notes || ''
        }));

        router.post(route('attendance.store'), {
            assignment_id: selectedAssignment.id,
            date: currentDate,
            attendances: attendances
        });
    };

    const getStatusColor = (status: string) => {
        const colors = {
            present: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            sick: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            permission: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            absent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        };
        return colors[status as keyof typeof colors] || colors.absent;
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            present: 'Hadir',
            sick: 'Sakit',
            permission: 'Izin',
            absent: 'Alfa'
        };
        return labels[status as keyof typeof labels] || status;
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="✅ Input Presensi" />
                    {selectedAssignment && (
                        <a
                            href={route('attendance.show', { assignment_id: selectedAssignment.id })}
                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            📊 Lihat Rekap
                        </a>
                    )}
                </div>

                {/* Filters */}
                <div className="grid gap-4 md:grid-cols-3 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                    <div>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tanggal
                        </label>
                        <input
                            type="date"
                            className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-gray-600 dark:bg-gray-700"
                            value={currentDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                        />
                    </div>
                </div>

                {selectedAssignment && (
                    <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                📚 {selectedAssignment.subject.name} - Kelas {selectedAssignment.school_class.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tanggal: {new Date(currentDate).toLocaleDateString('id-ID')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                {attendanceData.length > 0 ? (
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
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Status Presensi
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Catatan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                                {attendanceData.map((record, index) => (
                                                    <tr key={record.student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                            {index + 1}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                            {record.student.nis}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                            {record.student.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <div className="flex gap-2">
                                                                {['present', 'sick', 'permission', 'absent'].map((status) => (
                                                                    <label key={status} className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`status-${record.student.id}`}
                                                                            value={status}
                                                                            checked={attendanceStatuses[record.student.id]?.status === status}
                                                                            onChange={() => handleStatusChange(record.student.id, status)}
                                                                            className="mr-1"
                                                                        />
                                                                        <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}>
                                                                            {getStatusLabel(status)}
                                                                        </span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <input
                                                                type="text"
                                                                placeholder="Catatan (opsional)"
                                                                className="w-full rounded border border-gray-300 px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                                                                value={attendanceStatuses[record.student.id]?.notes || ''}
                                                                onChange={(e) => handleNotesChange(record.student.id, e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="text-4xl mb-4">👥</div>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Tidak ada data siswa untuk kelas ini
                                        </p>
                                    </div>
                                )}
                            </div>

                            {attendanceData.length > 0 && (
                                <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
                                    >
                                        💾 Simpan Presensi
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {!selectedAssignment && (
                    <div className="rounded-lg bg-white p-12 shadow-md text-center dark:bg-gray-800">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Pilih Kelas dan Mata Pelajaran
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Silakan pilih kelas dan mata pelajaran untuk mulai input presensi siswa
                        </p>
                    </div>
                )}
            </div>
        </AppShell>
    );
}