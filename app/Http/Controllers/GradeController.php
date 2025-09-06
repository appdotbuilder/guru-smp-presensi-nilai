<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGradeRequest;
use App\Models\Grade;
use App\Models\Student;
use App\Models\TeacherClassSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeController extends Controller
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
        $gradeData = collect();
        
        if ($request->has('assignment_id')) {
            $selectedAssignment = $assignments->find($request->assignment_id);
            
            if ($selectedAssignment) {
                $students = Student::where('class_id', $selectedAssignment->class_id)
                    ->orderBy('name')
                    ->get();

                $gradeData = $students->map(function ($student) use ($selectedAssignment) {
                    $grades = Grade::where([
                        'student_id' => $student->id,
                        'subject_id' => $selectedAssignment->subject_id,
                        'class_id' => $selectedAssignment->class_id,
                    ])->get();

                    $dailyGrades = $grades->where('type', 'daily');
                    $midtermGrade = $grades->where('type', 'midterm')->first();
                    $finalGrade = $grades->where('type', 'final')->first();

                    // Calculate final score (equal weights)
                    $dailyAverage = $dailyGrades->count() > 0 ? $dailyGrades->avg('score') : null;
                    $midtermScore = $midtermGrade?->score;
                    $finalScore = $finalGrade?->score;

                    $finalCalculatedScore = null;
                    $scoresCount = 0;
                    $totalScore = 0;

                    if ($dailyAverage !== null) {
                        $totalScore += $dailyAverage;
                        $scoresCount++;
                    }
                    if ($midtermScore !== null) {
                        $totalScore += $midtermScore;
                        $scoresCount++;
                    }
                    if ($finalScore !== null) {
                        $totalScore += $finalScore;
                        $scoresCount++;
                    }

                    if ($scoresCount > 0) {
                        $finalCalculatedScore = round($totalScore / $scoresCount, 2);
                    }

                    return [
                        'student' => $student,
                        'daily_grades' => $dailyGrades->values(),
                        'daily_average' => $dailyAverage ? round($dailyAverage, 2) : null,
                        'midterm_grade' => $midtermGrade,
                        'final_grade' => $finalGrade,
                        'final_score' => $finalCalculatedScore,
                    ];
                });
            }
        }

        return Inertia::render('grades/index', [
            'assignments' => $assignments,
            'selectedAssignment' => $selectedAssignment,
            'gradeData' => $gradeData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $teacher = $request->user();
        $assignmentId = $request->get('assignment_id');
        $gradeType = $request->get('type', 'daily');
        
        if (!$assignmentId) {
            return redirect()->route('grades.index');
        }

        $assignment = TeacherClassSubject::with(['schoolClass', 'subject'])
            ->where('id', $assignmentId)
            ->where('user_id', $teacher->id)
            ->firstOrFail();

        $students = Student::where('class_id', $assignment->class_id)
            ->orderBy('name')
            ->get();

        return Inertia::render('grades/create', [
            'assignment' => $assignment,
            'students' => $students,
            'gradeType' => $gradeType,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGradeRequest $request)
    {


        $assignment = TeacherClassSubject::findOrFail($request->assignment_id);
        
        // Verify teacher owns this assignment
        if ($assignment->user_id !== $request->user()->id) {
            abort(403);
        }

        foreach ($request->grades as $gradeData) {
            Grade::create([
                'student_id' => $gradeData['student_id'],
                'subject_id' => $assignment->subject_id,
                'class_id' => $assignment->class_id,
                'user_id' => $request->user()->id,
                'type' => $request->type,
                'score' => $gradeData['score'],
                'description' => $request->description,
                'date' => $request->date,
            ]);
        }

        return redirect()->route('grades.index', ['assignment_id' => $assignment->id])
            ->with('success', 'Nilai berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $teacher = $request->user();
        $assignmentId = $request->get('assignment_id');
        
        if (!$assignmentId) {
            return redirect()->route('grades.index');
        }

        $assignment = TeacherClassSubject::with(['schoolClass', 'subject'])
            ->where('id', $assignmentId)
            ->where('user_id', $teacher->id)
            ->firstOrFail();

        $students = Student::where('class_id', $assignment->class_id)
            ->orderBy('name')
            ->get();

        // Get comprehensive grade summary
        $gradeSummary = $students->map(function ($student) use ($assignment) {
            $grades = Grade::where([
                'student_id' => $student->id,
                'subject_id' => $assignment->subject_id,
                'class_id' => $assignment->class_id,
            ])->orderBy('date')->get();

            $dailyGrades = $grades->where('type', 'daily');
            $midtermGrade = $grades->where('type', 'midterm')->first();
            $finalGrade = $grades->where('type', 'final')->first();

            // Calculate final score
            $dailyAverage = $dailyGrades->count() > 0 ? $dailyGrades->avg('score') : null;
            $midtermScore = $midtermGrade?->score;
            $finalScore = $finalGrade?->score;

            $finalCalculatedScore = null;
            $scoresCount = 0;
            $totalScore = 0;

            if ($dailyAverage !== null) {
                $totalScore += $dailyAverage;
                $scoresCount++;
            }
            if ($midtermScore !== null) {
                $totalScore += $midtermScore;
                $scoresCount++;
            }
            if ($finalScore !== null) {
                $totalScore += $finalScore;
                $scoresCount++;
            }

            if ($scoresCount > 0) {
                $finalCalculatedScore = round($totalScore / $scoresCount, 2);
            }

            return [
                'student' => $student,
                'daily_grades' => $dailyGrades->values(),
                'daily_average' => $dailyAverage ? round($dailyAverage, 2) : null,
                'midterm_grade' => $midtermGrade,
                'final_grade' => $finalGrade,
                'final_score' => $finalCalculatedScore,
                'all_grades' => $grades->values(),
            ];
        });

        return Inertia::render('grades/summary', [
            'assignment' => $assignment,
            'gradeSummary' => $gradeSummary,
        ]);
    }
}