<x-layouts.public :title="__('ui.privacy.title')">
    <article class="site-container max-w-3xl py-14">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ __('ui.privacy.title') }}</h1>
        <p class="mt-3 text-sm text-ink-muted">{{ __('ui.privacy.subtitle', ['name' => $site->get('site.name')]) }}</p>

        <div class="prose-privacy mt-8 text-base">
            @foreach (preg_split('/\R{2,}/', trim((string) $site->getLocalized('privacy.text'))) as $paragraph)
                @if (trim($paragraph) !== '')
                    <p>{!! nl2br(e(trim($paragraph))) !!}</p>
                @endif
            @endforeach

            <h2 class="mb-2 mt-8 text-lg font-semibold text-ink">{{ __('ui.privacy.verify_title') }}</h2>
            <p>{{ __('ui.privacy.verify_text') }}</p>

            @if (filled($sourceUrl = $site->get('source.url')))
                <h2 class="mb-2 mt-8 text-lg font-semibold text-ink">{{ __('ui.privacy.source_title') }}</h2>
                <p>{{ __('ui.privacy.source_text') }}</p>
                <p>
                    <x-filament::button tag="a" href="{{ $sourceUrl }}" color="gray" outlined icon="heroicon-m-code-bracket" target="_blank" rel="noopener">
                        {{ __('ui.privacy.source_link') }}
                    </x-filament::button>
                </p>
            @endif

            <h2 class="mb-2 mt-8 text-lg font-semibold text-ink">{{ __('ui.privacy.cookies_title') }}</h2>
            <p>{{ __('ui.privacy.cookies_text') }}</p>
        </div>

        <p class="mt-10">
            <x-filament::button tag="a" href="{{ route('builder') }}" icon="heroicon-m-plus">{{ __('ui.privacy.create') }}</x-filament::button>
        </p>
    </article>
</x-layouts.public>
