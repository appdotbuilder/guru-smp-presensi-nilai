<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Class name (e.g., 7A, 8B, 9C)');
            $table->string('grade', 5)->comment('Grade level (7, 8, 9)');
            $table->integer('academic_year')->comment('Academic year');
            $table->timestamps();
            
            $table->index(['grade', 'academic_year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};