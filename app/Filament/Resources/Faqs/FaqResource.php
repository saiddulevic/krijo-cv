<?php

namespace App\Filament\Resources\Faqs;

use App\Filament\Resources\Faqs\Pages\CreateFaq;
use App\Filament\Resources\Faqs\Pages\EditFaq;
use App\Filament\Resources\Faqs\Pages\ListFaqs;
use App\Models\Faq;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class FaqResource extends Resource
{
    protected static ?string $model = Faq::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQuestionMarkCircle;

    protected static ?string $navigationLabel = 'Pyetjet e shpeshta';

    protected static ?string $modelLabel = 'pyetje';

    protected static ?string $pluralModelLabel = 'Pyetjet e shpeshta';

    protected static ?string $slug = 'pyetjet';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'question';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('question')
                    ->label('Pyetja')
                    ->required()
                    ->maxLength(255)
                    ->columnSpanFull(),
                Textarea::make('answer')
                    ->label('Përgjigjja')
                    ->required()
                    ->rows(6)
                    ->maxLength(5000)
                    ->columnSpanFull(),
                Toggle::make('is_published')
                    ->label('E publikuar')
                    ->default(true),
                Section::make('Përkthimi në anglisht (opsional)')
                    ->description('Lëre bosh për të shfaqur tekstin shqip.')
                    ->collapsed()
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('question_en')->label('Pyetja (anglisht)')->maxLength(255),
                        Textarea::make('answer_en')->label('Përgjigjja (anglisht)')->rows(4)->maxLength(5000),
                    ]),
                Section::make('Përkthimi në italisht (opsional)')
                    ->description('Lëre bosh për të shfaqur tekstin shqip.')
                    ->collapsed()
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('question_it')->label('Pyetja (italisht)')->maxLength(255),
                        Textarea::make('answer_it')->label('Përgjigjja (italisht)')->rows(4)->maxLength(5000),
                    ]),
                Section::make('Përkthimi në gjermanisht (opsional)')
                    ->description('Lëre bosh për të shfaqur tekstin shqip.')
                    ->collapsed()
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('question_de')->label('Pyetja (gjermanisht)')->maxLength(255),
                        Textarea::make('answer_de')->label('Përgjigjja (gjermanisht)')->rows(4)->maxLength(5000),
                    ]),
                Section::make('Përkthimi në spanjisht (opsional)')
                    ->description('Lëre bosh për të shfaqur tekstin shqip.')
                    ->collapsed()
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('question_es')->label('Pyetja (spanjisht)')->maxLength(255),
                        Textarea::make('answer_es')->label('Përgjigjja (spanjisht)')->rows(4)->maxLength(5000),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('question')
                    ->label('Pyetja')
                    ->searchable()
                    ->limit(90)
                    ->wrap(),
                ToggleColumn::make('is_published')
                    ->label('E publikuar'),
                TextColumn::make('updated_at')
                    ->label('Përditësuar')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('Nuk ka ende pyetje')
            ->emptyStateDescription('Shto pyetjet që shfaqen në faqen kryesore.');
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFaqs::route('/'),
            'create' => CreateFaq::route('/create'),
            'edit' => EditFaq::route('/{record}/edit'),
        ];
    }
}
