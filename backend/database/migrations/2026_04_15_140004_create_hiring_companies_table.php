<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hiring_companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();
            $table->string('company_name');
            $table->string('industry')->nullable();
            $table->string('location');
            $table->string('logo_url', 500)->nullable();
            $table->string('website_url', 500)->nullable();
            $table->boolean('is_local')->default(true);
            $table->timestamps();
            $table->index('major_id');
            $table->index('is_local');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hiring_companies');
    }
};
