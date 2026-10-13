<?php

namespace App\Support;

/**
 * URLs for canonical and hreflang links. Albanian pages live at the plain
 * path; English and Italian versions add ?lang=en / ?lang=it (handled by the
 * SetLocale middleware).
 */
class Seo
{
    /**
     * @return array<string, string> locale => absolute URL
     */
    public static function alternates(string $path): array
    {
        $base = url('/'.ltrim($path, '/'));
        $urls = [];

        foreach (array_keys((array) config('krijo.locales', [])) as $locale) {
            $urls[$locale] = $locale === config('krijo.default_locale', 'sq') ? $base : $base.'?lang='.$locale;
        }

        return $urls;
    }

    /**
     * Indexable public paths for the sitemap.
     *
     * @return list<string>
     */
    public static function indexablePaths(): array
    {
        return [
            '/',
            ...array_map(fn (string $slug): string => '/'.$slug, array_keys((array) config('krijo.landing', []))),
            '/privatesia',
        ];
    }
}
