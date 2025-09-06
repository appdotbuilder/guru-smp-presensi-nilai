<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Grade>
 */
class GradeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'subject_id' => Subject::factory(),
            'class_id' => SchoolClass::factory(),
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['daily', 'midterm', 'final']),
            'score' => fake()->randomFloat(2, 60, 100),
            'description' => fake()->optional()->sentence(),
            'date' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Indicate that the grade is a daily grade.
     */
    public function daily(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'daily',
        ]);
    }

    /**
     * Indicate that the grade is a midterm grade.
     */
    public function midterm(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'midterm',
        ]);
    }

    /**
     * Indicate that the grade is a final grade.
     */
    public function final(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'final',
        ]);
    }
}