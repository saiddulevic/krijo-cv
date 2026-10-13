<section x-show="step === 5" x-cloak aria-labelledby="hapi-5" class="space-y-8">
    <div>
        <h2 id="hapi-5" class="text-xl font-semibold">{{ $b('d_heading') }}</h2>
        <p class="mt-1 text-sm text-ink-muted">{{ $b('d_intro') }}</p>
    </div>

    {{-- Quality check --}}
    <div id="cv-quality" class="quality-card scroll-mt-24">
        <div class="flex flex-wrap items-center gap-4">
            <div class="quality-ring" x-bind:data-grade="quality.grade" x-bind:style="'--score:' + quality.score" role="img" x-bind:aria-label="quality.score + ' / 100'">
                <span x-text="quality.score"></span>
            </div>
            <div class="min-w-0 flex-1">
                <h3 class="text-lg font-semibold">{{ $b('quality_heading') }} · <span x-text="qualityGradeLabel"></span></h3>
                <p class="text-sm text-ink-muted">{{ $b('quality_intro') }}</p>
                <p class="mt-1 text-xs text-ink-muted"><span x-text="quality.passed"></span> / <span x-text="quality.checks.length"></span> {{ $b('quality_passed') }}</p>
            </div>
        </div>
        <ul class="mt-4 space-y-2" x-show="quality.issues.length">
            <template x-for="issue in quality.issues" :key="issue.id">
                <li class="quality-issue" x-bind:data-level="issue.level">
                    <x-filament::icon icon="heroicon-m-exclamation-circle" class="quality-issue-icon h-5 w-5 shrink-0" />
                    <span class="min-w-0 flex-1 text-sm" x-text="qualityMessage(issue)"></span>
                    <button type="button" class="site-link shrink-0 text-sm" x-on:click="goTo(issue.step)" x-show="issue.step !== step" x-text="t('q_step', { step: issue.step })"></button>
                </li>
            </template>
        </ul>
        <p class="mt-4 text-sm font-medium text-success-700" x-show="!quality.issues.length">{{ $b('quality_all_good') }}</p>
    </div>

    {{-- Templates --}}
    <div>
        <h3 class="text-lg font-semibold">{{ $b('choose_template') }}</h3>
        <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3" role="group" aria-label="{{ $b('templates_aria') }}">
            <template x-for="template in templates" :key="template.id">
                <button
                    type="button"
                    class="template-card"
                    x-on:click="selectTemplate(template.id)"
                    x-bind:aria-pressed="project.design.templateId === template.id ? 'true' : 'false'"
                >
                    <img x-bind:src="template.thumbnail" x-bind:alt="template.name" class="template-thumb" loading="lazy" width="416" height="589">
                    <span class="flex flex-1 flex-col gap-1 p-3">
                        <span class="flex items-center justify-between gap-2">
                            <span class="font-semibold" x-text="template.name"></span>
                            <x-filament::icon icon="heroicon-m-check-circle" class="h-5 w-5 text-brand" x-show="project.design.templateId === template.id" />
                        </span>
                        <span class="text-xs leading-relaxed text-ink-muted" x-text="template.description"></span>
                    </span>
                </button>
            </template>
        </div>
        <p class="mt-3 text-sm text-ink-muted" x-show="templates.length === 0">{{ $b('no_templates') }}</p>
    </div>

    {{-- Design options --}}
    <div class="grid gap-6 sm:grid-cols-2">
        <div>
            <h3 class="text-lg font-semibold">{{ $b('accent') }}</h3>
            <p class="mt-1 text-sm text-ink-muted">{{ $b('accent_hint') }}</p>
            <div class="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="{{ $b('accent_presets_aria') }}">
                <template x-for="preset in accentPresets" :key="preset.value">
                    <button
                        type="button"
                        class="swatch"
                        x-bind:style="'background-color:' + preset.value"
                        x-bind:aria-label="preset.label"
                        x-bind:title="preset.label"
                        x-bind:aria-pressed="project.design.accentColor === preset.value ? 'true' : 'false'"
                        x-on:click="setAccent(preset.value)"
                    ></button>
                </template>
            </div>
            <div class="mt-3 flex items-center gap-3">
                <label for="accent-color" class="text-sm">{{ $b('other_color') }}</label>
                <x-filament::input.wrapper class="w-auto">
                    <input id="accent-color" type="color" class="fi-input" x-bind:value="project.design.accentColor" x-on:input="setAccent($event.target.value)">
                </x-filament::input.wrapper>
                <code class="text-sm text-ink-muted" x-text="project.design.accentColor"></code>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-semibold">{{ $b('qr_heading') }}</h3>
            <p class="mt-1 text-sm text-ink-muted">{{ $b('qr_hint') }}</p>
            <x-filament::input.wrapper class="mt-3 max-w-xs">
                <x-filament::input.select id="qr-target" x-model="project.design.qrTarget" aria-label="{{ $b('qr_heading') }}">
                    <option value="">{{ $b('qr_none') }}</option>
                    <option value="website">{{ $b('qr_website') }}</option>
                    <option value="linkedin">{{ $b('qr_linkedin') }}</option>
                </x-filament::input.select>
            </x-filament::input.wrapper>
            <p class="field-error" x-show="qrMissing" x-cloak>{{ $b('qr_missing') }}</p>
        </div>

        <div>
            <h3 class="text-lg font-semibold">{{ $b('photo') }}</h3>
            <template x-if="project.photo">
                <div class="mt-3 flex items-center gap-3">
                    <x-filament::toggle :state="'project.design.showPhoto'" x-effect="state = project.design.showPhoto" x-on:click="project.design.showPhoto = !project.design.showPhoto" id="show-photo-toggle" />
                    <label for="show-photo-toggle" class="text-sm">{{ $b('photo_show') }}</label>
                </div>
            </template>
            <template x-if="!project.photo">
                <p class="mt-3 text-sm text-ink-muted">{{ $b('no_photo_yet') }}</p>
            </template>
        </div>
    </div>

    {{-- Downloads --}}
    <div class="rounded-xl border border-line bg-surface-muted p-5">
        <h3 class="text-lg font-semibold">{{ $b('download_heading') }}</h3>
        <p class="mt-1 text-sm text-ink-muted">{{ $b('download_text') }}</p>
        <p class="mt-2 text-sm font-medium text-brand" x-show="!canDownload" x-cloak>{{ $b('need_name') }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
            <x-filament::button icon="heroicon-m-arrow-down-tray" x-on:click="downloadPdf()" x-bind:disabled="!canDownload || downloading">
                <span x-show="!downloading">{{ $b('download_cv') }}</span>
                <span x-show="downloading">{{ $b('preparing') }}</span>
            </x-filament::button>
            <x-filament::button color="gray" outlined icon="heroicon-m-document-text" x-on:click="downloadDocx('cv')" x-bind:disabled="!canDownload || downloading">
                {{ $b('download_docx_cv') }}
            </x-filament::button>
            <x-filament::button color="gray" outlined icon="heroicon-m-envelope" x-on:click="downloadLetter()" x-bind:disabled="!canDownloadLetter || downloading" x-show="letterHasContent">
                {{ $b('download_letter') }}
            </x-filament::button>
            <x-filament::button color="gray" outlined icon="heroicon-m-document-arrow-down" x-on:click="exportProject()">
                {{ $b('save') }}
            </x-filament::button>
        </div>
        <p class="mt-3 text-xs text-ink-muted">{{ $b('docx_note') }}</p>
        <p class="mt-1 text-xs text-ink-muted">
            {{ $b('file_names') }}
            <code x-text="pdfFileName"></code>
            <span x-show="letterHasContent"> · <code x-text="letterFileName"></code></span>
        </p>
    </div>

    {{-- Local autosave --}}
    <div class="rounded-xl border border-line p-5">
        <h3 class="text-lg font-semibold">{{ $b('autosave_heading') }}</h3>
        <template x-if="storage.available === false">
            <p class="mt-2 text-sm text-ink-muted">{{ $b('autosave_unavailable') }}</p>
        </template>
        <template x-if="storage.available !== false">
            <div>
                <div class="mt-3 flex items-center gap-3">
                    <x-filament::toggle :state="'storage.autosave'" x-effect="state = storage.autosave" x-on:click="toggleAutosave()" id="autosave-toggle" x-bind:disabled="storage.available === null" />
                    <label for="autosave-toggle" class="text-sm font-medium">{{ $b('autosave_toggle') }}</label>
                </div>
                <p class="mt-2 text-sm text-ink-muted">{{ $b('autosave_text') }}</p>
                <p class="mt-2 text-xs text-ink-muted" x-show="storage.autosave && storage.savedAt">{{ $b('autosave_last') }} <span x-text="savedAtText"></span></p>
                <div class="mt-3">
                    <x-filament::button color="danger" outlined size="sm" icon="heroicon-m-trash" x-on:click="confirmClearDevice()">
                        {{ $b('clear_device') }}
                    </x-filament::button>
                </div>
            </div>
        </template>
    </div>
</section>
