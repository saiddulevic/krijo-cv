<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Optional German and Spanish versions of owner-managed texts (empty values
 * fall back to the Albanian original) and the five-language wording of the
 * default "which languages" FAQ answer, updated only where it is unchanged.
 */
return new class extends Migration
{
    private const LANGUAGES_FAQ = 'Në cilat gjuhë mund ta krijoj CV-në?';

    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->string('question_de')->nullable()->after('answer_it');
            $table->text('answer_de')->nullable()->after('question_de');
            $table->string('question_es')->nullable()->after('answer_de');
            $table->text('answer_es')->nullable()->after('question_es');
        });

        Schema::table('cv_templates', function (Blueprint $table) {
            $table->string('name_de')->nullable()->after('name_it');
            $table->string('name_es')->nullable()->after('name_de');
            $table->text('description_de')->nullable()->after('description_it');
            $table->text('description_es')->nullable()->after('description_de');
        });

        $this->updateLanguagesAnswer(
            'Ndërfaqja dhe dokumenti janë në shqip, anglisht dhe italisht.',
            'Ndërfaqja dhe dokumenti janë në shqip, anglisht, italisht, gjermanisht dhe spanjisht.',
            'answer',
        );
        $this->updateLanguagesAnswer(
            'The interface and the document are available in Albanian, English and Italian.',
            'The interface and the document are available in Albanian, English, Italian, German and Spanish.',
            'answer_en',
        );
        $this->updateLanguagesAnswer(
            'L’interfaccia e il documento sono disponibili in albanese, inglese e italiano.',
            'L’interfaccia e il documento sono disponibili in albanese, inglese, italiano, tedesco e spagnolo.',
            'answer_it',
        );
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropColumn(['question_de', 'answer_de', 'question_es', 'answer_es']);
        });

        Schema::table('cv_templates', function (Blueprint $table) {
            $table->dropColumn(['name_de', 'name_es', 'description_de', 'description_es']);
        });
    }

    /** Replaces the old sentence inside the answer only if it is still there. */
    private function updateLanguagesAnswer(string $old, string $new, string $column): void
    {
        $faq = DB::table('faqs')->where('question', self::LANGUAGES_FAQ)->first();

        if ($faq === null || ! is_string($faq->{$column} ?? null) || ! str_contains($faq->{$column}, $old)) {
            return;
        }

        DB::table('faqs')->where('id', $faq->id)->update([
            $column => str_replace($old, $new, $faq->{$column}),
            'updated_at' => now(),
        ]);
    }
};
