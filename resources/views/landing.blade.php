@php
    $l = fn (string $key, array $replace = []) => __('landing.'.$slug.'.'.$key, $replace);
    $ctaUrl = route('builder', (array) ($page['builder'] ?? []));
    $tips = (array) trans('landing.'.$slug.'.tips');
    $jsonLd = [[
        '@context' => 'https://schema.org',
        '@type' => 'WebPage',
        'name' => $l('title'),
        'description' => $l('meta'),
        'inLanguage' => app()->getLocale(),
        'url' => \App\Support\Seo::alternates($slug)[app()->getLocale()] ?? url($slug),
        'isPartOf' => ['@type' => 'WebSite', 'name' => $site->get('site.logo_text'), 'url' => url('/')],
    ]];
@endphp
<x-layouts.public :title="$l('title')" :meta-description="$l('meta')" :json-ld="$jsonLd">
    <section class="border-b border-line">
        <div class="site-container py-14 sm:py-20">
            <div class="max-w-3xl">
                <p class="eyebrow">{{ __('landing.eyebrow') }}</p>
                <h1 class="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{{ $l('h1') }}</h1>
                <p class="mt-6 text-lg leading-relaxed text-ink-muted">{{ $l('intro') }}</p>
                <div class="mt-8 flex flex-wrap gap-3">
                    <x-filament::button tag="a" :href="$ctaUrl" size="xl" icon="heroicon-m-plus">{{ $l('cta') }}</x-filament::button>
                    <x-filament::button tag="a" :href="route('builder', array_merge((array) ($page['builder'] ?? []), ['shembull' => 1]))" size="xl" color="gray" outlined icon="heroicon-m-sparkles">
                        {{ __('ui.builder.sample') }}
                    </x-filament::button>
                </div>
            </div>
        </div>
    </section>

    @if (count($tips))
        <section class="site-container py-14" aria-label="{{ $l('title') }}">
            <ol class="grid gap-6 md:grid-cols-2">
                @foreach ($tips as $index => $tip)
                    <li class="step-card">
                        <span class="step-card-number" aria-hidden="true">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</span>
                        <h2 class="mt-4 text-lg font-semibold">{{ $tip['title'] }}</h2>
                        <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ $tip['text'] }}</p>
                    </li>
                @endforeach
            </ol>
        </section>
    @endif

    @if ($templates->isNotEmpty())
        <section class="border-y border-line bg-surface-muted" aria-label="{{ __('ui.home.templates_eyebrow') }}">
            <div class="site-container py-14">
                <ul class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                    @foreach ($templates as $template)
                        <li>
                            <a href="{{ route('builder', ['model' => $template->slug]) }}" class="template-card group" aria-label="{{ __('ui.home.templates_use', ['name' => $template->localizedName()]) }}">
                                <span class="template-thumb-wrap">
                                    <img src="{{ $template->thumbnailUrl() }}" alt="{{ __('ui.home.templates_alt', ['name' => $template->localizedName()]) }}" class="template-thumb" loading="lazy" width="416" height="589">
                                </span>
                                <span class="flex flex-1 flex-col gap-1 p-3">
                                    <span class="font-semibold">{{ $template->localizedName() }}</span>
                                    <span class="text-xs leading-relaxed text-ink-muted">{{ $template->localizedDescription() }}</span>
                                </span>
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>
        </section>
    @endif

    <section class="site-container py-14" aria-labelledby="lexo-edhe">
        <h2 id="lexo-edhe" class="text-xl font-bold tracking-tight">{{ __('landing.related') }}</h2>
        <ul class="mt-4 grid gap-3 sm:grid-cols-3">
            @foreach (array_keys((array) config('krijo.landing', [])) as $other)
                @continue($other === $slug)
                <li>
                    <a href="{{ route('landing', $other) }}" class="related-card">
                        <span class="font-semibold">{{ __('landing.'.$other.'.title') }}</span>
                        <x-filament::icon icon="heroicon-m-arrow-right" class="h-4 w-4 text-brand" />
                    </a>
                </li>
            @endforeach
        </ul>
    </section>

    <section class="cta-band" aria-labelledby="landing-cta">
        <div class="site-container flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 id="landing-cta" class="text-3xl font-bold tracking-tight">{{ __('landing.final_title') }}</h2>
                <p class="mt-2 text-white/85">{{ __('landing.final_text') }}</p>
            </div>
            <a href="{{ $ctaUrl }}" class="cta-button">
                <x-filament::icon icon="heroicon-m-plus" class="h-5 w-5" />
                {{ $l('cta') }}
            </a>
        </div>
    </section>
</x-layouts.public>
