<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Metadata for a CV template. The rendering code itself lives in
 * resources/js/cv/templates and is addressed by the immutable slug.
 */
#[Fillable(['slug', 'name', 'name_en', 'name_it', 'name_de', 'name_es', 'description', 'description_en', 'description_it', 'description_de', 'description_es', 'sort_order', 'is_enabled'])]
class CvTemplate extends Model
{
    /** Name in the given (or current) locale, falling back to Albanian. */
    public function localizedName(?string $locale = null): string
    {
        return $this->localized('name', $locale);
    }

    /** Description in the given (or current) locale, falling back to Albanian. */
    public function localizedDescription(?string $locale = null): string
    {
        return $this->localized('description', $locale);
    }

    private function localized(string $field, ?string $locale): string
    {
        $locale ??= app()->getLocale();
        $value = $locale === 'sq' ? null : ($this->getAttribute("{$field}_{$locale}") ?? null);

        return filled($value) ? (string) $value : (string) $this->getAttribute($field);
    }

    /** Slugs of the templates implemented in the front end, in default order. */
    public const SLUGS = [
        'minimal',
        'modern',
        'professional',
        'executive',
        'creative',
        'academic',
        'student',
        'technology',
        'european',
        'compact',
        'elegant',
        'timeline',
        'bold',
        'duotone',
        'monogram',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_enabled' => 'boolean',
        ];
    }

    public function scopeEnabled(Builder $query): Builder
    {
        return $query->where('is_enabled', true)->orderBy('sort_order')->orderBy('id');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function thumbnailUrl(): string
    {
        return asset('images/templates/'.$this->slug.'.png');
    }
}
