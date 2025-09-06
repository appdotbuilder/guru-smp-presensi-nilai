<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\GradeController;
use App\Models\Attendance;
use App\Models\Grade;
use App\Models\Student;
use App\Models\TeacherClassSubject;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = request()->user();
        
        // Get teacher's class-subject assignments
        $teacherAssignments = TeacherClassSubject::with(['schoolClass', 'subject'])
            ->where('user_id', $user->id)
            ->where('academic_year', 2024)
            ->get();

        // Get today's attendance count
        $todayAttendanceCount = Attendance::where('user_id', $user->id)
            ->where('date', today())
            ->count();

        // Get total students taught by this teacher
        $classIds = $teacherAssignments->pluck('class_id')->unique();
        $totalStudents = Student::whereIn('class_id', $classIds)->count();

        // Get recent grades count (last 7 days)
        $recentGrades = Grade::where('user_id', $user->id)
            ->where('date', '>=', now()->subDays(7))
            ->count();

        return Inertia::render('dashboard', [
            'teacherAssignments' => $teacherAssignments,
            'todayAttendanceCount' => $todayAttendanceCount,
            'totalStudents' => $totalStudents,
            'recentGrades' => $recentGrades,
        ]);
    })->name('dashboard');

    // Attendance routes
    Route::controller(AttendanceController::class)->group(function () {
        Route::get('/attendance', 'index')->name('attendance.index');
        Route::post('/attendance', 'store')->name('attendance.store');
        Route::get('/attendance/summary', 'show')->name('attendance.show');
    });

    // Grades routes
    Route::controller(GradeController::class)->group(function () {
        Route::get('/grades', 'index')->name('grades.index');
        Route::get('/grades/create', 'create')->name('grades.create');
        Route::post('/grades', 'store')->name('grades.store');
        Route::get('/grades/summary', 'show')->name('grades.show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
