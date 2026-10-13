<?php

namespace App\Filament\Resources\CvTemplates\Pages;

use App\Filament\Resources\CvTemplates\CvTemplateResource;
use Filament\Resources\Pages\EditRecord;

class EditCvTemplate extends EditRecord
{
    protected static string $resource = CvTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
