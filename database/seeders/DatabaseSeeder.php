<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seeds site settings, FAQ entries and the 10 CV templates.
     * Administrator accounts are never seeded: use `php artisan krijo:make-admin`.
     */
    public function run(): void
    {
        $this->call([
            SettingSeeder::class,
            FaqSeeder::class,
            CvTemplateSeeder::class,
        ]);
    }
}
