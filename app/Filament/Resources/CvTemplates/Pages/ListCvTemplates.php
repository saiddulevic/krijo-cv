<?php

namespace App\Filament\Resources\CvTemplates\Pages;

use App\Filament\Resources\CvTemplates\CvTemplateResource;
use Filament\Resources\Pages\ListRecords;

class ListCvTemplates extends ListRecords
{
    protected static string $resource = CvTemplateResource::class;

    protected static ?string $title = 'Modelet e CV-së';

    protected ?string $subheading = 'Ndrysho emrat, përshkrimet, radhën dhe disponueshmërinë. Kodi i modeleve është pjesë e aplikacionit dhe nuk ndryshohet nga paneli.';

    protected function getHeaderActions(): array
    {
        return [];
    }
}
