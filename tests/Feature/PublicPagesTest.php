<?php

namespace Tests\Feature;

use App\Models\CvTemplate;
use App\Support\SiteSettings;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);

        // Livewire remembers rendered components in a static flag; earlier admin
        // tests in the same process must not make it inject assets here.
        \Livewire\Features\SupportAutoInjectedAssets\SupportAutoInjectedAssets::$hasRenderedAComponentThisRequest = false;
        \Livewire\Features\SupportAutoInjectedAssets\SupportAutoInjectedAssets::$forceAssetInjection = false;
    }

    public function test_homepage_is_public_and_shows_branding(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('CV-ja jote, gati për aplikim.');
        $response->assertSee('Plotëso të dhënat, zgjidh modelin dhe shkarko CV-në falas.');
        $response->assertSee('Krijo CV');
        $response->assertSee('Importo projekt');
        $response->assertSee('Krijuar nga');
        $response->assertSee('https://saiddulevic.com');
        $response->assertSee('Said Duleviç');
        $response->assertSee('Provo me një shembull');
    }

    public function test_homepage_lists_enabled_templates_and_published_faqs(): void
    {
        CvTemplate::query()->where('slug', 'compact')->update(['is_enabled' => false]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee((count(CvTemplate::SLUGS) - 1).' modele');
        $response->assertDontSee('images/templates/compact.png');
        $response->assertSee('A është Krijo CV falas?');
    }

    public function test_builder_is_public_without_login_and_receives_template_config(): void
    {
        $response = $this->get('/krijo');

        $response->assertOk();
        $response->assertSee('Krijo CV');
        $response->assertSee('Ruaj projektin');
        $response->assertSee('Importo projekt');
        $response->assertSee('Punoj ende këtu');
        $response->assertSee('Ruaj automatikisht në këtë pajisje');
        $response->assertSee('Fshi të dhënat nga kjo pajisje');
        $response->assertSee('Redakto');
        $response->assertSee('Parapamje');
        $response->assertSee('noindex, nofollow');

        // The builder config is embedded as escaped JSON (Js::from), so match the encoded form.
        foreach (CvTemplate::SLUGS as $slug) {
            $response->assertSee($this->encodedId($slug), false);
        }
    }

    public function test_builder_hides_disabled_templates(): void
    {
        CvTemplate::query()->where('slug', 'european')->update(['is_enabled' => false]);

        $response = $this->get('/krijo');

        $response->assertOk();
        $response->assertDontSee($this->encodedId('european'), false);
        $response->assertSee($this->encodedId('minimal'), false);
    }

    public function test_public_pages_do_not_load_livewire(): void
    {
        $this->get('/')->assertDontSee('livewire', false);
        $this->get('/krijo')->assertDontSee('livewire', false);
        $this->get('/privatesia')->assertDontSee('livewire', false);
    }

    public function test_privacy_page_shows_the_configured_text(): void
    {
        app(SiteSettings::class)->set(['privacy.text' => "Paragrafi i parë.\n\nParagrafi i dytë."]);

        $response = $this->get('/privatesia');

        $response->assertOk();
        $response->assertSee('Paragrafi i parë.');
        $response->assertSee('Paragrafi i dytë.');
    }

    public function test_settings_changes_are_reflected_on_the_homepage(): void
    {
        app(SiteSettings::class)->set([
            'site.headline' => 'Titull i ri',
            'site.description' => 'Përshkrim i ri',
            'footer.link_label' => 'Autori',
            'footer.link_url' => 'https://example.com',
        ]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('Titull i ri');
        $response->assertSee('Përshkrim i ri');
        $response->assertSee('https://example.com');
        $response->assertSee('Autori');
    }

    public function test_there_are_no_routes_that_accept_visitor_cv_data(): void
    {
        $this->post('/krijo', ['cv' => 'x'])->assertStatus(405);
        $this->post('/', ['cv' => 'x'])->assertStatus(405);
        $this->get('/register')->assertNotFound();
        $this->get('/admin/register')->assertNotFound();
    }

    public function test_seeded_templates_are_all_enabled(): void
    {
        $this->assertSame(count(CvTemplate::SLUGS), CvTemplate::query()->enabled()->count());
        $this->assertSame(CvTemplate::SLUGS, CvTemplate::query()->ordered()->pluck('slug')->all());
    }

    /** The substring Js::from() produces for {"id": "<slug>"} inside the builder config. */
    private function encodedId(string $slug): string
    {
        return trim(str_replace('"', '\\u0022', json_encode(['id' => $slug])), '{}');
    }
}
