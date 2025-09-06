<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\TeacherClassSubject;
use App\Models\User;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create teachers
        $teachers = User::factory(3)->create([
            'name' => fake()->name() . ' (Guru)',
        ]);

        // Create subjects
        $subjects = collect([
            ['name' => 'Matematika', 'code' => 'MTK101'],
            ['name' => 'Bahasa Indonesia', 'code' => 'BIN102'],
            ['name' => 'Bahasa Inggris', 'code' => 'BIG103'],
            ['name' => 'IPA', 'code' => 'IPA104'],
            ['name' => 'IPS', 'code' => 'IPS105'],
            ['name' => 'Pendidikan Agama', 'code' => 'PAI106'],
        ])->map(function ($subject) {
            return Subject::create($subject);
        });

        // Create classes
        $classes = collect(['7A', '7B', '8A', '8B', '9A', '9B'])->map(function ($className) {
            $grade = substr($className, 0, 1);
            return SchoolClass::create([
                'name' => $className,
                'grade' => $grade,
                'academic_year' => 2024,
            ]);
        });

        // Create students for each class
        $students = collect();
        $classes->each(function ($class) use (&$students) {
            $classStudents = Student::factory(25)->create([
                'class_id' => $class->id,
            ]);
            $students = $students->merge($classStudents);
        });

        // Assign teachers to class-subject combinations
        $teacherClassSubjects = collect();
        $classes->each(function ($class) use ($teachers, $subjects, &$teacherClassSubjects) {
            $subjects->take(3)->each(function ($subject) use ($class, $teachers, &$teacherClassSubjects) {
                $teacher = $teachers->random();
                $assignment = TeacherClassSubject::create([
                    'user_id' => $teacher->id,
                    'class_id' => $class->id,
                    'subject_id' => $subject->id,
                    'academic_year' => 2024,
                ]);
                $teacherClassSubjects->push($assignment);
            });
        });

        // Create attendance records for the last 30 days
        $teacherClassSubjects->each(function ($assignment) use ($students) {
            $classStudents = $students->where('class_id', $assignment->class_id);
            
            // Create attendance for last 15 days
            for ($i = 1; $i <= 15; $i++) {
                $date = now()->subDays($i);
                
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                $classStudents->each(function ($student) use ($assignment, $date) {
                    Attendance::create([
                        'student_id' => $student->id,
                        'subject_id' => $assignment->subject_id,
                        'class_id' => $assignment->class_id,
                        'user_id' => $assignment->user_id,
                        'date' => $date,
                        'status' => fake()->randomElement(['present', 'present', 'present', 'sick', 'permission', 'absent']),
                        'notes' => fake()->optional(0.2)->sentence(),
                    ]);
                });
            }
        });

        // Create grades
        $teacherClassSubjects->each(function ($assignment) use ($students) {
            $classStudents = $students->where('class_id', $assignment->class_id);
            
            $classStudents->each(function ($student) use ($assignment) {
                // Daily grades (3-5 per student)
                Grade::factory(random_int(3, 5))->create([
                    'student_id' => $student->id,
                    'subject_id' => $assignment->subject_id,
                    'class_id' => $assignment->class_id,
                    'user_id' => $assignment->user_id,
                    'type' => 'daily',
                    'date' => fake()->dateTimeBetween('-30 days', '-7 days'),
                ]);

                // Midterm grade
                Grade::factory()->create([
                    'student_id' => $student->id,
                    'subject_id' => $assignment->subject_id,
                    'class_id' => $assignment->class_id,
                    'user_id' => $assignment->user_id,
                    'type' => 'midterm',
                    'date' => now()->subDays(random_int(20, 25)),
                ]);

                // Final grade (optional - some might not have it yet)
                if (fake()->boolean(60)) {
                    Grade::factory()->create([
                        'student_id' => $student->id,
                        'subject_id' => $assignment->subject_id,
                        'class_id' => $assignment->class_id,
                        'user_id' => $assignment->user_id,
                        'type' => 'final',
                        'date' => now()->subDays(random_int(1, 10)),
                    ]);
                }
            });
        });
    }
}