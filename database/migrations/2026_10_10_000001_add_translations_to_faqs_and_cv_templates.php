<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Optional English and Italian versions of owner-managed texts. Empty values
 * fall back to the Albanian original.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->string('question_en')->nullable()->after('answer');
            $table->text('answer_en')->nullable()->after('question_en');
            $table->string('question_it')->nullable()->after('answer_en');
            $table->text('answer_it')->nullable()->after('question_it');
        });

        Schema::table('cv_templates', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->string('name_it')->nullable()->after('name_en');
            $table->text('description_en')->nullable()->after('description');
            $table->text('description_it')->nullable()->after('description_en');
        });
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn(['question_en', 'answer_en', 'question_it', 'answer_it']);
        });

        Schema::table('cv_templates', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'name_it', 'description_en', 'description_it']);
        });
    }
};
