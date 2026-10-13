<?php

namespace Tests\Feature;

use App\Filament\Pages\ManageSiteSettings;
use App\Filament\Resources\Faqs\Pages\CreateFaq;
use App\Models\CvTemplate;
use App\Models\Faq;
use App\Models\User;
use App\Support\SiteSettings;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    private function admin(): User
    {
        return User::factory()->create();
    }

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/cilesimet')->assertRedirect('/admin/login');
        $this->get('/admin/pyetjet')->assertRedirect('/admin/login');
        $this->get('/admin/modelet')->assertRedirect('/admin/login');
    }

    public function test_login_page_is_available_but_registration_is_not(): void
    {
        $this->get('/admin/login')->assertOk();
        $this->get('/admin/register')->assertNotFound();
        $this->get('/admin/password-reset/request')->assertNotFound();
    }

    public function test_an_administrator_can_open_the_panel_pages(): void
    {
        $this->actingAs($this->admin());

        $this->get('/admin')->assertOk();
        $this->get('/admin/cilesimet')->assertOk()->assertSee('Cilësimet e faqes');
        $this->get('/admin/pyetjet')->assertOk()->assertSee('A është Krijo CV falas?');
        $this->get('/admin/modelet')->assertOk()->assertSee('Minimal')->assertSee('Kompakt');
        $this->get('/admin/modelet/'.CvTemplate::query()->where('slug', 'modern')->value('id').'/edit')->assertOk();
    }

    public function test_templates_cannot_be_created_or_deleted_from_the_panel(): void
    {
        $this->actingAs($this->admin());

        $this->get('/admin/modelet/create')->assertNotFound();
        $this->assertSame(count(CvTemplate::SLUGS), CvTemplate::query()->count());
    }

    public function test_site_settings_can_be_saved_from_the_panel(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(ManageSiteSettings::class)
            ->fillForm([
                'site_headline' => 'Titulli i ri nga paneli',
                'site_description' => 'Përshkrimi i ri nga paneli',
                'design_default_accent' => '#1D4ED8',
                'footer_links' => [
                    ['label' => 'Privatësia', 'url' => '/privatesia'],
                    ['label' => 'Autori', 'url' => 'https://example.com'],
                ],
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $settings = app(SiteSettings::class);
        $this->assertSame('Titulli i ri nga paneli', $settings->get('site.headline'));
        $this->assertSame('#1D4ED8', $settings->get('design.default_accent'));
        $this->assertCount(2, $settings->get('footer.links'));

        $this->get('/')->assertSee('Titulli i ri nga paneli');
        $this->get('/krijo')->assertSee('#1D4ED8');
    }

    public function test_english_and_italian_site_texts_can_be_saved_from_the_panel(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(ManageSiteSettings::class)
            ->fillForm([
                'site_headline_en' => 'English headline from the panel',
                'site_headline_it' => 'Titolo italiano dal pannello',
                'privacy_text_en' => "First English paragraph.

Second English paragraph.",
            ])
            ->call('save')
            ->assertHasNoFormErrors();

        $settings = app(SiteSettings::class);
        $this->assertSame('English headline from the panel', $settings->getLocalized('site.headline', 'en'));
        $this->assertSame('Titolo italiano dal pannello', $settings->getLocalized('site.headline', 'it'));

        $this->withCookie('krijo_locale', 'en')->get('/')->assertSee('English headline from the panel');
        $this->withCookie('krijo_locale', 'en')->get('/privatesia')->assertSee('Second English paragraph.');
        // Albanian visitors still see the Albanian headline.
        $this->withCookie('krijo_locale', 'sq')->get('/')->assertSee('CV-ja jote, gati për aplikim.');
    }

    public function test_faq_translations_can_be_created_in_the_panel(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(CreateFaq::class)
            ->fillForm([
                'question' => 'Pyetje e re me përkthim?',
                'answer' => 'Përgjigje shqip.',
                'question_en' => 'New question with translation?',
                'answer_en' => 'English answer.',
                'is_published' => true,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $faq = Faq::query()->where('question', 'Pyetje e re me përkthim?')->firstOrFail();
        $this->assertSame('New question with translation?', $faq->localizedQuestion('en'));
        $this->assertSame('Pyetje e re me përkthim?', $faq->localizedQuestion('it'));
    }

    public function test_site_settings_validation_rejects_invalid_values(): void
    {
        $this->actingAs($this->admin());

        Livewire::test(ManageSiteSettings::class)
            ->fillForm([
                'site_headline' => '',
                'design_default_accent' => 'not-a-colour',
            ])
            ->call('save')
            ->assertHasFormErrors(['site_headline', 'design_default_accent']);
    }

    public function test_faq_changes_are_reflected_on_the_homepage(): void
    {
        Faq::query()->update(['is_published' => false]);
        Faq::query()->create(['question' => 'Pyetje e re?', 'answer' => 'Përgjigje e re.', 'sort_order' => 99, 'is_published' => true]);

        $response = $this->get('/');

        $response->assertSee('Pyetje e re?');
        $response->assertDontSee('A është Krijo CV falas?');
    }

    public function test_the_database_only_contains_admin_and_framework_tables(): void
    {
        $tables = collect(\Illuminate\Support\Facades\Schema::getTableListing())
            ->map(fn (string $table): string => str_contains($table, '.') ? substr($table, strrpos($table, '.') + 1) : $table)
            ->reject(fn (string $table): bool => str_starts_with($table, 'sqlite_'))
            ->sort()
            ->values()
            ->all();

        $this->assertSame([
            'cache',
            'cache_locks',
            'cv_templates',
            'failed_jobs',
            'faqs',
            'job_batches',
            'jobs',
            'migrations',
            'password_reset_tokens',
            'sessions',
            'settings',
            'users',
        ], $tables);
    }
}
