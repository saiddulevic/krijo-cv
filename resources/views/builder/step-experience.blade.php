<section x-show="step === 2" x-cloak aria-labelledby="hapi-2">
    <h2 id="hapi-2" class="text-xl font-semibold">{{ $b('x_heading') }}</h2>
    <p class="mt-1 text-sm text-ink-muted">{{ $b('x_intro') }}</p>

    <div class="mt-6">
        <div class="mb-2 flex justify-end">
            <x-filament::button color="gray" outlined size="xs" icon="heroicon-m-light-bulb" x-on:click="openPhrases('summary')">{{ $b('suggest_summary') }}</x-filament::button>
        </div>
        <x-field :label="$b('summary')" for="summary" :hint="$b('summary_hint')">
            <x-filament::input.wrapper>
                <textarea id="summary" class="fi-input" rows="5" x-model="project.cv.summary" maxlength="3000"></textarea>
            </x-filament::input.wrapper>
        </x-field>
        <p class="field-hint text-right"><span x-text="(project.cv.summary || '').length"></span> / 3000</p>
    </div>

    <div class="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h3 class="text-lg font-semibold">{{ $b('experience') }}</h3>
        <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('experience')">{{ $b('add_experience') }}</x-filament::button>
    </div>

    <p class="mt-2 text-sm text-ink-muted" x-show="project.cv.experience.length === 0">{{ $b('no_experience') }}</p>

    <div class="mt-4 space-y-4">
        <template x-for="(entry, index) in project.cv.experience" :key="entry.id">
            <article class="entry-card" x-bind:data-entry="entry.id">
                <x-entry-toolbar title-expr="entry.title || entry.employer || t('experience_n', { n: index + 1 })" move-up="moveEntry('experience', index, -1)" move-down="moveEntry('experience', index, 1)" remove="removeEntry('experience', index)" first-expr="index === 0" last-expr="index === project.cv.experience.length - 1" />
                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                    <x-field :label="$b('position')" for-expr="'exp-title-' + entry.id">
                        <x-filament::input.wrapper>
                            <x-filament::input type="text" x-bind:id="'exp-title-' + entry.id" x-model="entry.title" maxlength="120" />
                        </x-filament::input.wrapper>
                    </x-field>
                    <x-field :label="$b('employer')" for-expr="'exp-employer-' + entry.id">
                        <x-filament::input.wrapper>
                            <x-filament::input type="text" x-bind:id="'exp-employer-' + entry.id" x-model="entry.employer" maxlength="120" />
                        </x-filament::input.wrapper>
                    </x-field>
                    <x-field :label="$b('location')" for-expr="'exp-location-' + entry.id" :hint="$b('location_hint')">
                        <x-filament::input.wrapper>
                            <x-filament::input type="text" x-bind:id="'exp-location-' + entry.id" x-model="entry.location" maxlength="300" />
                        </x-filament::input.wrapper>
                    </x-field>
                    <div class="grid grid-cols-2 gap-3">
                        <x-field :label="$b('start')" for-expr="'exp-start-' + entry.id" :hint="$b('start_hint')">
                            <x-filament::input.wrapper>
                                <x-filament::input type="text" x-bind:id="'exp-start-' + entry.id" x-model="entry.startDate" maxlength="40" :placeholder="$b('date_placeholder')" />
                            </x-filament::input.wrapper>
                        </x-field>
                        <x-field :label="$b('end')" for-expr="'exp-end-' + entry.id">
                            <x-filament::input.wrapper x-bind:class="{ 'fi-disabled': entry.current }">
                                <x-filament::input type="text" x-bind:id="'exp-end-' + entry.id" x-model="entry.endDate" maxlength="40" :placeholder="$b('date_placeholder')" x-bind:disabled="entry.current" />
                            </x-filament::input.wrapper>
                        </x-field>
                    </div>
                    <label class="flex items-center gap-2 text-sm sm:col-span-2">
                        <x-filament::input.checkbox x-model="entry.current" />
                        <span>{{ $b('current_job') }}</span>
                    </label>
                    <div class="flex justify-end sm:col-span-2">
                        <x-filament::button color="gray" outlined size="xs" icon="heroicon-m-light-bulb" x-on:click="openPhrases('bullets', entry.id)">{{ $b('suggest_bullets') }}</x-filament::button>
                    </div>
                    <x-field :label="$b('responsibilities')" for-expr="'exp-description-' + entry.id" :hint="$b('responsibilities_hint')" class="sm:col-span-2">
                        <x-filament::input.wrapper>
                            <textarea class="fi-input" rows="5" x-bind:id="'exp-description-' + entry.id" x-model="entry.description" maxlength="6000"></textarea>
                        </x-filament::input.wrapper>
                    </x-field>
                </div>
            </article>
        </template>
    </div>

    <div class="mt-4" x-show="project.cv.experience.length > 0">
        <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('experience')">{{ $b('add_experience_more') }}</x-filament::button>
    </div>
</section>
