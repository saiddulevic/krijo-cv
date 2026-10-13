<section x-show="step === 4" x-cloak aria-labelledby="hapi-4">
    <h2 id="hapi-4" class="text-xl font-semibold">{{ $b('l_heading') }}</h2>
    <p class="mt-1 text-sm text-ink-muted">{{ $b('l_intro') }}</p>

    <div class="entry-card mt-6 bg-surface-muted">
        <x-field :label="$b('l_starter')" for="l-starter" :hint="$b('l_starter_hint')">
            <x-filament::input.wrapper class="max-w-md">
                <x-filament::input.select id="l-starter" x-on:change="applyLetterType($event.target.value); $event.target.value = ''">
                    <option value="">{{ $b('l_starter_choose') }}</option>
                    <template x-for="type in letterTypes" :key="type.id">
                        <option x-bind:value="type.id" x-text="type.label"></option>
                    </template>
                </x-filament::input.select>
            </x-filament::input.wrapper>
        </x-field>
    </div>

    <div class="entry-card mt-6">
        <h3 class="font-semibold">{{ $b('l_recipient') }}</h3>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <x-field :label="$b('l_recipient_name')" for="l-recipientName" :hint="$b('l_recipient_name_hint')">
                <x-filament::input.wrapper>
                    <x-filament::input type="text" id="l-recipientName" x-model="project.coverLetter.recipientName" maxlength="120" />
                </x-filament::input.wrapper>
            </x-field>
            <x-field :label="$b('l_recipient_title')" for="l-recipientTitle">
                <x-filament::input.wrapper>
                    <x-filament::input type="text" id="l-recipientTitle" x-model="project.coverLetter.recipientTitle" maxlength="120" />
                </x-filament::input.wrapper>
            </x-field>
            <x-field :label="$b('l_company')" for="l-company">
                <x-filament::input.wrapper>
                    <x-filament::input type="text" id="l-company" x-model="project.coverLetter.company" maxlength="120" />
                </x-filament::input.wrapper>
            </x-field>
            <x-field :label="$b('l_address')" for="l-address">
                <x-filament::input.wrapper>
                    <x-filament::input type="text" id="l-address" x-model="project.coverLetter.address" maxlength="300" />
                </x-filament::input.wrapper>
            </x-field>
            <x-field :label="$b('l_city')" for="l-city">
                <x-filament::input.wrapper>
                    <x-filament::input type="text" id="l-city" x-model="project.coverLetter.city" maxlength="80" x-bind:placeholder="project.cv.personal.city" />
                </x-filament::input.wrapper>
            </x-field>
            <x-field :label="$b('l_date')" for="l-date" :hint="$b('l_date_hint')">
                <x-filament::input.wrapper>
                    <x-filament::input type="text" id="l-date" x-model="project.coverLetter.date" maxlength="40" />
                </x-filament::input.wrapper>
            </x-field>
        </div>
    </div>

    <div class="mt-6 grid gap-4">
        <x-field :label="$b('l_subject')" for="l-subject" :hint="$b('l_subject_hint')">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="l-subject" x-model="project.coverLetter.subject" maxlength="300" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('l_salutation')" for="l-salutation" :hint="$b('l_salutation_hint')">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="l-salutation" x-model="project.coverLetter.salutation" maxlength="300" />
            </x-filament::input.wrapper>
        </x-field>
        <div>
            <x-field :label="$b('l_body')" for="l-body" :hint="$b('l_body_hint')">
                <x-filament::input.wrapper>
                    <textarea id="l-body" class="fi-input" rows="14" x-model="project.coverLetter.body" maxlength="8000"></textarea>
                </x-filament::input.wrapper>
            </x-field>
            <p class="field-hint text-right"><span x-text="(project.coverLetter.body || '').length"></span> / 8000</p>
        </div>
        <x-field :label="$b('l_closing')" for="l-closing" :hint="$b('l_closing_hint')">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="l-closing" x-model="project.coverLetter.closing" maxlength="300" />
            </x-filament::input.wrapper>
        </x-field>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-3">
        <x-filament::button icon="heroicon-m-arrow-down-tray" x-on:click="downloadLetter()" x-bind:disabled="!canDownloadLetter || downloading">
            {{ $b('download_letter') }}
        </x-filament::button>
        <x-filament::button color="gray" outlined icon="heroicon-m-document-text" x-on:click="downloadDocx('letter')" x-bind:disabled="!canDownloadLetter || downloading">
            {{ $b('download_docx_letter') }}
        </x-filament::button>
        <p class="text-sm text-ink-muted" x-show="!canDownload">{{ $b('need_name') }}</p>
    </div>
</section>
