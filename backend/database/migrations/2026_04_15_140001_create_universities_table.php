<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name_en');
            $table->string('name_ar')->nullable();
            $table->string('slug')->unique();
            $table->enum('type', ['public', 'private']);
            $table->string('location');
            $table->string('website', 500)->nullable();
            $table->string('logo_url', 500)->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->integer('founded_year')->nullable();
            $table->string('accreditation')->nullable();
            $table->timestamps();
            $table->index('type');
            $table->index('location');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
