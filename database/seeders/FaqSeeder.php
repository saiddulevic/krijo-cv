<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Default FAQ entries in Albanian, English, Italian, German and Spanish.
     * On an empty table all are created; on an existing site only missing
     * English/Italian/German/Spanish
     * translations of the default entries are filled in, so the owner's edits
     * and deletions are never overwritten.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'A është Krijo CV falas?',
                'answer' => 'Po, plotësisht falas. Nuk kërkohet regjistrim, abonim apo pagesë dhe CV-ja e shkarkuar nuk ka reklama apo shenja uji.',
                'question_en' => 'Is Krijo CV free?',
                'answer_en' => 'Yes, completely free. No sign-up, subscription or payment is required and the downloaded CV has no ads or watermarks.',
                'question_it' => 'Krijo CV è gratuito?',
                'answer_it' => 'Sì, completamente gratuito. Non servono registrazione, abbonamento o pagamento e il CV scaricato non ha pubblicità né filigrane.',
            ],
            [
                'question' => 'Ku ruhen të dhënat e mia?',
                'answer' => 'Të dhënat e CV-së dhe fotoja mbeten në shfletuesin tënd dhe nuk dërgohen në server. Nëse aktivizon „Ruaj automatikisht në këtë pajisje”, projekti ruhet vetëm në hapësirën lokale të këtij shfletuesi.',
                'question_en' => 'Where is my data stored?',
                'answer_en' => 'Your CV data and photo stay in your browser and are not sent to the server. If you turn on “Save automatically on this device”, the project is stored only in this browser’s local storage.',
                'question_it' => 'Dove vengono salvati i miei dati?',
                'answer_it' => 'I dati del CV e la foto restano nel tuo browser e non vengono inviati al server. Se attivi “Salva automaticamente su questo dispositivo”, il progetto viene salvato solo nella memoria locale di questo browser.',
            ],
            [
                'question' => 'Si mund të vazhdoj punën në një pajisje tjetër?',
                'answer' => 'Shkarko projektin me butonin „Ruaj projektin” (skedar .cv.json) dhe importoje në pajisjen tjetër me „Importo projekt”. Projektet nuk sinkronizohen online, prandaj ruaje skedarin.',
                'question_en' => 'How can I continue on another device?',
                'answer_en' => 'Download the project with the “Save project” button (a .cv.json file) and import it on the other device with “Import project”. Projects are not synchronised online, so keep the file.',
                'question_it' => 'Come posso continuare su un altro dispositivo?',
                'answer_it' => 'Scarica il progetto con il pulsante “Salva progetto” (un file .cv.json) e importalo sull’altro dispositivo con “Importa progetto”. I progetti non si sincronizzano online, quindi conserva il file.',
            ],
            [
                'question' => 'Çfarë formati ka CV-ja e shkarkuar?',
                'answer' => 'PDF në format A4 me tekst të përzgjedhshëm dhe të kërkueshëm, lidhje të klikueshme për email, telefon dhe portofol, dhe fonte që mbështesin shkronjat ë dhe ç.',
                'question_en' => 'What format is the downloaded CV?',
                'answer_en' => 'A4 PDF with selectable, searchable text, clickable links for email, phone and portfolio, and fonts that support letters such as ë and ç.',
                'question_it' => 'Che formato ha il CV scaricato?',
                'answer_it' => 'PDF in formato A4 con testo selezionabile e ricercabile, link cliccabili per email, telefono e portfolio e caratteri che supportano lettere come ë e ç.',
            ],
            [
                'question' => 'A mund ta ndryshoj modelin pasi kam plotësuar të dhënat?',
                'answer' => 'Po. Ndryshimi i modelit nuk fshin asgjë: të gjitha të dhënat, fotoja dhe ngjyra e theksit ruhen dhe shfaqen në modelin e ri.',
                'question_en' => 'Can I change the template after filling in my data?',
                'answer_en' => 'Yes. Changing the template deletes nothing: all your data, the photo and the accent colour are kept and shown in the new template.',
                'question_it' => 'Posso cambiare modello dopo aver compilato i dati?',
                'answer_it' => 'Sì. Cambiare modello non cancella nulla: tutti i dati, la foto e il colore di accento vengono conservati e mostrati nel nuovo modello.',
            ],
            [
                'question' => 'A duhet të jap datëlindjen apo adresën e plotë?',
                'answer' => 'Jo. Krijo CV nuk kërkon datëlindje, gjini, numër personal apo adresë të plotë. Qyteti dhe shteti janë të mjaftueshëm për një CV moderne.',
                'question_en' => 'Do I have to give my date of birth or full address?',
                'answer_en' => 'No. Krijo CV does not ask for a date of birth, gender, personal ID number or full address. City and country are enough for a modern CV.',
                'question_it' => 'Devo indicare data di nascita o indirizzo completo?',
                'answer_it' => 'No. Krijo CV non richiede data di nascita, genere, codice personale o indirizzo completo. Città e paese bastano per un CV moderno.',
            ],
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
                'answer' => 'Ndërfaqja dhe dokumenti janë në shqip, anglisht, italisht, gjermanisht dhe spanjisht. Gjuha e CV-së zgjidhet në hapin e parë dhe përkthen titujt e seksioneve dhe etiketat në PDF; tekstet që shkruan ti mbeten siç janë.',
                'question_en' => 'Which languages can I create my CV in?',
                'answer_en' => 'The interface and the document are available in Albanian, English, Italian, German and Spanish. The CV language is chosen in the first step and translates the section headings and labels in the PDF; the text you write stays as you typed it.',
                'question_it' => 'In quali lingue posso creare il CV?',
                'answer_it' => 'L’interfaccia e il documento sono disponibili in albanese, inglese, italiano, tedesco e spagnolo. La lingua del CV si sceglie al primo passo e traduce i titoli delle sezioni e le etichette nel PDF; i testi che scrivi restano come li hai digitati.',
            ],
        ];

        $extra = require database_path('seeders/data/translations_de_es.php');

        $hasFaqs = Faq::query()->exists();

        foreach ($faqs as $index => $faq) {
            $faq = [...$faq, ...($extra['faqs'][$faq['question']] ?? [])];

            if (! $hasFaqs) {
                Faq::query()->create([...$faq, 'sort_order' => $index + 1, 'is_published' => true]);

                continue;
            }

            $existing = Faq::query()->where('question', $faq['question'])->first();

            if ($existing === null) {
                continue;
            }

            foreach (['question_en', 'answer_en', 'question_it', 'answer_it', 'question_de', 'answer_de', 'question_es', 'answer_es'] as $field) {
                if (blank($existing->{$field}) && filled($faq[$field] ?? null)) {
                    $existing->{$field} = $faq[$field];
                }
            }

            $existing->save();
        }
    }
}
