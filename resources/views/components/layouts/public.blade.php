@php
    $logoText = (string) $site->get('site.logo_text');
    $logoRest = trim((string) preg_replace('/^CV\s+/iu', '', $logoText));
    $logoRest = $logoRest !== '' ? $logoRest : $logoText;
    $locale = app()->getLocale();
    $pageTitle = isset($title) ? $title.' – '.$site->get('site.name') : $site->get('site.name').' – '.$site->getLocalized('site.headline');
    $pageDescription = $metaDescription ?? $site->getLocalized('site.meta_description');
    $robotsValue = $robots ?? 'index, follow';
    $indexable = ! str_contains($robotsValue, 'noindex');
    $alternates = \App\Support\Seo::alternates(request()->path());
    $canonical = $alternates[$locale] ?? url()->current();
    $ogLocales = (array) config('krijo.og_locales', []);
    $ogImage = asset('images/og/og-'.$locale.'.png');
@endphp
<!DOCTYPE html>
<html lang="{{ $locale }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="application-name" content="{{ $site->get('site.name') }}">
    <meta name="description" content="{{ $pageDescription }}">
    <meta name="robots" content="{{ $robotsValue }}">
    <meta name="theme-color" content="#ffffff">
    <title>{{ $pageTitle }}</title>

    @if ($indexable)
        <link rel="canonical" href="{{ $canonical }}">
        @foreach ($alternates as $code => $href)
            <link rel="alternate" hreflang="{{ $code }}" href="{{ $href }}">
        @endforeach
        <link rel="alternate" hreflang="x-default" href="{{ $alternates[config('krijo.default_locale', 'sq')] ?? $canonical }}">
    @endif

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $site->get('site.logo_text') }}">
    <meta property="og:title" content="{{ $pageTitle }}">
    <meta property="og:description" content="{{ $pageDescription }}">
    <meta property="og:url" content="{{ $canonical }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="{{ $ogLocales[$locale] ?? 'sq_AL' }}">
    @foreach ($ogLocales as $code => $ogLocale)
        @if ($code !== $locale)
            <meta property="og:locale:alternate" content="{{ $ogLocale }}">
        @endif
    @endforeach
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $pageTitle }}">
    <meta name="twitter:description" content="{{ $pageDescription }}">
    <meta name="twitter:image" content="{{ $ogImage }}">

    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('icons/apple-touch-icon.png') }}">
    <link rel="manifest" href="{{ asset('manifest.webmanifest') }}">
    <link rel="preload" href="{{ asset('fonts/inter/Inter-Regular.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="{{ asset('fonts/inter/Inter-SemiBold.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="{{ asset('fonts/inter/Inter-Bold.woff2') }}" as="font" type="font/woff2" crossorigin>

    @isset($jsonLd)
        @foreach ((array) $jsonLd as $schema)
            <script type="application/ld+json">{!! json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP) !!}</script>
        @endforeach
    @endisset

    @filamentStyles(['filament/support'])
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen flex flex-col bg-white text-ink">
    <a href="#permbajtja" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        {{ __('ui.nav.skip') }}
    </a>

    <header class="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div class="site-container flex h-16 items-center justify-between gap-3">
            <a href="{{ route('home') }}" class="site-logo" aria-label="{{ __('ui.nav.home_aria', ['name' => $logoText]) }}">
                <span class="site-logo-mark" aria-hidden="true">CV</span>
                <span class="site-logo-text">{{ $logoRest }}</span>
            </a>

            <nav aria-label="{{ __('ui.nav.main_aria') }}" class="flex items-center gap-1 sm:gap-2">
                <a href="{{ route('home') }}#modelet" class="site-nav-link hidden md:inline-flex">{{ __('ui.nav.templates') }}</a>
                <a href="{{ route('home') }}#pyetjet" class="site-nav-link hidden md:inline-flex">{{ __('ui.nav.faq') }}</a>
                <a href="{{ route('privacy') }}" class="site-nav-link hidden md:inline-flex">{{ __('ui.nav.privacy') }}</a>

                <div class="lang-switch" role="group" aria-label="{{ __('ui.nav.language') }}">
                    @foreach ((array) config('krijo.locales', []) as $code => $name)
                        <a
                            href="{{ request()->fullUrlWithQuery(['lang' => $code]) }}"
                            lang="{{ $code }}"
                            hreflang="{{ $code }}"
                            title="{{ $name }}"
                            class="lang-switch-link"
                            @if ($locale === $code) aria-current="true" @endif
                        >{{ strtoupper($code) }}</a>
                    @endforeach
                </div>

                @unless (request()->routeIs('builder'))
                    <x-filament::button tag="a" href="{{ route('builder') }}" size="sm" icon="heroicon-m-plus" class="ms-1 hidden sm:inline-flex">
                        {{ __('ui.nav.create') }}
                    </x-filament::button>
                @endunless
            </nav>
        </div>
    </header>

    <main id="permbajtja" class="flex-1">
        {{ $slot }}
    </main>

    <footer class="border-t border-line bg-surface-muted">
        <div class="site-container py-10">
            <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div class="max-w-sm">
                    <a href="{{ route('home') }}" class="site-logo" aria-label="{{ __('ui.nav.home_aria', ['name' => $logoText]) }}">
                        <span class="site-logo-mark" aria-hidden="true">CV</span>
                        <span class="site-logo-text">{{ $logoRest }}</span>
                    </a>
                    <p class="mt-3 text-sm leading-relaxed text-ink-muted">{{ $site->getLocalized('site.description') }}</p>
                    <div x-data x-show="$store.pwa && $store.pwa.canInstall" x-cloak class="mt-4">
                        <x-filament::button size="sm" color="gray" outlined icon="heroicon-m-device-phone-mobile" x-on:click="$store.pwa.install()">
                            {{ __('ui.nav.install') }}
                        </x-filament::button>
                    </div>
                </div>
                <div class="grid gap-8 sm:grid-cols-2">
                    <nav aria-label="{{ __('ui.footer.links_aria') }}">
                        <ul class="space-y-2 text-sm">
                            <li><a href="{{ route('builder') }}" class="site-footer-link">{{ __('ui.footer.create') }}</a></li>
                            <li><a href="{{ route('builder', ['importo' => 1]) }}" class="site-footer-link">{{ __('ui.footer.import') }}</a></li>
                            <li><a href="{{ route('home') }}#pyetjet" class="site-footer-link">{{ __('ui.footer.faq') }}</a></li>
                            <li><a href="{{ route('privacy') }}" class="site-footer-link">{{ __('ui.nav.privacy') }}</a></li>
                            @if (filled($site->get('source.url')))
                                <li><a href="{{ $site->get('source.url') }}" class="site-footer-link" rel="noopener">{{ __('ui.footer.source') }}</a></li>
                            @endif
                            @foreach ((array) $site->get('footer.links', []) as $link)
                                @if (is_array($link) && filled($link['label'] ?? null) && filled($link['url'] ?? null) && ! str_ends_with((string) $link['url'], '/privatesia'))
                                    <li><a href="{{ $link['url'] }}" class="site-footer-link">{{ $link['label'] }}</a></li>
                                @endif
                            @endforeach
                        </ul>
                    </nav>
                    <nav aria-label="{{ __('landing.related') }}">
                        <ul class="space-y-2 text-sm">
                            @foreach (array_keys((array) config('krijo.landing', [])) as $slug)
                                <li><a href="{{ route('landing', $slug) }}" class="site-footer-link">{{ __('landing.'.$slug.'.title') }}</a></li>
                            @endforeach
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
                <p>
                    {{ $site->getLocalized('footer.text') }}
                    <a href="{{ $site->get('footer.link_url') }}" class="site-link" rel="noopener">{{ $site->get('footer.link_label') }}</a>
                </p>
                <p>{{ __('ui.footer.data_note') }}</p>
            </div>
        </div>
    </footer>

    @filamentScripts(['filament/support'])
</body>
</html>
