<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'nis' => fake()->unique()->numerify('##########'),
            'class_id' => SchoolClass::factory(),
            'birth_date' => fake()->dateTimeBetween('-17 years', '-12 years'),
            'gender' => fake()->randomElement(['male', 'female']),
            'address' => fake()->address(),
        ];
    }
}