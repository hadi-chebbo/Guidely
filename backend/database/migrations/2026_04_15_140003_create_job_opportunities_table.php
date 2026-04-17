<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();
            $table->string('title_en');
            $table->string('title_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->integer('avg_salary_usd')->nullable();
            $table->enum('scope', ['local', 'international', 'both']);
            $table->enum('demand_level', ['low', 'medium', 'high']);
            $table->timestamps();
            $table->index('scope');
            $table->index('demand_level');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_opportunities');
    }
};
