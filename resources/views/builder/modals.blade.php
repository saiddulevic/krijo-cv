{{-- Resume a project saved on this device --}}
<x-filament::modal id="resume-modal" :heading="$b('resume_heading')" icon="heroicon-o-clock" width="md" :close-by-clicking-away="false">
    <p class="text-sm text-ink-muted">
        {{ $b('resume_text') }}<span x-show="savedAtText"> {{ $b('resume_on') }} <span x-text="savedAtText"></span></span>.
        {{ $b('resume_question') }}
    </p>
    <p class="mt-2 text-xs text-ink-muted">{{ $b('resume_note') }}</p>
    <x-slot name="footerActions">
        <x-filament::button icon="heroicon-m-arrow-path" x-on:click="resumeSaved()">{{ $b('resume_continue') }}</x-filament::button>
        <x-filament::button color="gray" outlined x-on:click="discardSaved()">{{ $b('resume_new') }}</x-filament::button>
    </x-slot>
</x-filament::modal>

{{-- Generic confirmation --}}
<x-filament::modal id="confirm-modal" width="sm" alignment="center" icon="heroicon-o-exclamation-triangle" icon-color="danger">
    <x-slot name="heading"><span x-text="confirm.title"></span></x-slot>
    <p class="text-sm text-ink-muted" x-text="confirm.text"></p>
    <x-slot name="footerActions">
        <x-filament::button color="danger" x-on:click="runConfirm()"><span x-text="confirm.label"></span></x-filament::button>
        <x-filament::button color="gray" outlined x-on:click="closeModal('confirm-modal')">{{ $b('cancel') }}</x-filament::button>
    </x-slot>
</x-filament::modal>

{{-- Writing help --}}
<x-filament::modal id="phrases-modal" :heading="$b('phrases_heading')" :description="$b('phrases_intro')" icon="heroicon-o-light-bulb" width="2xl" slide-over x-on:close-modal.window="if ($event.detail.id === 'phrases-modal') phrases.open = false">
    <div class="space-y-5">
        <p class="text-sm text-ink-muted" x-show="phrases.loading">{{ $b('phrases_loading') }}</p>
        <template x-if="phrases.data">
            <div class="space-y-5">
                <x-field :label="$b('phrases_profession')" for="phrases-profession" :hint="$b('phrases_language_note')">
                    <x-filament::input.wrapper>
                        <x-filament::input.select id="phrases-profession" x-model="phrases.profession">
                            <template x-for="option in professionOptions" :key="option.id">
                                <option x-bind:value="option.id" x-text="option.label"></option>
                            </template>
                        </x-filament::input.select>
                    </x-filament::input.wrapper>
                </x-field>

                <template x-if="phrases.target && phrases.target.kind === 'summary'">
                    <div>
                        <h3 class="font-semibold">{{ $b('phrases_summaries') }}</h3>
                        <ul class="mt-2 space-y-2">
                            <template x-for="text in phraseSet.summaries" :key="text">
                                <li class="phrase-item">
                                    <span class="flex-1 text-sm" x-text="text"></span>
                                    <x-filament::button size="xs" color="gray" outlined icon="heroicon-m-plus" x-on:click="insertSummary(text)">{{ $b('phrases_add') }}</x-filament::button>
                                </li>
                            </template>
                        </ul>
                    </div>
                </template>

                <template x-if="phrases.target && phrases.target.kind === 'bullets'">
                    <div class="space-y-5">
                        <div>
                            <h3 class="font-semibold">{{ $b('phrases_bullets') }}</h3>
                            <ul class="mt-2 space-y-2">
                                <template x-for="text in phraseSet.bullets" :key="text">
                                    <li class="phrase-item">
                                        <span class="flex-1 text-sm" x-text="text"></span>
                                        <x-filament::button size="xs" color="gray" outlined icon="heroicon-m-plus" x-on:click="insertBullet(text)">{{ $b('phrases_add') }}</x-filament::button>
                                    </li>
                                </template>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-semibold">{{ $b('phrases_verbs') }}</h3>
                            <div class="mt-2 flex flex-wrap gap-2">
                                <template x-for="verb in phraseSet.verbs" :key="verb">
                                    <button type="button" class="phrase-chip" x-on:click="insertVerb(verb)" x-text="verb"></button>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>

                <template x-if="phrases.target && phrases.target.kind === 'skills'">
                    <div>
                        <h3 class="font-semibold">{{ $b('phrases_skills') }}</h3>
                        <div class="mt-2 flex flex-wrap gap-2">
                            <template x-for="name in phraseSet.skills" :key="name">
                                <button type="button" class="phrase-chip" x-on:click="addSuggestedSkill(name)" x-bind:aria-pressed="hasSkill(name) ? 'true' : 'false'" x-bind:disabled="hasSkill(name)">
                                    <span x-text="name"></span>
                                </button>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>
</x-filament::modal>

{{-- Photo cropper --}}
<x-filament::modal id="photo-cropper" :heading="$b('cropper_heading')" :description="$b('cropper_text')" width="lg" :close-by-clicking-away="false" x-on:close-modal.window="if ($event.detail.id === 'photo-cropper') cropper.open = false">
    <div x-data="photoCropper" class="flex flex-col items-center gap-4">
        <p class="field-error" x-show="error" x-text="error" role="alert"></p>
        <div
            class="cropper-viewport relative aspect-square w-full max-w-[320px] overflow-hidden rounded-lg border border-line bg-surface-muted"
            tabindex="0"
            role="application"
            aria-label="{{ $b('cropper_aria') }}"
            x-on:pointerdown.prevent="pointerDown($event)"
            x-on:pointermove.prevent="pointerMove($event)"
            x-on:pointerup="pointerUp($event)"
            x-on:pointercancel="pointerUp($event)"
            x-on:keydown="onKey($event)"
            x-bind:class="dragging ? 'cursor-grabbing' : 'cursor-grab'"
        >
            <canvas x-ref="canvas" class="block h-full w-full" aria-hidden="true"></canvas>
            <div class="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-inset ring-white/70" aria-hidden="true"></div>
            <div class="absolute inset-0 flex items-center justify-center bg-white/70 text-sm" x-show="loading">{{ $b('cropper_loading') }}</div>
        </div>

        <div class="w-full max-w-[320px]">
            <label for="cropper-zoom" class="field-label">{{ $b('cropper_zoom') }}</label>
            <input
                id="cropper-zoom"
                type="range"
                min="1"
                max="4"
                step="0.01"
                class="w-full"
                x-bind:value="zoom"
                x-on:input="setZoom($event.target.value)"
                x-bind:disabled="!img"
            >
        </div>

        <div class="flex flex-wrap justify-center gap-2">
            <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-arrow-uturn-left" x-on:click="reset()" x-bind:disabled="!img">{{ $b('cropper_reset') }}</x-filament::button>
            <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-photo" x-on:click="$refs.photoInput.click()">{{ $b('cropper_other') }}</x-filament::button>
        </div>

        <div class="flex w-full justify-end gap-2 border-t border-line pt-4">
            <x-filament::button color="gray" outlined x-on:click="closeCropper()">{{ $b('cancel') }}</x-filament::button>
            <x-filament::button icon="heroicon-m-check" x-on:click="apply()" x-bind:disabled="!img">{{ $b('cropper_apply') }}</x-filament::button>
        </div>
    </div>
</x-filament::modal>
