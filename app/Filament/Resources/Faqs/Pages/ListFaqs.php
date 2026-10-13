<?php

namespace App\Filament\Resources\Faqs\Pages;

use App\Filament\Resources\Faqs\FaqResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFaqs extends ListRecords
{
    protected static string $resource = FaqResource::class;

    protected static ?string $title = 'Pyetjet e shpeshta';

    protected ?string $subheading = 'Tërhiq rreshtat për të ndryshuar radhën. Vetëm pyetjet e publikuara shfaqen në faqen kryesore.';

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Shto pyetje'),
        ];
    }
}
