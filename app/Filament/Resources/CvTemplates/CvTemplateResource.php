<?php

namespace App\Filament\Resources\CvTemplates;

use App\Filament\Resources\CvTemplates\Pages\EditCvTemplate;
use App\Filament\Resources\CvTemplates\Pages\ListCvTemplates;
use App\Models\CvTemplate;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

/**
 * Template metadata only (name, description, order, availability).
 * Templates cannot be created or deleted here because their rendering code
 * ships with the application; see resources/js/cv/templates.
 */
class CvTemplateResource extends Resource
{
    protected static ?string $model = CvTemplate::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static ?string $navigationLabel = 'Modelet e CV-së';

    protected static ?string $modelLabel = 'model';

    protected static ?string $pluralModelLabel = 'Modelet e CV-së';

    protected static ?string $slug = 'modelet';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'name';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->label('Identifikuesi (i pandryshueshëm)')
                    ->disabled()
                    ->dehydrated(false),
                TextInput::make('name')
                    ->label('Emri')
                    ->required()
                    ->maxLength(60),
                Textarea::make('description')
                    ->label('Përshkrimi i shkurtër')
                    ->rows(3)
                    ->maxLength(300)
                    ->columnSpanFull(),
                Toggle::make('is_enabled')
                    ->label('I disponueshëm për vizitorët'),
                TextInput::make('name_en')
                    ->label('Emri (anglisht)')
                    ->maxLength(60),
                TextInput::make('name_it')
                    ->label('Emri (italisht)')
                    ->maxLength(60),
                Textarea::make('description_en')
                    ->label('Përshkrimi (anglisht)')
                    ->rows(3)
                    ->maxLength(300),
                Textarea::make('description_it')
                    ->label('Përshkrimi (italisht)')
                    ->rows(3)
                    ->maxLength(300),
                TextInput::make('name_de')
                    ->label('Emri (gjermanisht)')
                    ->maxLength(60),
                Textarea::make('description_de')
                    ->label('Përshkrimi (gjermanisht)')
                    ->rows(3)
                    ->maxLength(300),
                TextInput::make('name_es')
                    ->label('Emri (spanjisht)')
                    ->maxLength(60),
                Textarea::make('description_es')
                    ->label('Përshkrimi (spanjisht)')
                    ->rows(3)
                    ->maxLength(300),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('')
                    ->state(fn (CvTemplate $record): string => $record->thumbnailUrl())
                    ->height(72)
                    ->width(51),
                TextColumn::make('name')
                    ->label('Emri')
                    ->weight('semibold'),
                TextColumn::make('slug')
                    ->label('Identifikuesi')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('description')
                    ->label('Përshkrimi')
                    ->limit(80)
                    ->wrap(),
                ToggleColumn::make('is_enabled')
                    ->label('I disponueshëm'),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->paginated(false)
            ->recordActions([
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCvTemplates::route('/'),
            'edit' => EditCvTemplate::route('/{record}/edit'),
        ];
    }
}
