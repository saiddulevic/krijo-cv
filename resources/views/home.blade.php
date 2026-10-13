@php
    $heroThumbs = $templates->whereIn('slug', ['elegant', 'bold', 'timeline'])->values();
    if ($heroThumbs->count() < 3) {
        $heroThumbs = $templates->take(3)->values();
    }
    $templateCount = $templates->count();
    $h = fn (string $key, array $replace = []) => __('ui.home.'.$key, $replace);
    $jsonLd = [
        [
            '@context' => 'https://schema.org',
            '@type' => 'WebApplication',
            'name' => $site->get('site.logo_text'),
            'alternateName' => $site->get('site.name'),
            'url' => url('/'),
            'description' => $site->getLocalized('site.meta_description'),
            'applicationCategory' => 'BusinessApplication',
            'operatingSystem' => 'Any',
            'browserRequirements' => 'Requires JavaScript',
            'inLanguage' => array_keys((array) config('krijo.locales', [])),
            'isAccessibleForFree' => true,
            'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'EUR'],
            'author' => ['@type' => 'Person', 'name' => $site->get('footer.link_label'), 'url' => $site->get('footer.link_url')],
        ],
    ];
    if ($faqs->isNotEmpty()) {
        $jsonLd[] = [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $faqs->map(fn ($faq) => [
                '@type' => 'Question',
                'name' => $faq->localizedQuestion(),
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq->localizedAnswer()],
            ])->values()->all(),
        ];
    }
