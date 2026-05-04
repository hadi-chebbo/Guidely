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
        Schema::create('majors', function (Blueprint $table) {
            $table->id();

            //relationships
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            // Basic info
            $table->string('name_en');
            $table->string('name_ar');
            $table->string('slug')->unique();
            $table->text('overview');
            $table->text('description');

            // Study info
            $table->tinyInteger('duration_years')->index();
            $table->enum('difficulty_level', ['easy', 'medium', 'hard', 'very_hard']);

            // Salary range (USD)
            $table->unsignedInteger('salary_min')->index();
            $table->unsignedInteger('salary_max')->index();

            // Market demand
            $table->enum('local_demand', ['low', 'medium', 'high', 'very_high']);
            $table->enum('international_demand', ['low', 'medium', 'high', 'very_high']);

            $table->boolean('is_featured')->default(false)->index();
            $table->string('cover_image', 500)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('majors');
    }
};
