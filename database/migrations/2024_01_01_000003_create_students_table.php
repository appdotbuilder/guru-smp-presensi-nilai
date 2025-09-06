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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Student full name');
            $table->string('nis', 20)->unique()->comment('Student identification number');
            $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->date('birth_date')->nullable()->comment('Birth date');
            $table->enum('gender', ['male', 'female'])->comment('Student gender');
            $table->text('address')->nullable()->comment('Student address');
            $table->timestamps();
            
            $table->index('nis');
            $table->index('class_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};