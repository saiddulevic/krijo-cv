<aside class="lg:sticky lg:top-24" aria-labelledby="parapamja-titulli">
    <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
            <h2 id="parapamja-titulli" class="text-lg font-semibold">{{ $b('preview_heading') }}</h2>
            <p class="text-sm text-ink-muted">
                <span x-show="preview.state === 'ready' || preview.state === 'updating'">
                    <span x-text="previewDoc === 'cv' && selectedTemplate ? selectedTemplate.name : (previewDoc === 'letter' ? @js($b('preview_letter')) : '')"></span>
                    · <span x-text="pagesLabel"></span>
                </span>
                <span x-show="preview.state === 'loading'">{{ $b('preview_loading') }}</span>
                <span x-show="preview.state === 'idle'">{{ $b('preview_idle') }}</span>
            </p>
        </div>
        <div class="flex items-center gap-2">
            <x-filament::loading-indicator class="h-5 w-5 text-ink-muted" x-show="preview.state === 'loading' || preview.state === 'updating'" />
            <x-filament::button size="sm" icon="heroicon-m-arrow-down-tray" x-on:click="downloadPreviewed()" x-bind:disabled="!canDownloadPreviewed || downloading">
                {{ $b('download_pdf') }}
            </x-filament::button>
        </div>
    </div>

    <div class="mt-3 preview-switch" role="group" aria-label="{{ $b('preview_mode_aria') }}">
        <button type="button" class="preview-switch-button" x-on:click="previewDoc = 'cv'" x-bind:aria-pressed="previewDoc === 'cv' ? 'true' : 'false'">{{ $b('preview_cv') }}</button>
        <button type="button" class="preview-switch-button" x-on:click="previewDoc = 'letter'" x-bind:aria-pressed="previewDoc === 'letter' ? 'true' : 'false'">{{ $b('preview_letter') }}</button>
    </div>

    <template x-if="preview.state === 'error'">
        <div class="mt-3">
            <x-filament::callout color="danger" icon="heroicon-o-exclamation-triangle">
                <x-slot name="description"><span x-text="preview.error"></span></x-slot>
                <x-slot name="controls">
                    <x-filament::button size="sm" color="gray" outlined x-on:click="schedulePreview(0)">{{ $b('preview_retry') }}</x-filament::button>
                </x-slot>
            </x-filament::callout>
        </div>
    </template>

    <div
        class="mt-4 rounded-xl border border-line bg-surface-muted p-3 sm:p-4 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto"
        x-bind:class="{ 'opacity-60': preview.state === 'updating' }"
    >
        <div x-ref="previewPages" aria-live="off" aria-label="{{ $b('preview_pages_aria') }}"></div>
        <div class="flex aspect-[210/297] w-full items-center justify-center text-sm text-ink-muted" x-show="preview.state === 'idle' || preview.state === 'loading'">
            <span x-show="preview.state === 'loading'">{{ $b('preview_wait') }}</span>
        </div>
    </div>
    <p class="mt-2 text-xs text-ink-muted">{{ $b('preview_note') }}</p>
</aside>
