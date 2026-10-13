<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the two FAQ entries about the cover letter and the document languages
 * to sites that already have FAQ entries. On a fresh installation the table is
 * still empty when this runs and FaqSeeder creates every default entry.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('faqs') || DB::table('faqs')->count() === 0) {
            return;
        }

        $next = ((int) DB::table('faqs')->max('sort_order')) + 1;
        $now = now();

        $entries = [
            [
                'question' => 'A mund të shkruaj edhe një letër motivimi?',
                'answer' => 'Po. Hapi „Letra” të lejon të shkruash letrën e motivimit në të njëjtin projekt. Ajo merr emrin, kontaktet, ngjyrën dhe fontin e CV-së dhe shkarkohet si PDF më vete.',
                'question_en' => 'Can I also write a cover letter?',
                'answer_en' => 'Yes. The “Letter” step lets you write a cover letter in the same project. It picks up the name, contacts, colour and font of your CV and downloads as a separate PDF.',
                'question_it' => 'Posso scrivere anche una lettera di presentazione?',
                'answer_it' => 'Sì. Il passo “Lettera” ti permette di scrivere la lettera di presentazione nello stesso progetto. Prende nome, contatti, colore e carattere del CV e si scarica come PDF separato.',
            ],
            [
                'question' => 'Në cilat gjuhë mund ta krijoj CV-në?',
                'answer' => 'Ndërfaqja dhe dokumenti janë në shqip, anglisht dhe italisht. Gjuha e CV-së zgjidhet në hapin e parë dhe përkthen titujt e seksioneve dhe etiketat në PDF; tekstet që shkruan ti mbeten siç janë.',
                'question_en' => 'Which languages can I create my CV in?',
                'answer_en' => 'The interface and the document are available in Albanian, English and Italian. The CV language is chosen in the first step and translates the section headings and labels in the PDF; the text you write stays as you typed it.',
                'question_it' => 'In quali lingue posso creare il CV?',
                'answer_it' => 'L’interfaccia e il documento sono disponibili in albanese, inglese e italiano. La lingua del CV si sceglie al primo passo e traduce i titoli delle sezioni e le etichette nel PDF; i testi che scrivi restano come li hai digitati.',
            ],
        ];

        foreach ($entries as $entry) {
            if (DB::table('faqs')->where('question', $entry['question'])->exists()) {
                continue;
            }

            DB::table('faqs')->insert([
                ...$entry,
                'sort_order' => $next++,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('faqs')) {
            DB::table('faqs')->whereIn('question', [
                'A mund të shkruaj edhe një letër motivimi?',
                'Në cilat gjuhë mund ta krijoj CV-në?',
            ])->delete();
        }
    }
};
