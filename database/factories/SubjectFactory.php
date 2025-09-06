<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = [
            'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'IPA', 'IPS',
            'Pendidikan Agama', 'PKn', 'Seni Budaya', 'Penjaskes', 'TIK'
        ];

        $subject = fake()->randomElement($subjects);
        
        return [
            'name' => $subject,
            'code' => strtoupper(substr($subject, 0, 3)) . fake()->unique()->numberBetween(100, 999),
            'description' => fake()->sentence(),
        ];
    }
}