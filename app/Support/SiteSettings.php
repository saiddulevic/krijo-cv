<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

/**
 * Key/value site settings managed by the owner in the admin panel.
 * Values are cached forever and the cache is flushed on every write.
 */
class SiteSettings
{
    public const CACHE_KEY = 'krijo-cv.settings';

    public const DEFAULTS = [
        'site.name' => 'Krijo CV',
        'site.logo_text' => 'CV SHQIP FALAS',
        'site.headline' => 'CV-ja jote, gati për aplikim.',
        'site.description' => 'Plotëso të dhënat, zgjidh modelin dhe shkarko CV-në falas.',
        'site.meta_description' => 'Krijo CV falas në shqip: plotëso të dhënat, zgjidh një nga modelet dhe shkarko CV-në si PDF. Pa regjistrim, të dhënat mbeten në shfletuesin tënd.',
        'footer.text' => 'Krijuar nga',
        'footer.link_label' => 'Said Duleviç',
        'footer.link_url' => 'https://saiddulevic.com',
        'footer.links' => [
            ['label' => 'Privatësia', 'url' => '/privatesia'],
        ],
        'design.default_accent' => '#C1121F',
        // Public address of the open-source repository; empty until published.
        'source.url' => '',
        'privacy.text' => "Krijo CV është një shërbim falas që funksionon tërësisht në shfletuesin tënd.\n\nTë dhënat që shkruan në CV (emri, kontaktet, përvoja, arsimi, aftësitë etj.) dhe fotoja jote nuk dërgohen në serverin tonë dhe nuk ruhen në ndonjë bazë të dhënash. PDF-ja krijohet nga shfletuesi yt dhe shkarkohet drejtpërdrejt në pajisjen tënde.\n\nNëse aktivizon opsionin „Ruaj automatikisht në këtë pajisje”, projekti (përfshirë foton) ruhet vetëm në hapësirën lokale të shfletuesit (IndexedDB) në këtë pajisje. Ai nuk sinkronizohet online dhe mund ta fshish në çdo moment me butonin „Fshi të dhënat nga kjo pajisje”. Për të vazhduar punën në një pajisje tjetër, shkarko skedarin e projektit (.cv.json) dhe importoje atje.\n\nFaqja nuk përdor shërbime analitike të palëve të treta dhe nuk vendos cookie ndjekëse. Shfletuesi mund të ruajë një cookie teknike sesioni të nevojshme për funksionimin e faqes. Fontet, skriptet dhe burimet e tjera shërbehen nga vetë kjo faqe.\n\nPaneli administrativ përdoret vetëm nga pronari i faqes për të menaxhuar tekstet, pyetjet e shpeshta dhe modelet; ai nuk ka qasje në asnjë CV të vizitorëve.",
    ];

    /**
     * @return array<string, mixed>
     */
    public function all(): array
    {
        $stored = Cache::rememberForever(self::CACHE_KEY, function (): array {
            if (! Schema::hasTable('settings')) {
                return [];
            }

            return Setting::query()->pluck('value', 'key')->all();
        });

        return array_replace(self::DEFAULTS, $stored);
    }

    public function get(string $key, mixed $default = null): mixed
    {
        $all = $this->all();

        if (array_key_exists($key, $all) && $all[$key] !== null && $all[$key] !== '') {
            return $all[$key];
        }

        return $default ?? (self::DEFAULTS[$key] ?? null);
    }

    /**
     * Value of a text setting in the given (or current) interface language.
     * Resolution order: the owner's "<key>.<locale>" value, the shipped default
     * for that language (lang/<locale>/site.php), then the Albanian value.
     */
    public function getLocalized(string $key, ?string $locale = null): mixed
    {
        $locale ??= app()->getLocale();

        if ($locale !== 'sq') {
            $stored = $this->all()["{$key}.{$locale}"] ?? null;
            if ($stored !== null && $stored !== '') {
                return $stored;
            }

            $fallback = trans("site.{$key}", [], $locale);
            if (is_string($fallback) && $fallback !== "site.{$key}") {
                return $fallback;
            }
        }

        return $this->get($key);
    }

    /**
     * @param  array<string, mixed>  $values
     */
    public function set(array $values): void
    {
        foreach ($values as $key => $value) {
            Setting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->flush();
    }

    public function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