@endphp
<x-layouts.public :json-ld="$jsonLd">
    {{-- Hero --}}
    <section class="relative overflow-hidden border-b border-line" x-data="homeResume">
        <div class="site-container grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:items-center lg:py-24">
            <div class="lg:col-span-6">
                <p class="eyebrow">{{ $h('eyebrow') }}</p>
                <h1 class="mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{{ $site->getLocalized('site.headline') }}</h1>
                <p class="mt-6 max-w-xl text-lg text-ink-muted sm:text-xl">{{ $site->getLocalized('site.description') }}</p>

                <div class="mt-8 flex flex-wrap items-center gap-3">
                    <x-filament::button tag="a" href="{{ route('builder') }}" size="xl" icon="heroicon-m-plus">
                        {{ $h('cta_create') }}
                    </x-filament::button>
                    <x-filament::button tag="a" href="{{ route('builder', ['importo' => 1]) }}" size="xl" color="gray" outlined icon="heroicon-m-arrow-up-tray">
                        {{ $h('cta_import') }}
                    </x-filament::button>
                    <template x-if="hasSaved">
                        <x-filament::button tag="a" href="{{ route('builder') }}" size="xl" color="gray" icon="heroicon-m-arrow-path">
                            {{ $h('cta_resume') }}
                        </x-filament::button>
                    </template>
                </div>

                <ul class="mt-8 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                    @foreach ([$h('point_data'), $h('point_pdf'), $h('point_templates', ['count' => $templateCount]), $h('point_letter')] as $item)
                        <li class="flex items-start gap-2">
                            <x-filament::icon icon="heroicon-m-check-circle" class="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                            <span>{{ $item }}</span>
                        </li>
                    @endforeach
                </ul>

                <p class="mt-6 text-sm">
                    <a href="{{ route('builder', ['shembull' => 1]) }}" class="site-link">{{ $h('try_sample') }}</a>
                </p>
            </div>

            <div class="lg:col-span-6">
                <div class="hero-stack" aria-hidden="true">
                    @foreach ($heroThumbs as $index => $template)
                        <img src="{{ $template->thumbnailUrl() }}" alt="" class="hero-card hero-card-{{ $index + 1 }}" width="416" height="589" loading="eager" decoding="async">
                    @endforeach
                </div>
            </div>
        </div>
    </section>

    {{-- Facts --}}
    <section class="border-b border-line bg-surface-muted" aria-label="{{ $h('glance_aria') }}">
        <div class="site-container grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
            @foreach ([
                ['heroicon-o-gift', $h('fact_free_title'), $h('fact_free_text')],
                ['heroicon-o-lock-closed', $h('fact_noreg_title'), $h('fact_noreg_text')],
                ['heroicon-o-shield-check', $h('fact_privacy_title'), $h('fact_privacy_text')],
                ['heroicon-o-squares-2x2', $h('fact_templates_title', ['count' => $templateCount]), $h('fact_templates_text')],
            ] as [$icon, $heading, $text])
                <div class="fact-card">
                    <x-filament::icon :icon="$icon" class="h-6 w-6 text-brand" />
                    <div>
                        <h2 class="font-semibold">{{ $heading }}</h2>
                        <p class="mt-1 text-sm text-ink-muted">{{ $text }}</p>
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    {{-- How it works --}}
    <section class="site-container py-16" aria-labelledby="si-funksionon">
        <div class="max-w-2xl">
            <p class="eyebrow">{{ $h('how_eyebrow') }}</p>
            <h2 id="si-funksionon" class="mt-2 text-3xl font-bold tracking-tight">{{ $h('how_title') }}</h2>
            <p class="mt-3 text-ink-muted">{{ $h('how_text') }}</p>
        </div>
        <ol class="mt-10 grid gap-6 md:grid-cols-3">
            @foreach ([
                [$h('how_1_title'), $h('how_1_text'), 'heroicon-o-pencil-square'],
                [$h('how_2_title'), $h('how_2_text', ['count' => $templateCount]), 'heroicon-o-swatch'],
                [$h('how_3_title'), $h('how_3_text'), 'heroicon-o-arrow-down-tray'],
            ] as $index => [$heading, $text, $icon])
                <li class="step-card">
                    <div class="flex items-center justify-between">
                        <span class="step-card-number" aria-hidden="true">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</span>
                        <x-filament::icon :icon="$icon" class="h-7 w-7 text-brand" />
                    </div>
                    <h3 class="mt-6 text-lg font-semibold">{{ $heading }}</h3>
                    <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ $text }}</p>
                </li>
            @endforeach
        </ol>
    </section>

    {{-- Templates --}}
    @if ($templates->isNotEmpty())
        <section id="modelet" class="scroll-mt-20 border-y border-line bg-surface-muted" aria-labelledby="modelet-titulli">
            <div class="site-container py-16">
                <div class="flex flex-wrap items-end justify-between gap-4">
                    <div class="max-w-2xl">
                        <p class="eyebrow">{{ $h('templates_eyebrow') }}</p>
                        <h2 id="modelet-titulli" class="mt-2 text-3xl font-bold tracking-tight">{{ $h('templates_title', ['count' => $templateCount]) }}</h2>
                        <p class="mt-3 text-ink-muted">{{ $h('templates_text') }}</p>
                    </div>
                    <x-filament::button tag="a" href="{{ route('builder') }}" color="gray" outlined icon="heroicon-m-arrow-right" icon-position="after">
                        {{ $h('templates_start') }}
                    </x-filament::button>
                </div>
                <ul class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                    @foreach ($templates as $template)
                        <li>
                            <a href="{{ route('builder', ['model' => $template->slug]) }}" class="template-card group" aria-label="{{ $h('templates_use', ['name' => $template->localizedName()]) }}">
                                <span class="template-thumb-wrap">
                                    <img src="{{ $template->thumbnailUrl() }}" alt="{{ $h('templates_alt', ['name' => $template->localizedName()]) }}" class="template-thumb" loading="lazy" width="416" height="589">
                                </span>
                                <span class="flex flex-1 flex-col gap-1 p-3">
                                    <span class="flex items-center justify-between gap-2">
                                        <span class="font-semibold">{{ $template->localizedName() }}</span>
                                        <x-filament::icon icon="heroicon-m-arrow-right" class="h-4 w-4 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
                                    </span>
                                    <span class="text-xs leading-relaxed text-ink-muted">{{ $template->localizedDescription() }}</span>
                                </span>
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>
        </section>
    @endif

    {{-- Why + privacy --}}
    <section class="site-container grid gap-12 py-16 lg:grid-cols-2" aria-labelledby="pse">
        <div>
            <p class="eyebrow">{{ $h('why_eyebrow') }}</p>
            <h2 id="pse" class="mt-2 text-3xl font-bold tracking-tight">{{ $h('why_title') }}</h2>
            <ul class="mt-6 space-y-4">
                @foreach ([
                    [$h('why_1_title'), $h('why_1_text')],
                    [$h('why_2_title'), $h('why_2_text')],
                    [$h('why_3_title'), $h('why_3_text')],
                    [$h('why_4_title'), $h('why_4_text')],
                ] as [$heading, $text])
                    <li class="flex gap-3">
                        <span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand" aria-hidden="true">
                            <x-filament::icon icon="heroicon-m-check" class="h-4 w-4" />
                        </span>
                        <div>
                            <h3 class="font-semibold">{{ $heading }}</h3>
                            <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ $text }}</p>
                        </div>
                    </li>
                @endforeach
            </ul>
        </div>

        <div class="privacy-card">
            <x-filament::icon icon="heroicon-o-shield-check" class="h-8 w-8 text-brand" />
            <h2 class="mt-4 text-2xl font-bold tracking-tight">{{ $h('privacy_title') }}</h2>
            <p class="mt-3 leading-relaxed text-ink-muted">{{ $h('privacy_p1') }}</p>
            <p class="mt-3 leading-relaxed text-ink-muted">{!! $h('privacy_p2') !!}</p>
            <p class="mt-5"><a href="{{ route('privacy') }}" class="site-link">{{ $h('privacy_link') }}</a></p>
        </div>
    </section>

    {{-- FAQ --}}
    @if ($faqs->isNotEmpty())
        <section id="pyetjet" class="scroll-mt-20 border-t border-line bg-surface-muted" aria-labelledby="pyetjet-titulli">
            <div class="site-container grid gap-10 py-16 lg:grid-cols-12">
                <div class="lg:col-span-4">
                    <p class="eyebrow">{{ $h('faq_eyebrow') }}</p>
                    <h2 id="pyetjet-titulli" class="mt-2 text-3xl font-bold tracking-tight">{{ $h('faq_title') }}</h2>
                    <p class="mt-3 text-ink-muted">{{ $h('faq_text') }}</p>
                </div>
                <div class="lg:col-span-8">
                    <div class="divide-y divide-line rounded-2xl border border-line bg-white px-5">
                        @foreach ($faqs as $faq)
                            <details class="faq-item">
                                <summary class="flex items-center justify-between gap-4">
                                    <span>{{ $faq->localizedQuestion() }}</span>
                                    <x-filament::icon icon="heroicon-m-chevron-down" class="faq-chevron h-5 w-5 shrink-0 text-ink-muted" />
                                </summary>
                                <p class="pb-4 leading-relaxed text-ink-muted">{{ $faq->localizedAnswer() }}</p>
                            </details>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>
    @endif

    {{-- Final call to action --}}
    <section class="cta-band" aria-labelledby="cta">
        <div class="site-container flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 id="cta" class="text-3xl font-bold tracking-tight">{{ $h('cta_title') }}</h2>
                <p class="mt-2 text-white/85">{{ $h('cta_text') }}</p>
            </div>
            <a href="{{ route('builder') }}" class="cta-button">
                <x-filament::icon icon="heroicon-m-plus" class="h-5 w-5" />
                {{ $h('cta_button') }}
            </a>
        </div>
    </section>
</x-layouts.public>
