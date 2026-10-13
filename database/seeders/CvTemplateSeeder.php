<?php

namespace Database\Seeders;

use App\Models\CvTemplate;
use Illuminate\Database\Seeder;

class CvTemplateSeeder extends Seeder
{
    /**
     * Seeds the 15 templates as enabled with Albanian, English, Italian,
     * German and Spanish names and descriptions. Existing rows keep the owner's edits: only
     * missing templates are inserted and only empty translations are filled.
     */
    public function run(): void
    {
        $templates = [
            [
                'slug' => 'minimal',
                'name' => 'Minimal', 'name_en' => 'Minimal', 'name_it' => 'Minimal',
                'description' => 'Një kolonë, bardhë e zi, emër i madh dhe ndarës të thjeshtë mes seksioneve.',
                'description_en' => 'Single column, black and white, large name and simple dividers between sections.',
                'description_it' => 'Una colonna, bianco e nero, nome grande e semplici divisori tra le sezioni.',
            ],
            [
                'slug' => 'modern',
                'name' => 'Modern', 'name_en' => 'Modern', 'name_it' => 'Moderno',
                'description' => 'Shirit anësor majtas për kontaktet dhe aftësitë, përmbajtja kryesore djathtas.',
                'description_en' => 'Left sidebar for contacts and skills, main content on the right.',
                'description_it' => 'Barra laterale a sinistra per contatti e competenze, contenuto principale a destra.',
            ],
            [
                'slug' => 'professional',
                'name' => 'Profesional', 'name_en' => 'Professional', 'name_it' => 'Professionale',
                'description' => 'Kokë e plotë në krye, më pas dy kolona 65/35 për përvojën dhe detajet.',
                'description_en' => 'Full-width header followed by a 65/35 two-column layout for experience and details.',
                'description_it' => 'Intestazione a tutta larghezza seguita da due colonne 65/35 per esperienza e dettagli.',
            ],
            [
                'slug' => 'executive',
                'name' => 'Ekzekutiv', 'name_en' => 'Executive', 'name_it' => 'Dirigente',
                'description' => 'Një kolonë me tipografi serif, hapësirë bujare dhe theks te përvoja profesionale.',
                'description_en' => 'Single column with serif typography, generous spacing and emphasis on professional experience.',
                'description_it' => 'Una colonna con tipografia serif, spaziatura generosa e risalto all’esperienza professionale.',
            ],
            [
                'slug' => 'creative',
                'name' => 'Kreativ', 'name_en' => 'Creative', 'name_it' => 'Creativo',
                'description' => 'Foto rrethore në kokë, blloqe të dallueshme përmbajtjeje dhe aftësi në rrjet kompakt.',
                'description_en' => 'Circular photo in the header, distinct content blocks and skills in a compact grid.',
                'description_it' => 'Foto circolare nell’intestazione, blocchi di contenuto distinti e competenze in una griglia compatta.',
            ],
            [
                'slug' => 'academic',
                'name' => 'Akademik', 'name_en' => 'Academic', 'name_it' => 'Accademico',
                'description' => 'Arsimi në fillim, më pas kërkimi, publikimet dhe përvoja profesionale.',
                'description_en' => 'Education first, followed by research, publications and professional experience.',
                'description_it' => 'Prima la formazione, poi ricerca, pubblicazioni ed esperienza professionale.',
            ],
            [
                'slug' => 'student',
                'name' => 'Student', 'name_en' => 'Student', 'name_it' => 'Studente',
                'description' => 'Përmbledhje, arsim, projekte, praktika, vullnetarizëm dhe aftësi, në këtë radhë.',
                'description_en' => 'Summary, education, projects, internships, volunteering and skills, in that order.',
                'description_it' => 'Profilo, formazione, progetti, tirocini, volontariato e competenze, in questo ordine.',
            ],
            [
                'slug' => 'technology',
                'name' => 'Teknologji', 'name_en' => 'Technology', 'name_it' => 'Tecnologia',
                'description' => 'Projekte dhe lidhje portofoli në pah, aftësi teknike të grupuara dhe përvojë e qartë.',
                'description_en' => 'Prominent projects and portfolio links, grouped technical skills and clear experience.',
                'description_it' => 'Progetti e link al portfolio in evidenza, competenze tecniche raggruppate ed esperienza chiara.',
            ],
            [
                'slug' => 'european',
                'name' => 'Evropian', 'name_en' => 'European', 'name_it' => 'Europeo',
                'description' => 'Datat dhe emërtimet në kolonën e ngushtë majtas, përshkrimet në kolonën e gjerë djathtas.',
                'description_en' => 'Dates and section labels in a narrow left column, descriptions in a wider right column.',
                'description_it' => 'Date ed etichette delle sezioni nella colonna stretta a sinistra, descrizioni nella colonna larga a destra.',
            ],
            [
                'slug' => 'compact',
                'name' => 'Kompakt', 'name_en' => 'Compact', 'name_it' => 'Compatto',
                'description' => 'Hapësira efikase për CV më të shkurtra; vazhdon në faqe shtesë kur përmbajtja është e gjatë.',
                'description_en' => 'Efficient spacing for shorter CVs; continues onto extra pages when the content is long.',
                'description_it' => 'Spaziatura efficiente per CV più brevi; continua su pagine aggiuntive quando il contenuto è lungo.',
            ],
            [
                'slug' => 'elegant',
                'name' => 'Elegant', 'name_en' => 'Elegant', 'name_it' => 'Elegante',
                'description' => 'Panel me ngjyrë në të majtë me foto rrethore, kontakte me ikona dhe aftësi; emër serif dhe tituj me vija theksi.',
                'description_en' => 'Coloured left panel with a round photo, contacts with icons and skills; serif name and headings with accent bars.',
                'description_it' => 'Pannello colorato a sinistra con foto rotonda, contatti con icone e competenze; nome serif e titoli con barre di accento.',
            ],
            [
                'slug' => 'timeline',
                'name' => 'Kronologjik', 'name_en' => 'Timeline', 'name_it' => 'Cronologico',
                'description' => 'Përvoja dhe arsimi mbi një vijë kohore vertikale me pika, kontakte me ikona dhe aftësi si etiketa.',
                'description_en' => 'Experience and education on a vertical timeline with dots, contacts with icons and skills as tags.',
                'description_it' => 'Esperienza e formazione su una linea temporale verticale con punti, contatti con icone e competenze come etichette.',
            ],
            [
                'slug' => 'bold',
                'name' => 'Guximtar', 'name_en' => 'Bold', 'name_it' => 'Audace',
                'description' => 'Kokë e errët në gjithë gjerësinë me shirit theksi, tituj si etiketa me ngjyrë dhe shirita niveli për gjuhët.',
                'description_en' => 'Full-width dark header with an accent stripe, coloured label headings and level bars for languages.',
                'description_it' => 'Intestazione scura a tutta larghezza con striscia di accento, titoli a etichetta colorata e barre di livello per le lingue.',
            ],
            [
                'slug' => 'duotone',
                'name' => 'Dyngjyrësh', 'name_en' => 'Duotone', 'name_it' => 'Bicolore',
                'description' => 'Kokë e ndarë në dy blloqe ngjyrash, vija të shkurtra theksi nën tituj dhe shirita niveli për aftësitë.',
                'description_en' => 'Header split into two colour blocks, short accent bars under headings and level bars for skills.',
                'description_it' => 'Intestazione divisa in due blocchi di colore, brevi barre di accento sotto i titoli e barre di livello per le competenze.',
            ],
            [
                'slug' => 'monogram',
                'name' => 'Monogram', 'name_en' => 'Monogram', 'name_it' => 'Monogramma',
                'description' => 'Medalion në qendër (foto ose inicialet), emër i qendërzuar dhe përmbajtje në dy kolona të barabarta.',
                'description_en' => 'Centred medallion (photo or initials), centred name and content in two equal columns.',
                'description_it' => 'Medaglione al centro (foto o iniziali), nome centrato e contenuto in due colonne uguali.',
            ],
        ];

        $extra = require database_path('seeders/data/translations_de_es.php');

        foreach ($templates as $index => $template) {
            $template = [...$template, ...($extra['templates'][$template['slug']] ?? [])];

            $model = CvTemplate::query()->firstOrCreate(
                ['slug' => $template['slug']],
                [
                    ...collect($template)->except('slug')->all(),
                    'sort_order' => $index + 1,
                    'is_enabled' => true,
                ],
            );

            if ($model->wasRecentlyCreated) {
                continue;
            }

            foreach (['name_en', 'name_it', 'name_de', 'name_es', 'description_en', 'description_it', 'description_de', 'description_es'] as $field) {
                if (blank($model->{$field}) && filled($template[$field] ?? null)) {
                    $model->{$field} = $template[$field];
                }
            }

            $model->save();
        }
    }
}
