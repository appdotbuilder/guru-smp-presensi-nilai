<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\TeacherClassSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $teacher = $request->user();
        
        // Get teacher's class-subject assignments
        $assignments = TeacherClassSubject::with(['schoolClass', 'subject'])
            ->where('user_id', $teacher->id)
            ->where('academic_year', 2024)
            ->get();

        // Get selected assignment if any
        $selectedAssignment = null;
        $attendanceData = collect();
        
        if ($request->has('assignment_id')) {
            $selectedAssignment = $assignments->find($request->assignment_id);
            
            if ($selectedAssignment) {
                $students = Student::where('class_id', $selectedAssignment->class_id)
                    ->orderBy('name')
                    ->get();

                $date = $request->get('date', now()->format('Y-m-d'));
                
                $attendanceData = $students->map(function ($student) use ($selectedAssignment, $date) {
                    $attendance = Attendance::where([
                        'student_id' => $student->id,
                        'subject_id' => $selectedAssignment->subject_id,
                        'class_id' => $selectedAssignment->class_id,
                        'date' => $date,
                    ])->first();

                    return [
                        'student' => $student,
                        'attendance' => $attendance,
                        'status' => $attendance->status ?? null,
                    ];
                });
            }
        }

        return Inertia::render('attendance/index', [
            'assignments' => $assignments,
            'selectedAssignment' => $selectedAssignment,
            'attendanceData' => $attendanceData,
            'selectedDate' => $request->get('date', now()->format('Y-m-d')),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {


        $assignment = TeacherClassSubject::findOrFail($request->assignment_id);
        
        // Verify teacher owns this assignment
        if ($assignment->user_id !== $request->user()->id) {
            abort(403);
        }

        foreach ($request->attendances as $attendanceData) {
            Attendance::updateOrCreate([
                'student_id' => $attendanceData['student_id'],
                'subject_id' => $assignment->subject_id,
                'class_id' => $assignment->class_id,
                'date' => $request->date,
            ], [
                'user_id' => $request->user()->id,
                'status' => $attendanceData['status'],
                'notes' => $attendanceData['notes'] ?? null,
            ]);
        }

        return redirect()->back()->with('success', 'Presensi berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $teacher = $request->user();
        $assignmentId = $request->get('assignment_id');
        
        if (!$assignmentId) {
            return redirect()->route('attendance.index');
        }

        $assignment = TeacherClassSubject::with(['schoolClass', 'subject'])
            ->where('id', $assignmentId)
            ->where('user_id', $teacher->id)
            ->firstOrFail();

        $students = Student::where('class_id', $assignment->class_id)
            ->orderBy('name')
            ->get();

        // Get attendance summary for the last 30 days
        $attendanceSummary = $students->map(function ($student) use ($assignment) {
            $attendances = Attendance::where([
                'student_id' => $student->id,
                'subject_id' => $assignment->subject_id,
                'class_id' => $assignment->class_id,
            ])
            ->where('date', '>=', now()->subDays(30))
            ->get();

            return [
                'student' => $student,
                'total' => $attendances->count(),
                'present' => $attendances->where('status', 'present')->count(),
                'sick' => $attendances->where('status', 'sick')->count(),
                'permission' => $attendances->where('status', 'permission')->count(),
                'absent' => $attendances->where('status', 'absent')->count(),
                'percentage' => $attendances->count() > 0 
                    ? round(($attendances->where('status', 'present')->count() / $attendances->count()) * 100, 2)
                    : 0,
            ];
        });

        return Inertia::render('attendance/summary', [
            'assignment' => $assignment,
            'attendanceSummary' => $attendanceSummary,
        ]);
    }
}