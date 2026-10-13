<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Interface and document languages
    |--------------------------------------------------------------------------
    |
    | Languages offered by the switcher in the header and selectable as the
    | language of the CV document. Keys are locale codes, values the native
    | names shown to visitors. Albanian stays the default and the fallback.
    |
    */

    'default_locale' => 'sq',

    'locales' => [
        'sq' => 'Shqip',
        'en' => 'English',
        'it' => 'Italiano',
        'de' => 'Deutsch',
        'es' => 'Español',
    ],

    /*
    |--------------------------------------------------------------------------
    | Open Graph locales
    |--------------------------------------------------------------------------
    */

    'og_locales' => [
        'sq' => 'sq_AL',
        'en' => 'en_GB',
        'it' => 'it_IT',
        'de' => 'de_DE',
        'es' => 'es_ES',
    ],

    /*
    |--------------------------------------------------------------------------
    | Landing pages
    |--------------------------------------------------------------------------
    |
    | Topic pages for search engines. Texts live in lang/<locale>/landing.php
    | under the same key; "builder" holds the query string of the call to
    | action (CV language or the step to open).
    |
    */

    'landing' => [
        'cv-ne-anglisht' => ['builder' => ['gjuha_cv' => 'en'], 'gallery' => false],
        'cv-ne-italisht' => ['builder' => ['gjuha_cv' => 'it'], 'gallery' => false],
        'cv-ne-gjermanisht' => ['builder' => ['gjuha_cv' => 'de'], 'gallery' => false],
        'cv-ne-spanjisht' => ['builder' => ['gjuha_cv' => 'es'], 'gallery' => false],
        'leter-motivimi' => ['builder' => ['hapi' => 4], 'gallery' => false],
        'modele-cv' => ['builder' => [], 'gallery' => true],
    ],

];
