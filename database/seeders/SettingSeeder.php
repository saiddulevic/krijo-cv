<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Support\SiteSettings;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Insert default settings without overwriting values the owner has changed.
     */
    public function run(): void
    {
        foreach (SiteSettings::DEFAULTS as $key => $value) {
            Setting::query()->firstOrCreate(['key' => $key], ['value' => $value]);
        }

        app(SiteSettings::class)->flush();
    }
}
