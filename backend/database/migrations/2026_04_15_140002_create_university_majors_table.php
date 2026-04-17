<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('university_majors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();
            $table->decimal('credit_price_usd', 10, 2)->nullable();
            $table->integer('total_credits')->nullable();
            $table->text('admission_requirements')->nullable();
            $table->string('language_of_instruction', 50)->default('English');
            $table->boolean('has_scholarship')->default(false);
            $table->string('campus')->nullable();
            $table->timestamps();
            $table->unique(['university_id', 'major_id']);
            $table->index('has_scholarship');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('university_majors');
    }
};
