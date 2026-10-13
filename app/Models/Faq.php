<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['question', 'answer', 'question_en', 'answer_en', 'question_it', 'answer_it', 'question_de', 'answer_de', 'question_es', 'answer_es', 'sort_order', 'is_published'])]
class Faq extends Model
{
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)->orderBy('sort_order')->orderBy('id');
    }

    /** Question in the given (or current) locale, falling back to Albanian. */
    public function localizedQuestion(?string $locale = null): string
    {
        return $this->localized('question', $locale);
    }

    public function localizedAnswer(?string $locale = null): string
    {
        return $this->localized('answer', $locale);
    }

    private function localized(string $field, ?string $locale): string
    {
        $locale ??= app()->getLocale();
        $value = $locale === 'sq' ? null : ($this->getAttribute("{$field}_{$locale}") ?? null);

        return filled($value) ? (string) $value : (string) $this->getAttribute($field);
    }
}
