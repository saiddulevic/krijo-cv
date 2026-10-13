<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoAndAppTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);

        \Livewire\Features\SupportAutoInjectedAssets\SupportAutoInjectedAssets::$hasRenderedAComponentThisRequest = false;
        \Livewire\Features\SupportAutoInjectedAssets\SupportAutoInjectedAssets::$forceAssetInjection = false;
    }

    public function test_the_sitemap_lists_every_page_in_five_languages(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $this->assertStringContainsString('application/xml', (string) $response->headers->get('Content-Type'));

        $xml = simplexml_load_string($response->getContent());
        $this->assertNotFalse($xml, 'sitemap is valid XML');

        $locations = [];
        foreach ($xml->url as $url) {
            $locations[] = (string) $url->loc;
        }

        $paths = ['/', '/cv-ne-anglisht', '/cv-ne-italisht', '/cv-ne-gjermanisht', '/cv-ne-spanjisht', '/leter-motivimi', '/modele-cv', '/privatesia'];

        foreach ($paths as $path) {
            $this->assertContains(url($path), $locations, "{$path} missing");

            foreach (['en', 'it', 'de', 'es'] as $lang) {
                $this->assertContains(url($path).'?lang='.$lang, $locations, "{$path}?lang={$lang} missing");
            }
        }

        $this->assertNotContains(url('/krijo'), $locations, 'the builder is not indexed');
        $this->assertStringContainsString('hreflang="x-default"', $response->getContent());
    }

    public function test_robots_points_to_the_sitemap_and_hides_the_admin(): void
    {
        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('Sitemap: '.url('/sitemap.xml'), false)
            ->assertSee('Disallow: /admin', false);
    }

    public function test_pages_carry_canonical_hreflang_and_social_tags(): void
    {
        $response = $this->get('/');

        $response->assertSee('<link rel="canonical" href="'.url('/').'">', false);
        $response->assertSee('hreflang="en" href="'.url('/').'?lang=en"', false);
        $response->assertSee('hreflang="it" href="'.url('/').'?lang=it"', false);
        $response->assertSee('hreflang="de" href="'.url('/').'?lang=de"', false);
        $response->assertSee('hreflang="es" href="'.url('/').'?lang=es"', false);
        $response->assertSee('hreflang="x-default"', false);
        $response->assertSee('property="og:image" content="'.asset('images/og/og-sq.png').'"', false);
        $response->assertSee('name="twitter:card" content="summary_large_image"', false);
        $response->assertSee('<link rel="manifest" href="'.asset('manifest.webmanifest').'">', false);
        $response->assertSee('"@type":"WebApplication"', false);
        $response->assertSee('"@type":"FAQPage"', false);
    }

    public function test_the_lang_parameter_switches_and_remembers_the_language(): void
    {
        $response = $this->get('/?lang=it');

        $response->assertOk()
            ->assertSee('<html lang="it">', false)
            ->assertSee('<link rel="canonical" href="'.url('/').'?lang=it">', false)
            ->assertSee('property="og:locale" content="it_IT"', false)
            ->assertCookie('krijo_locale', 'it')
            ->assertSessionHas('locale', 'it');

        $this->get('/?lang=de')->assertOk()
            ->assertSee('<html lang="de">', false)
            ->assertSee('property="og:locale" content="de_DE"', false)
            ->assertSee('property="og:image" content="'.asset('images/og/og-de.png').'"', false);

        $this->get('/?lang=es')->assertOk()
            ->assertSee('<html lang="es">', false)
            ->assertSee('property="og:locale" content="es_ES"', false);

        $this->get('/?lang=xx')->assertOk();
    }

    public function test_the_builder_is_not_indexed(): void
    {
        $this->get('/krijo')
            ->assertSee('noindex', false)
            ->assertDontSee('rel="canonical"', false);
    }

    public function test_landing_pages_work_in_five_languages(): void
    {
        $this->get('/cv-ne-anglisht')->assertOk()->assertSee('Krijo CV-në tënde në anglisht')->assertSee('gjuha_cv=en', false);
        $this->get('/cv-ne-italisht?lang=it')->assertOk()->assertSee('Crea il tuo CV in italiano')->assertSee('gjuha_cv=it', false);
        $this->get('/cv-ne-gjermanisht?lang=de')->assertOk()->assertSee('Erstelle deinen Lebenslauf auf Deutsch')->assertSee('gjuha_cv=de', false);
        $this->get('/cv-ne-spanjisht?lang=es')->assertOk()->assertSee('Crea tu CV en español')->assertSee('gjuha_cv=es', false);
        $this->get('/cv-ne-gjermanisht?lang=sq')->assertOk()->assertSee('Krijo CV-në tënde në gjermanisht')->assertSee('gjuha_cv=de&amp;shembull=1', false)->assertDontSee('&amp;amp;', false);
        $this->get('/leter-motivimi?lang=en')->assertOk()->assertSee('A cover letter in the same style as your CV')->assertSee('hapi=4', false);
        $this->get('/modele-cv')->assertOk()->assertSee('images/templates/elegant.png', false)->assertSee('"@type":"WebPage"', false);
        $this->get('/faqe-qe-nuk-ekziston')->assertNotFound();
    }

    public function test_the_footer_links_to_the_landing_pages(): void
    {
        $response = $this->get('/');

        foreach (['cv-ne-anglisht', 'cv-ne-italisht', 'cv-ne-gjermanisht', 'cv-ne-spanjisht', 'leter-motivimi', 'modele-cv'] as $slug) {
            $response->assertSee('href="'.url($slug).'"', false);
        }
    }

    public function test_landing_calls_to_action_preset_the_builder(): void
    {
        $response = $this->get('/krijo?gjuha_cv=it&hapi=4');

        $response->assertOk();
        $response->assertSee(str_replace('"', chr(92).'u0022', '"cvLanguage":"it"'), false);
        $response->assertSee(str_replace('"', chr(92).'u0022', '"step":4'), false);

        $this->get('/krijo?gjuha_cv=de')
            ->assertSee(str_replace('"', chr(92).'u0022', '"cvLanguage":"de"'), false);

        $this->get('/krijo?gjuha_cv=xx&hapi=99')
            ->assertSee(str_replace('"', chr(92).'u0022', '"cvLanguage":null'), false)
            ->assertSee(str_replace('"', chr(92).'u0022', '"step":5'), false);
    }

    public function test_the_app_manifest_service_worker_and_icons_ship_with_the_site(): void
    {
        $manifest = json_decode((string) file_get_contents(public_path('manifest.webmanifest')), true);

        $this->assertIsArray($manifest);
        $this->assertSame('standalone', $manifest['display']);
        $this->assertSame('/', $manifest['scope']);

        foreach ($manifest['icons'] as $icon) {
            $this->assertFileExists(public_path(ltrim($icon['src'], '/')));
        }

        $this->assertFileExists(public_path('sw.js'));
        $this->assertFileExists(public_path('icons/apple-touch-icon.png'));

        foreach (['sq', 'en', 'it', 'de', 'es'] as $locale) {
            $this->assertFileExists(public_path("images/og/og-{$locale}.png"));
        }

        $worker = (string) file_get_contents(public_path('sw.js'));
        $this->assertStringContainsString('/admin', $worker, 'the admin panel is never cached');
    }
}
