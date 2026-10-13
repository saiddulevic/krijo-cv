<?php

namespace App\Providers;

use App\Support\Brand;
use App\Support\SiteSettings;
use Filament\Support\Facades\FilamentColor;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(SiteSettings::class);
    }

    public function boot(): void
    {
        // Brand colour for the Filament Blade components rendered on the public site.
        FilamentColor::register([
            'primary' => Brand::palette(),
        ]);

        View::composer(['components.layouts.public', 'home', 'builder', 'privacy', 'landing'], function ($view): void {
            $view->with('site', $this->app->make(SiteSettings::class));
        });
    }
}
