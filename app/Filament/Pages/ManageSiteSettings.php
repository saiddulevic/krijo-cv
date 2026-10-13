<?php

namespace App\Filament\Pages;

use App\Support\SiteSettings;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * Owner-editable site texts: homepage headline, footer, default accent colour,
 * privacy text. Only plain text is stored; nothing here is executed as code.
 *
 * @property-read Schema $form
 */
class ManageSiteSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $navigationLabel = 'Cilësimet e faqes';

    protected static ?string $title = 'Cilësimet e faqes';

    protected static ?string $slug = 'cilesimet';

    protected static ?int $navigationSort = 1;

    protected string $view = 'filament.pages.manage-site-settings';

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    /** Maps form field names to setting keys. */
    private const FIELD_MAP = [
        'site_name' => 'site.name',
        'site_logo_text' => 'site.logo_text',
        'site_headline' => 'site.headline',
        'site_description' => 'site.description',
        'site_meta_description' => 'site.meta_description',
        'footer_text' => 'footer.text',
        'footer_link_label' => 'footer.link_label',
        'footer_link_url' => 'footer.link_url',
        'footer_links' => 'footer.links',
        'design_default_accent' => 'design.default_accent',
        'source_url' => 'source.url',
        'privacy_text' => 'privacy.text',
        'site_headline_en' => 'site.headline.en',
        'site_description_en' => 'site.description.en',
        'site_meta_description_en' => 'site.meta_description.en',
        'footer_text_en' => 'footer.text.en',
        'privacy_text_en' => 'privacy.text.en',
        'site_headline_it' => 'site.headline.it',
        'site_description_it' => 'site.description.it',
        'site_meta_description_it' => 'site.meta_description.it',
        'footer_text_it' => 'footer.text.it',
        'privacy_text_it' => 'privacy.text.it',
        'site_headline_de' => 'site.headline.de',
        'site_description_de' => 'site.description.de',
        'site_meta_description_de' => 'site.meta_description.de',
        'footer_text_de' => 'footer.text.de',
        'privacy_text_de' => 'privacy.text.de',
        'site_headline_es' => 'site.headline.es',
        'site_description_es' => 'site.description.es',
        'site_meta_description_es' => 'site.meta_description.es',
        'footer_text_es' => 'footer.text.es',
        'privacy_text_es' => 'privacy.text.es',
    ];

    public function mount(): void
    {
        $settings = app(SiteSettings::class)->all();

        $state = [];

        foreach (self::FIELD_MAP as $field => $key) {
            $state[$field] = $settings[$key] ?? null;
        }

        $this->form->fill($state);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Faqja kryesore')
                    ->description('Tekstet që shfaqen në krye të faqes kryesore.')
                    ->schema([
                        TextInput::make('site_name')
                            ->label('Emri i faqes')
                            ->helperText('Përdoret në titullin e shfletuesit.')
                            ->required()
                            ->maxLength(60),
                        TextInput::make('site_logo_text')
                            ->label('Teksti i logos')
                            ->helperText('Shfaqet pranë kutisë „CV” në kokën e faqes, p.sh. „CV SHQIP FALAS”.')
                            ->required()
                            ->maxLength(40),
                        TextInput::make('site_headline')
                            ->label('Titulli kryesor')
                            ->required()
                            ->maxLength(140),
                        Textarea::make('site_description')
                            ->label('Përshkrimi')
                            ->required()
                            ->rows(2)
                            ->maxLength(300),
                        Textarea::make('site_meta_description')
                            ->label('Përshkrimi për motorët e kërkimit')
                            ->helperText('Përdoret në etiketën meta description.')
                            ->rows(2)
                            ->maxLength(320),
                    ]),
                Section::make('Fundi i faqes')
                    ->description('Teksti dhe lidhjet në fund të çdo faqeje.')
                    ->schema([
                        TextInput::make('footer_text')
                            ->label('Teksti')
                            ->maxLength(120),
                        TextInput::make('footer_link_label')
                            ->label('Emri i lidhjes kryesore')
                            ->maxLength(80),
                        TextInput::make('footer_link_url')
                            ->label('Adresa e lidhjes kryesore')
                            ->url()
                            ->maxLength(255),
                        Repeater::make('footer_links')
                            ->label('Lidhje shtesë')
                            ->schema([
                                TextInput::make('label')
                                    ->label('Emërtimi')
                                    ->required()
                                    ->maxLength(60),
                                TextInput::make('url')
                                    ->label('Adresa (URL e plotë ose rrugë si /privatesia)')
                                    ->required()
                                    ->maxLength(255)
                                    ->regex('/^(https?:\/\/|\/)/'),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->reorderable()
                            ->addActionLabel('Shto lidhje'),
                    ]),
                Section::make('Dizajni')
                    ->schema([
                        ColorPicker::make('design_default_accent')
                            ->label('Ngjyra e theksit e parazgjedhur')
                            ->helperText('Vizitorët mund ta ndryshojnë për CV-në e tyre.')
                            ->required()
                            ->regex('/^#[0-9A-Fa-f]{6}$/'),
                    ]),
                Section::make('Kodi burimor (open source)')
                    ->description('Kur e plotëson, faqja e privatësisë dhe fundi i faqes shfaqin një lidhje te kodi, që vizitorët të verifikojnë vetë që nuk ruhen të dhëna në server. Lëre bosh derisa ta publikosh kodin.')
                    ->schema([
                        TextInput::make('source_url')
                            ->label('Adresa e repozitorit')
                            ->placeholder('https://github.com/saiddulevic/krijo-cv')
                            ->url()
                            ->maxLength(255),
                    ]),
                Section::make('Privatësia')
                    ->schema([
                        Textarea::make('privacy_text')
                            ->label('Teksti i faqes së privatësisë')
                            ->helperText('Vetëm tekst. Paragrafët ndahen me një rresht bosh.')
                            ->rows(14)
                            ->maxLength(10000),
                    ]),
                ...$this->translationSections(),
            ]);
    }

    /**
     * One collapsed section per extra language. Empty fields fall back to the
     * shipped default for that language, then to the Albanian text.
     *
     * @return array<int, Section>
     */
    private function translationSections(): array
    {
        $sections = [];

        foreach (['en' => 'Anglisht', 'it' => 'Italisht', 'de' => 'Gjermanisht', 'es' => 'Spanjisht'] as $code => $name) {
            $sections[] = Section::make("Përkthimi në {$name} (opsional)")
                ->description('Lëre bosh për të përdorur tekstin e gatshëm në këtë gjuhë.')
                ->collapsed()
                ->schema([
                    TextInput::make("site_headline_{$code}")
                        ->label('Titulli kryesor')
                        ->placeholder((string) trans('site.site.headline', [], $code))
                        ->maxLength(140),
                    Textarea::make("site_description_{$code}")
                        ->label('Përshkrimi')
                        ->placeholder((string) trans('site.site.description', [], $code))
                        ->rows(2)
                        ->maxLength(300),
                    Textarea::make("site_meta_description_{$code}")
                        ->label('Përshkrimi për motorët e kërkimit')
                        ->placeholder((string) trans('site.site.meta_description', [], $code))
                        ->rows(2)
                        ->maxLength(320),
                    TextInput::make("footer_text_{$code}")
                        ->label('Teksti i fundit të faqes')
                        ->placeholder((string) trans('site.footer.text', [], $code))
                        ->maxLength(120),
                    Textarea::make("privacy_text_{$code}")
                        ->label('Teksti i privatësisë')
                        ->rows(10)
                        ->maxLength(10000),
                ]);
        }

        return $sections;
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([EmbeddedSchema::make('form')])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make([
                            Action::make('save')
                                ->label('Ruaj ndryshimet')
                                ->submit('save')
                                ->keyBindings(['mod+s']),
                        ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $values = [];

        foreach (self::FIELD_MAP as $field => $key) {
            $values[$key] = $data[$field] ?? null;
        }

        $values['footer.links'] = array_values(array_map(
            fn (array $link): array => ['label' => (string) $link['label'], 'url' => (string) $link['url']],
            $values['footer.links'] ?? [],
        ));

        app(SiteSettings::class)->set($values);

        Notification::make()
            ->title('Cilësimet u ruajtën.')
            ->success()
            ->send();
    }
}
