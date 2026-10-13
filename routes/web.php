<?php

use App\Http\Controllers\BuilderController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PrivacyController;
use App\Http\Controllers\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');

Route::middleware('locale')->group(function (): void {
    Route::get('/', HomeController::class)->name('home');
    Route::get('/krijo', BuilderController::class)->name('builder');
    Route::get('/privatesia', PrivacyController::class)->name('privacy');
    Route::get('/gjuha/{locale}', LocaleController::class)->name('locale.switch')->where('locale', '[a-z]{2}');
    Route::get('/{slug}', LandingController::class)
        ->whereIn('slug', array_keys((array) config('krijo.landing', [])))
        ->name('landing');
});
