@php
    $b = fn (string $key, array $replace = []) => __('ui.builder.'.$key, $replace);
@endphp
<x-layouts.public :title="$b('title')" robots="noindex, nofollow">
    <div
        x-data="cvBuilder(@js($config))"
        x-cloak
        class="site-container py-6 pb-28 sm:py-8 sm:pb-28 lg:pb-8"
    >
        {{-- Toolbar --}}
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-2xl font-bold tracking-tight">{{ $b('title') }}</h1>
                <p class="mt-1 text-sm text-ink-muted"><span x-text="t('step_of', { step: step, total: totalSteps })"></span> <span x-text="stepTitle"></span></p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-1" role="group" aria-label="{{ $b('undo') }} / {{ $b('redo') }}">
                    <x-filament::icon-button icon="heroicon-m-arrow-uturn-left" color="gray" :label="$b('undo').' (Ctrl+Z)'" x-on:click="undo()" x-bind:disabled="!history.canUndo" />
                    <x-filament::icon-button icon="heroicon-m-arrow-uturn-right" color="gray" :label="$b('redo').' (Ctrl+Y)'" x-on:click="redo()" x-bind:disabled="!history.canRedo" />
                </div>
                <button type="button" class="quality-chip" x-on:click="showQuality()" x-bind:data-grade="quality.grade" aria-label="{{ $b('quality_heading') }}">
                    <span class="quality-chip-score" x-text="quality.score"></span>
                    <span class="hidden sm:inline">{{ $b('quality_heading') }}</span>
                </button>
                <input type="file" accept=".json,application/json" class="sr-only" x-ref="importInput" x-on:change="onImportSelected($event)" tabindex="-1" aria-hidden="true">
                <x-filament::button color="gray" outlined icon="heroicon-m-arrow-up-tray" x-on:click="$refs.importInput.click()">
                    {{ $b('import') }}
                </x-filament::button>
                <x-filament::button color="gray" outlined icon="heroicon-m-arrow-down-tray" x-on:click="exportProject()">
                    {{ $b('save') }}
                </x-filament::button>
                <x-filament::dropdown placement="bottom-end">
                    <x-slot name="trigger">
                        <x-filament::icon-button icon="heroicon-m-ellipsis-horizontal" color="gray" :label="$b('more')" size="lg" />
                    </x-slot>
                    <x-filament::dropdown.list>
                        <x-filament::dropdown.list.item icon="heroicon-m-sparkles" x-on:click="close(); loadSample()">
                            {{ $b('sample') }}
                        </x-filament::dropdown.list.item>
                        <x-filament::dropdown.list.item icon="heroicon-m-document-plus" x-on:click="close(); newProject()">
                            {{ $b('new') }}
                        </x-filament::dropdown.list.item>
                        <x-filament::dropdown.list.item icon="heroicon-m-trash" color="danger" x-on:click="close(); confirmClearDevice()">
                            {{ $b('clear_device') }}
                        </x-filament::dropdown.list.item>
                    </x-filament::dropdown.list>
                </x-filament::dropdown>
            </div>
        </div>

        {{-- Notices --}}
        <div class="mt-4" role="status" aria-live="polite">
            <template x-if="notice.text">
                <x-filament::callout x-bind:color="notice.type" icon="heroicon-o-information-circle">
                    <x-slot name="description"><span x-text="notice.text"></span></x-slot>
                </x-filament::callout>
            </template>
        </div>

        {{-- Offline notice --}}
        <div class="mt-4" x-show="!online" x-cloak>
            <x-filament::callout color="warning" icon="heroicon-o-signal-slash">
                <x-slot name="description">{{ $b('offline_notice') }}</x-slot>
            </x-filament::callout>
        </div>

        {{-- Import panel --}}
        <div class="mt-4" x-show="importFocus || importError" x-cloak>
            <x-filament::section :heading="$b('import_heading')" icon="heroicon-o-arrow-up-tray" compact>
                <p class="text-sm text-ink-muted">{!! $b('import_text') !!}</p>
                <template x-if="importError">
                    <div class="mt-3">
                        <x-filament::callout color="danger" icon="heroicon-o-exclamation-triangle" :heading="$b('import_failed')">
                            <x-slot name="description"><span x-text="importError"></span></x-slot>
                        </x-filament::callout>
                    </div>
                </template>
                <div class="mt-4 flex flex-wrap gap-2">
                    <x-filament::button icon="heroicon-m-folder-open" x-on:click="$refs.importInput.click()" x-bind:disabled="importing">
                        <span x-show="!importing">{{ $b('import_choose') }}</span>
                        <span x-show="importing">{{ $b('import_running') }}</span>
                    </x-filament::button>
                    <x-filament::button color="gray" outlined x-on:click="importFocus = false; importError = ''">{{ $b('close') }}</x-filament::button>
                </div>
            </x-filament::section>
        </div>

        {{-- Steps --}}
        <nav aria-label="{{ $b('steps_aria') }}" class="mt-6">
            <ol class="grid grid-cols-2 gap-2 sm:grid-cols-5">
                <template x-for="s in steps" :key="s.number">
                    <li>
                        <button
                            type="button"
                            class="step-button"
                            x-on:click="goTo(s.number)"
                            x-bind:aria-current="step === s.number ? 'step' : null"
                            x-bind:data-complete="isStepComplete(s.number) ? 'true' : 'false'"
                        >
                            <span class="step-index" x-text="s.number" aria-hidden="true"></span>
                            <span>
                                <span class="block font-medium" x-text="s.short"></span>
                                <span class="hidden text-xs text-ink-muted lg:block" x-text="s.title"></span>
                            </span>
                        </button>
                    </li>
                </template>
            </ol>
        </nav>

        {{-- Mobile tabs --}}
        <div class="sticky top-16 z-20 -mx-4 mt-4 border-b border-line bg-white px-4 py-2 lg:hidden">
            <x-filament::tabs :label="$b('tabs_aria')">
                <x-filament::tabs.item alpine-active="mobileTab === 'edit'" x-on:click="mobileTab = 'edit'" icon="heroicon-m-pencil-square">
                    {{ $b('tab_edit') }}
                </x-filament::tabs.item>
                <x-filament::tabs.item alpine-active="mobileTab === 'preview'" x-on:click="mobileTab = 'preview'" icon="heroicon-m-eye">
                    {{ $b('tab_preview') }}
                </x-filament::tabs.item>
            </x-filament::tabs>
        </div>

        <div class="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
            {{-- Form column --}}
            <div x-bind:class="mobileTab === 'edit' ? '' : 'hidden lg:block'">
                @include('builder.step-personal')
                @include('builder.step-experience')
                @include('builder.step-sections')
                @include('builder.step-letter')
                @include('builder.step-design')

                <div class="mt-8 hidden items-center justify-between gap-3 border-t border-line pt-6 lg:flex">
                    <x-filament::button color="gray" outlined icon="heroicon-m-arrow-left" x-on:click="prev()" x-bind:disabled="step === 1">
                        {{ $b('back') }}
                    </x-filament::button>
                    <template x-if="step < totalSteps">
                        <x-filament::button icon="heroicon-m-arrow-right" icon-position="after" x-on:click="next()">
                            {{ $b('next') }}
                        </x-filament::button>
                    </template>
                    <template x-if="step === totalSteps">
                        <x-filament::button icon="heroicon-m-arrow-down-tray" x-on:click="downloadPdf()" x-bind:disabled="!canDownload || downloading">
                            {{ $b('download_pdf') }}
                        </x-filament::button>
                    </template>
                </div>
            </div>

            {{-- Preview column --}}
            <div x-bind:class="mobileTab === 'preview' ? '' : 'hidden lg:block'">
                @include('builder.preview')
            </div>
        </div>

        {{-- Mobile action bar --}}
        <div class="mobile-bar lg:hidden" role="group" aria-label="{{ $b('mobile_bar_aria') }}">
            <x-filament::icon-button icon="heroicon-m-arrow-left" color="gray" :label="$b('back')" x-on:click="prev()" x-bind:disabled="step === 1" />
            <x-filament::button class="flex-1" icon="heroicon-m-arrow-down-tray" x-on:click="downloadPreviewed()" x-bind:disabled="!canDownloadPreviewed || downloading">
                {{ $b('download_pdf') }}
            </x-filament::button>
            <x-filament::icon-button icon="heroicon-m-arrow-right" color="gray" :label="$b('next')" x-on:click="next()" x-bind:disabled="step === totalSteps" />
        </div>

        @include('builder.modals')
    </div>
</x-layouts.public>
