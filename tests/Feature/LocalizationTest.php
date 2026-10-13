<?php

namespace Tests\Feature;

use App\Models\CvTemplate;
use App\Models\Faq;
use App\Support\SiteSettings;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;
use Tests\TestCase;

class LocalizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);

        \Livewire\Features\SupportAutoInjectedAssets\SupportAutoInjectedAssets::$hasRenderedAComponentThisRequest = false;
        \Livewire\Features\SupportAutoInjectedAssets\SupportAutoInjectedAssets::$forceAssetInjection = false;
    }

    public function test_albanian_is_the_default_language(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('<html lang="sq">', false)
            ->assertSee('CV-ja jote, gati për aplikim.');
    }

    public function test_the_browser_language_header_is_ignored(): void
    {
        foreach (['en-GB,en;q=0.9', 'it-IT,it;q=0.9', 'de-DE,de;q=0.9'] as $header) {
            $this->withHeader('Accept-Language', $header)->get('/')
                ->assertSee('<html lang="sq">', false)
                ->assertSee('CV-ja jote, gati për aplikim.');
        }
    }

    public function test_the_language_switch_route_remembers_the_choice(): void
    {
        $this->get('/gjuha/en')
            ->assertRedirect()
            ->assertCookie('krijo_locale', 'en')
            ->assertSessionHas('locale', 'en');

        $this->get('/gjuha/it')->assertSessionHas('locale', 'it')->assertCookie('krijo_locale', 'it');
        $this->get('/gjuha/sq')->assertSessionHas('locale', 'sq');
    }

    public function test_the_stored_cookie_and_session_choose_the_language(): void
    {
        $this->withCookie('krijo_locale', 'en')->get('/')
            ->assertSee('<html lang="en">', false)
            ->assertSee('Your CV, ready to apply.');

        $this->withCookie('krijo_locale', 'en')->get('/privatesia')->assertSee('Technical cookies');

        // Garbage values are ignored.
        $this->withCookie('krijo_locale', 'klingon')->get('/')->assertSee('<html lang="sq">', false);

        // The session value wins over the cookie.
        $this->withCookie('krijo_locale', 'en')->withSession(['locale' => 'it'])->get('/')
            ->assertSee('<html lang="it">', false);
    }

    public function test_unknown_languages_are_rejected(): void
    {
        $this->get('/gjuha/xx')->assertNotFound();
        $this->get('/gjuha/fr')->assertNotFound();
    }

    public function test_the_header_lists_the_five_languages(): void
    {
        $response = $this->get('/');

        foreach (['sq', 'en', 'it', 'de', 'es'] as $code) {
            $response->assertSee('?lang='.$code.'"', false);
        }
    }

    public function test_the_builder_receives_the_locale_and_translated_strings(): void
    {
        $response = $this->withCookie('krijo_locale', 'it')->get('/krijo');

        $response->assertOk()
            ->assertSee('Lettera di presentazione')
            ->assertSee('Lingua del CV')
            ->assertSee('Scarica il CV (PDF)')
            ->assertSee('Modello e download');

        // The embedded config carries the locale and the JS messages.
        $response->assertSee(str_replace('"', '\u0022', '"locale":"it"'), false);
        $response->assertSee('Il progetto è stato salvato come file');
    }

    public function test_the_builder_in_english(): void
    {
        $this->withCookie('krijo_locale', 'en')->get('/krijo')
            ->assertOk()
            ->assertSee('Cover letter')
            ->assertSee('CV language')
            ->assertSee('I currently work here')
            ->assertSee('Save automatically on this device');
    }

    public function test_the_builder_in_german_and_spanish(): void
    {
        $this->withCookie('krijo_locale', 'de')->get('/krijo')
            ->assertOk()
            ->assertSee('Anschreiben')
            ->assertSee('Automatisch auf diesem Gerät speichern');

        $this->withCookie('krijo_locale', 'es')->get('/krijo')
            ->assertOk()
            ->assertSee('Carta')
            ->assertSee('Guardar automáticamente en este dispositivo');
    }

    public function test_the_builder_has_five_steps_including_the_cover_letter(): void
    {
        $this->get('/krijo')
            ->assertOk()
            ->assertSee('Letra e motivimit')
            ->assertSee('Shkarko letrën (PDF)')
            ->assertSee('hapi-5', false);
    }

    public function test_templates_and_faqs_are_localized_with_albanian_fallback(): void
    {
        $this->withCookie('krijo_locale', 'en')->get('/')->assertSee('Is Krijo CV free?')->assertSee('Professional');

        // An FAQ without an Italian translation falls back to Albanian.
        $faq = Faq::query()->create([
            'question' => 'Pyetje vetëm shqip?',
            'answer' => 'Përgjigje vetëm shqip.',
            'sort_order' => 99,
            'is_published' => true,
        ]);
        $this->assertSame('Pyetje vetëm shqip?', $faq->localizedQuestion('it'));
        $this->assertSame('Pyetje vetëm shqip?', $faq->localizedQuestion('en'));

        $faq->update(['question_it' => 'Domanda solo in albanese?']);
        $this->assertSame('Domanda solo in albanese?', $faq->fresh()->localizedQuestion('it'));
        $this->assertSame('Pyetje vetëm shqip?', $faq->fresh()->localizedQuestion('sq'));
    }

    public function test_site_text_resolution_prefers_owner_values_then_defaults_then_albanian(): void
    {
        $settings = app(SiteSettings::class);

        // Shipped English default
        $this->assertSame('Your CV, ready to apply.', $settings->getLocalized('site.headline', 'en'));
        // Albanian value
        $this->assertSame('CV-ja jote, gati për aplikim.', $settings->getLocalized('site.headline', 'sq'));

        // Owner override wins over the shipped default
        $settings->set(['site.headline.en' => 'Custom English headline']);
        $this->assertSame('Custom English headline', $settings->getLocalized('site.headline', 'en'));
        $this->assertSame('Il tuo CV, pronto per candidarti.', $settings->getLocalized('site.headline', 'it'));

        // A key without a shipped translation falls back to Albanian
        $this->assertSame('Said Duleviç', $settings->getLocalized('footer.link_label', 'en'));
    }

    public function test_seeded_templates_have_names_in_every_language(): void
    {
        foreach (CvTemplate::query()->get() as $template) {
            $this->assertNotEmpty($template->name_en, "{$template->slug} lacks an English name");
            $this->assertNotEmpty($template->name_it, "{$template->slug} lacks an Italian name");
            $this->assertNotEmpty($template->description_en, "{$template->slug} lacks an English description");
            $this->assertNotEmpty($template->description_it, "{$template->slug} lacks an Italian description");
            $this->assertNotEmpty($template->name_de, "{$template->slug} lacks a German name");
            $this->assertNotEmpty($template->name_es, "{$template->slug} lacks a Spanish name");
            $this->assertNotEmpty($template->description_de, "{$template->slug} lacks a German description");
            $this->assertNotEmpty($template->description_es, "{$template->slug} lacks a Spanish description");
        }

        $this->assertSame('Executive', CvTemplate::query()->where('slug', 'executive')->first()->localizedName('en'));
        $this->assertSame('Dirigente', CvTemplate::query()->where('slug', 'executive')->first()->localizedName('it'));
        $this->assertSame('Ekzekutiv', CvTemplate::query()->where('slug', 'executive')->first()->localizedName('sq'));
        $this->assertSame('Führungskraft', CvTemplate::query()->where('slug', 'executive')->first()->localizedName('de'));
        $this->assertSame('Ejecutiva', CvTemplate::query()->where('slug', 'executive')->first()->localizedName('es'));
    }

    public function test_every_translation_file_has_the_same_keys_as_albanian(): void
    {
        $reference = $this->flattenKeys(require base_path('lang/sq/ui.php'));

        foreach (['en', 'it', 'de', 'es'] as $locale) {
            $keys = $this->flattenKeys(require base_path("lang/{$locale}/ui.php"));

            $this->assertSame([], array_values(array_diff($reference, $keys)), "lang/{$locale}/ui.php is missing keys");
            $this->assertSame([], array_values(array_diff($keys, $reference)), "lang/{$locale}/ui.php has extra keys");
        }

        $siteReference = $this->flattenKeys(require base_path('lang/en/site.php'));
        $landingReference = $this->flattenKeys(require base_path('lang/sq/landing.php'));

        foreach (['it', 'de', 'es'] as $locale) {
            $this->assertSame([], array_values(array_diff($siteReference, $this->flattenKeys(require base_path("lang/{$locale}/site.php")))), "lang/{$locale}/site.php is missing keys");
        }

        foreach (['en', 'it', 'de', 'es'] as $locale) {
            $keys = $this->flattenKeys(require base_path("lang/{$locale}/landing.php"));

            $this->assertSame([], array_values(array_diff($landingReference, $keys)), "lang/{$locale}/landing.php is missing keys");
            $this->assertSame([], array_values(array_diff($keys, $landingReference)), "lang/{$locale}/landing.php has extra keys");
        }
    }

    public function test_translated_strings_keep_the_same_placeholders(): void
    {
        $sq = Arr::dot(require base_path('lang/sq/ui.php'));

        foreach (['en', 'it', 'de', 'es'] as $locale) {
            foreach (Arr::dot(require base_path("lang/{$locale}/ui.php")) as $key => $text) {
                preg_match_all('/:[a-z_]+\b/', (string) ($sq[$key] ?? ''), $expected);
                preg_match_all('/:[a-z_]+\b/', (string) $text, $actual);

                $a = $expected[0];
                $b = $actual[0];
                sort($a);
                sort($b);

                $this->assertSame($a, $b, "Placeholders differ for {$locale}.{$key}");
            }
        }
    }

    /**
     * @param  array<string, mixed>  $array
     * @return list<string>
     */
    private function flattenKeys(array $array): array
    {
        return array_keys(Arr::dot($array));
    }
}
