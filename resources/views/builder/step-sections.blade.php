<section x-show="step === 3" x-cloak aria-labelledby="hapi-3" class="space-y-8">
    <div>
        <h2 id="hapi-3" class="text-xl font-semibold">{{ $b('e_heading') }}</h2>
        <p class="mt-1 text-sm text-ink-muted">{{ $b('e_intro') }}</p>
    </div>

    {{-- Education --}}
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-lg font-semibold">{{ $b('education') }}</h3>
            <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('education')">{{ $b('add_education') }}</x-filament::button>
        </div>
        <div class="mt-4 space-y-4">
            <template x-for="(entry, index) in project.cv.education" :key="entry.id">
                <article class="entry-card" x-bind:data-entry="entry.id">
                    <x-entry-toolbar title-expr="entry.institution || entry.qualification || t('education_n', { n: index + 1 })" move-up="moveEntry('education', index, -1)" move-down="moveEntry('education', index, 1)" remove="removeEntry('education', index)" first-expr="index === 0" last-expr="index === project.cv.education.length - 1" />
                    <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <x-field :label="$b('institution')" for-expr="'edu-institution-' + entry.id" class="sm:col-span-2">
                            <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'edu-institution-' + entry.id" x-model="entry.institution" maxlength="120" /></x-filament::input.wrapper>
                        </x-field>
                        <x-field :label="$b('field')" for-expr="'edu-field-' + entry.id" :hint="$b('field_hint')">
                            <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'edu-field-' + entry.id" x-model="entry.field" maxlength="120" /></x-filament::input.wrapper>
                        </x-field>
                        <x-field :label="$b('qualification')" for-expr="'edu-qualification-' + entry.id" :hint="$b('qualification_hint')">
                            <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'edu-qualification-' + entry.id" x-model="entry.qualification" maxlength="120" /></x-filament::input.wrapper>
                        </x-field>
                        <x-field :label="$b('location')" for-expr="'edu-location-' + entry.id">
                            <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'edu-location-' + entry.id" x-model="entry.location" maxlength="300" /></x-filament::input.wrapper>
                        </x-field>
                        <div class="grid grid-cols-2 gap-3">
                            <x-field :label="$b('start')" for-expr="'edu-start-' + entry.id">
                                <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'edu-start-' + entry.id" x-model="entry.startDate" maxlength="40" :placeholder="$b('year_placeholder')" /></x-filament::input.wrapper>
                            </x-field>
                            <x-field :label="$b('end')" for-expr="'edu-end-' + entry.id">
                                <x-filament::input.wrapper x-bind:class="{ 'fi-disabled': entry.current }"><x-filament::input type="text" x-bind:id="'edu-end-' + entry.id" x-model="entry.endDate" maxlength="40" :placeholder="$b('year_placeholder')" x-bind:disabled="entry.current" /></x-filament::input.wrapper>
                            </x-field>
                        </div>
                        <label class="flex items-center gap-2 text-sm sm:col-span-2">
                            <x-filament::input.checkbox x-model="entry.current" />
                            <span>{{ $b('current_study') }}</span>
                        </label>
                        <x-field :label="$b('description_optional')" for-expr="'edu-description-' + entry.id" class="sm:col-span-2">
                            <x-filament::input.wrapper><textarea class="fi-input" rows="3" x-bind:id="'edu-description-' + entry.id" x-model="entry.description" maxlength="6000"></textarea></x-filament::input.wrapper>
                        </x-field>
                    </div>
                </article>
            </template>
        </div>
    </div>

    {{-- Skills --}}
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-lg font-semibold">{{ $b('skills') }}</h3>
            <div class="flex flex-wrap gap-2">
                <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-light-bulb" x-on:click="openPhrases('skills')">{{ $b('suggest_skills') }}</x-filament::button>
                <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('skills')">{{ $b('add_skill') }}</x-filament::button>
            </div>
        </div>
        <p class="mt-1 text-sm text-ink-muted">{{ $b('skills_hint') }}</p>
        <div class="mt-4 space-y-3">
            <template x-for="(entry, index) in project.cv.skills" :key="entry.id">
                <div class="flex flex-wrap items-end gap-2 rounded-lg border border-line p-3" x-bind:data-entry="entry.id">
                    <x-field :label="$b('skill')" for-expr="'skill-name-' + entry.id" class="min-w-40 flex-1">
                        <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'skill-name-' + entry.id" x-model="entry.name" maxlength="120" /></x-filament::input.wrapper>
                    </x-field>
                    <x-field :label="$b('level')" for-expr="'skill-level-' + entry.id" class="w-40">
                        <x-filament::input.wrapper>
                            <x-filament::input.select x-bind:id="'skill-level-' + entry.id" x-model="entry.level">
                                <template x-for="level in skillLevels" :key="level.value">
                                    <option x-bind:value="level.value" x-text="level.label"></option>
                                </template>
                            </x-filament::input.select>
                        </x-filament::input.wrapper>
                    </x-field>
                    <x-field :label="$b('group')" for-expr="'skill-group-' + entry.id" class="min-w-40 flex-1">
                        <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'skill-group-' + entry.id" x-model="entry.group" maxlength="120" /></x-filament::input.wrapper>
                    </x-field>
                    <div class="flex items-center gap-1 pb-0.5" role="group" aria-label="{{ $b('skill_reorder_aria') }}">
                        <x-filament::icon-button icon="heroicon-m-chevron-up" color="gray" :label="$b('move_up')" x-on:click="moveEntry('skills', index, -1)" x-bind:disabled="index === 0" />
                        <x-filament::icon-button icon="heroicon-m-chevron-down" color="gray" :label="$b('move_down')" x-on:click="moveEntry('skills', index, 1)" x-bind:disabled="index === project.cv.skills.length - 1" />
                        <x-filament::icon-button icon="heroicon-m-trash" color="danger" :label="$b('delete_skill')" x-on:click="removeEntry('skills', index)" />
                    </div>
                </div>
            </template>
        </div>
    </div>

    {{-- Languages --}}
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-lg font-semibold">{{ $b('languages') }}</h3>
            <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('languages')">{{ $b('add_language') }}</x-filament::button>
        </div>
        <div class="mt-4 space-y-3">
            <template x-for="(entry, index) in project.cv.languages" :key="entry.id">
                <div class="flex flex-wrap items-end gap-2 rounded-lg border border-line p-3" x-bind:data-entry="entry.id">
                    <x-field :label="$b('language')" for-expr="'lang-name-' + entry.id" class="min-w-40 flex-1">
                        <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'lang-name-' + entry.id" x-model="entry.name" maxlength="120" /></x-filament::input.wrapper>
                    </x-field>
                    <x-field :label="$b('level')" for-expr="'lang-level-' + entry.id" class="w-56">
                        <x-filament::input.wrapper>
                            <x-filament::input.select x-bind:id="'lang-level-' + entry.id" x-model="entry.level">
                                <option value="">{{ $b('choose_level') }}</option>
                                <template x-for="level in languageLevels" :key="level.value">
                                    <option x-bind:value="level.value" x-text="level.label"></option>
                                </template>
                            </x-filament::input.select>
                        </x-filament::input.wrapper>
                    </x-field>
                    <div class="flex items-center gap-1 pb-0.5" role="group" aria-label="{{ $b('language_reorder_aria') }}">
                        <x-filament::icon-button icon="heroicon-m-chevron-up" color="gray" :label="$b('move_up')" x-on:click="moveEntry('languages', index, -1)" x-bind:disabled="index === 0" />
                        <x-filament::icon-button icon="heroicon-m-chevron-down" color="gray" :label="$b('move_down')" x-on:click="moveEntry('languages', index, 1)" x-bind:disabled="index === project.cv.languages.length - 1" />
                        <x-filament::icon-button icon="heroicon-m-trash" color="danger" :label="$b('delete_language')" x-on:click="removeEntry('languages', index)" />
                    </div>
                </div>
            </template>
        </div>
    </div>

    {{-- Additional sections --}}
    <div>
        <h3 class="text-lg font-semibold">{{ $b('extra_heading') }}</h3>
        <p class="mt-1 text-sm text-ink-muted">{{ $b('extra_intro') }}</p>
        <div class="mt-4 space-y-3">

            <x-filament::section :heading="$b('certifications')" collapsible collapsed compact>
                <x-slot name="afterHeader"><x-filament::badge color="gray" x-show="project.cv.certifications.length" x-text="project.cv.certifications.length"></x-filament::badge></x-slot>
                <div class="space-y-4">
                    <template x-for="(entry, index) in project.cv.certifications" :key="entry.id">
                        <article class="entry-card" x-bind:data-entry="entry.id">
                            <x-entry-toolbar title-expr="entry.name || t('certification_n', { n: index + 1 })" move-up="moveEntry('certifications', index, -1)" move-down="moveEntry('certifications', index, 1)" remove="removeEntry('certifications', index)" first-expr="index === 0" last-expr="index === project.cv.certifications.length - 1" />
                            <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                <x-field :label="$b('certification_name')" for-expr="'cert-name-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'cert-name-' + entry.id" x-model="entry.name" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('issuer')" for-expr="'cert-issuer-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'cert-issuer-' + entry.id" x-model="entry.issuer" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('date')" for-expr="'cert-date-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'cert-date-' + entry.id" x-model="entry.date" maxlength="40" :placeholder="$b('date_placeholder')" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('link_optional')" for-expr="'cert-url-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'cert-url-' + entry.id" x-model="entry.url" maxlength="300" inputmode="url" /></x-filament::input.wrapper>
                                </x-field>
                            </div>
                        </article>
                    </template>
                    <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('certifications')">{{ $b('add_certification') }}</x-filament::button>
                </div>
            </x-filament::section>

            <x-filament::section :heading="$b('projects')" collapsible collapsed compact>
                <x-slot name="afterHeader"><x-filament::badge color="gray" x-show="project.cv.projects.length" x-text="project.cv.projects.length"></x-filament::badge></x-slot>
                <div class="space-y-4">
                    <template x-for="(entry, index) in project.cv.projects" :key="entry.id">
                        <article class="entry-card" x-bind:data-entry="entry.id">
                            <x-entry-toolbar title-expr="entry.name || t('project_n', { n: index + 1 })" move-up="moveEntry('projects', index, -1)" move-down="moveEntry('projects', index, 1)" remove="removeEntry('projects', index)" first-expr="index === 0" last-expr="index === project.cv.projects.length - 1" />
                            <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                <x-field :label="$b('project_name')" for-expr="'proj-name-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'proj-name-' + entry.id" x-model="entry.name" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('role')" for-expr="'proj-role-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'proj-role-' + entry.id" x-model="entry.role" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('link_optional')" for-expr="'proj-url-' + entry.id" :hint="$b('project_link_hint')">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'proj-url-' + entry.id" x-model="entry.url" maxlength="300" inputmode="url" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('date_or_period')" for-expr="'proj-date-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'proj-date-' + entry.id" x-model="entry.date" maxlength="40" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('technologies')" for-expr="'proj-tech-' + entry.id" :hint="$b('technologies_hint')" class="sm:col-span-2">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'proj-tech-' + entry.id" x-model="entry.technologies" maxlength="300" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('description')" for-expr="'proj-description-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><textarea class="fi-input" rows="3" x-bind:id="'proj-description-' + entry.id" x-model="entry.description" maxlength="6000"></textarea></x-filament::input.wrapper>
                                </x-field>
                            </div>
                        </article>
                    </template>
                    <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('projects')">{{ $b('add_project') }}</x-filament::button>
                </div>
            </x-filament::section>

            <x-filament::section :heading="$b('volunteer')" collapsible collapsed compact>
                <x-slot name="afterHeader"><x-filament::badge color="gray" x-show="project.cv.volunteer.length" x-text="project.cv.volunteer.length"></x-filament::badge></x-slot>
                <div class="space-y-4">
                    <template x-for="(entry, index) in project.cv.volunteer" :key="entry.id">
                        <article class="entry-card" x-bind:data-entry="entry.id">
                            <x-entry-toolbar title-expr="entry.role || entry.organization || t('volunteer_n', { n: index + 1 })" move-up="moveEntry('volunteer', index, -1)" move-down="moveEntry('volunteer', index, 1)" remove="removeEntry('volunteer', index)" first-expr="index === 0" last-expr="index === project.cv.volunteer.length - 1" />
                            <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                <x-field :label="$b('vol_role')" for-expr="'vol-role-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'vol-role-' + entry.id" x-model="entry.role" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('organization')" for-expr="'vol-org-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'vol-org-' + entry.id" x-model="entry.organization" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('location')" for-expr="'vol-location-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'vol-location-' + entry.id" x-model="entry.location" maxlength="300" /></x-filament::input.wrapper>
                                </x-field>
                                <div class="grid grid-cols-2 gap-3">
                                    <x-field :label="$b('start')" for-expr="'vol-start-' + entry.id">
                                        <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'vol-start-' + entry.id" x-model="entry.startDate" maxlength="40" :placeholder="$b('date_placeholder')" /></x-filament::input.wrapper>
                                    </x-field>
                                    <x-field :label="$b('end')" for-expr="'vol-end-' + entry.id">
                                        <x-filament::input.wrapper x-bind:class="{ 'fi-disabled': entry.current }"><x-filament::input type="text" x-bind:id="'vol-end-' + entry.id" x-model="entry.endDate" maxlength="40" :placeholder="$b('date_placeholder')" x-bind:disabled="entry.current" /></x-filament::input.wrapper>
                                    </x-field>
                                </div>
                                <label class="flex items-center gap-2 text-sm sm:col-span-2">
                                    <x-filament::input.checkbox x-model="entry.current" />
                                    <span>{{ $b('current_volunteer') }}</span>
                                </label>
                                <x-field :label="$b('description')" for-expr="'vol-description-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><textarea class="fi-input" rows="3" x-bind:id="'vol-description-' + entry.id" x-model="entry.description" maxlength="6000"></textarea></x-filament::input.wrapper>
                                </x-field>
                            </div>
                        </article>
                    </template>
                    <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('volunteer')">{{ $b('add_volunteer') }}</x-filament::button>
                </div>
            </x-filament::section>

            <x-filament::section :heading="$b('publications')" collapsible collapsed compact>
                <x-slot name="afterHeader"><x-filament::badge color="gray" x-show="project.cv.publications.length" x-text="project.cv.publications.length"></x-filament::badge></x-slot>
                <div class="space-y-4">
                    <template x-for="(entry, index) in project.cv.publications" :key="entry.id">
                        <article class="entry-card" x-bind:data-entry="entry.id">
                            <x-entry-toolbar title-expr="entry.title || t('publication_n', { n: index + 1 })" move-up="moveEntry('publications', index, -1)" move-down="moveEntry('publications', index, 1)" remove="removeEntry('publications', index)" first-expr="index === 0" last-expr="index === project.cv.publications.length - 1" />
                            <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                <x-field :label="$b('pub_title')" for-expr="'pub-title-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'pub-title-' + entry.id" x-model="entry.title" maxlength="300" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('publisher')" for-expr="'pub-publisher-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'pub-publisher-' + entry.id" x-model="entry.publisher" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('date')" for-expr="'pub-date-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'pub-date-' + entry.id" x-model="entry.date" maxlength="40" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('link_optional')" for-expr="'pub-url-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'pub-url-' + entry.id" x-model="entry.url" maxlength="300" inputmode="url" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('description_optional')" for-expr="'pub-description-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><textarea class="fi-input" rows="2" x-bind:id="'pub-description-' + entry.id" x-model="entry.description" maxlength="6000"></textarea></x-filament::input.wrapper>
                                </x-field>
                            </div>
                        </article>
                    </template>
                    <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('publications')">{{ $b('add_publication') }}</x-filament::button>
                </div>
            </x-filament::section>

            <x-filament::section :heading="$b('references')" collapsible collapsed compact>
                <x-slot name="afterHeader"><x-filament::badge color="gray" x-show="project.cv.references.length" x-text="project.cv.references.length"></x-filament::badge></x-slot>
                <div class="space-y-4">
                    <p class="text-sm text-ink-muted">{{ $b('references_note') }}</p>
                    <template x-for="(entry, index) in project.cv.references" :key="entry.id">
                        <article class="entry-card" x-bind:data-entry="entry.id">
                            <x-entry-toolbar title-expr="entry.name || t('reference_n', { n: index + 1 })" move-up="moveEntry('references', index, -1)" move-down="moveEntry('references', index, 1)" remove="removeEntry('references', index)" first-expr="index === 0" last-expr="index === project.cv.references.length - 1" />
                            <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                <x-field :label="$b('ref_name')" for-expr="'ref-name-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'ref-name-' + entry.id" x-model="entry.name" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('ref_position')" for-expr="'ref-position-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'ref-position-' + entry.id" x-model="entry.position" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('company')" for-expr="'ref-company-' + entry.id" class="sm:col-span-2">
                                    <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'ref-company-' + entry.id" x-model="entry.company" maxlength="120" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('email')" for-expr="'ref-email-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="email" x-bind:id="'ref-email-' + entry.id" x-model="entry.email" maxlength="300" /></x-filament::input.wrapper>
                                </x-field>
                                <x-field :label="$b('phone')" for-expr="'ref-phone-' + entry.id">
                                    <x-filament::input.wrapper><x-filament::input type="tel" x-bind:id="'ref-phone-' + entry.id" x-model="entry.phone" maxlength="60" /></x-filament::input.wrapper>
                                </x-field>
                            </div>
                        </article>
                    </template>
                    <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addEntry('references')">{{ $b('add_reference') }}</x-filament::button>
                </div>
            </x-filament::section>

            {{-- Custom sections --}}
            <template x-for="(section, sectionIndex) in project.cv.custom" :key="section.id">
                <div class="rounded-xl border border-line bg-white p-4 sm:p-5">
                    <div class="flex flex-wrap items-end gap-3">
                        <x-field :label="$b('custom_title')" for-expr="'custom-title-' + section.id" class="flex-1" :hint="$b('custom_title_hint')">
                            <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'custom-title-' + section.id" x-model="section.title" maxlength="80" /></x-filament::input.wrapper>
                        </x-field>
                        <x-filament::button color="danger" outlined size="sm" icon="heroicon-m-trash" x-on:click="removeCustomSection(sectionIndex)">{{ $b('delete_section') }}</x-filament::button>
                    </div>
                    <div class="mt-4 space-y-4">
                        <template x-for="(entry, index) in section.entries" :key="entry.id">
                            <article class="entry-card" x-bind:data-entry="entry.id">
                                <x-entry-toolbar title-expr="entry.title || t('entry_n', { n: index + 1 })" move-up="moveInArray(section.entries, index, -1)" move-down="moveInArray(section.entries, index, 1)" remove="removeCustomEntry(sectionIndex, index)" first-expr="index === 0" last-expr="index === section.entries.length - 1" />
                                <div class="mt-4 grid gap-4 sm:grid-cols-2">
                                    <x-field :label="$b('cs_title')" for-expr="'cs-title-' + entry.id">
                                        <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'cs-title-' + entry.id" x-model="entry.title" maxlength="120" /></x-filament::input.wrapper>
                                    </x-field>
                                    <x-field :label="$b('cs_subtitle')" for-expr="'cs-subtitle-' + entry.id">
                                        <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'cs-subtitle-' + entry.id" x-model="entry.subtitle" maxlength="120" /></x-filament::input.wrapper>
                                    </x-field>
                                    <x-field :label="$b('cs_date')" for-expr="'cs-date-' + entry.id">
                                        <x-filament::input.wrapper><x-filament::input type="text" x-bind:id="'cs-date-' + entry.id" x-model="entry.date" maxlength="40" /></x-filament::input.wrapper>
                                    </x-field>
                                    <x-field :label="$b('description_optional')" for-expr="'cs-description-' + entry.id" class="sm:col-span-2">
                                        <x-filament::input.wrapper><textarea class="fi-input" rows="2" x-bind:id="'cs-description-' + entry.id" x-model="entry.description" maxlength="6000"></textarea></x-filament::input.wrapper>
                                    </x-field>
                                </div>
                            </article>
                        </template>
                        <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-plus" x-on:click="addCustomEntry(sectionIndex)">{{ $b('add_entry') }}</x-filament::button>
                    </div>
                </div>
            </template>

            <x-filament::button color="gray" outlined icon="heroicon-m-plus-circle" x-on:click="addCustomSection()" x-bind:disabled="!canAddCustomSection">
                {{ $b('add_custom_section') }}
            </x-filament::button>
        </div>
    </div>

    {{-- Section order --}}
    <div>
        <h3 class="text-lg font-semibold">{{ $b('order_heading') }}</h3>
        <p class="mt-1 text-sm text-ink-muted">{{ $b('order_intro') }}</p>
        <ol class="mt-4 divide-y divide-line rounded-xl border border-line">
            <template x-for="(key, index) in project.design.sectionOrder" :key="key">
                <li class="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span class="flex items-center gap-3 text-sm">
                        <span class="w-5 text-ink-muted" x-text="index + 1"></span>
                        <span x-text="sectionLabel(key)" x-bind:class="sectionHasContent(key) ? 'font-medium' : 'text-ink-muted'"></span>
                        <x-filament::badge color="gray" size="sm" x-show="!sectionHasContent(key)">{{ $b('order_empty') }}</x-filament::badge>
                    </span>
                    <span class="flex items-center gap-1" role="group" aria-label="{{ $b('order_move_aria') }}">
                        <x-filament::icon-button icon="heroicon-m-chevron-up" color="gray" :label="$b('move_up')" x-on:click="moveSection(index, -1)" x-bind:disabled="index === 0" />
                        <x-filament::icon-button icon="heroicon-m-chevron-down" color="gray" :label="$b('move_down')" x-on:click="moveSection(index, 1)" x-bind:disabled="index === project.design.sectionOrder.length - 1" />
                    </span>
                </li>
            </template>
        </ol>
    </div>
</section>
