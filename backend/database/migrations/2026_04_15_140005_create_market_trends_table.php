<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_trends', function (Blueprint $table) {
            $table->id();
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();
            $table->integer('year');
            $table->integer('demand_score');
            $table->integer('avg_starting_salary_usd')->nullable();
            $table->decimal('employment_rate', 5, 2)->nullable();
            $table->json('top_sectors')->nullable();
            $table->string('source')->nullable();
            $table->timestamps();
            $table->unique(['major_id', 'year']);
            $table->index('year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_trends');
    }
};
