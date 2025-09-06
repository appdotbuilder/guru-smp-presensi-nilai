<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grade = fake()->randomElement(['7', '8', '9']);
        $class = fake()->randomElement(['A', 'B', 'C', 'D']);
        
        return [
            'name' => $grade . $class,
            'grade' => $grade,
            'academic_year' => 2024,
        ];
    }
}