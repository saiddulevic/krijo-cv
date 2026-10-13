<section x-show="step === 1" x-cloak aria-labelledby="hapi-1">
    <h2 id="hapi-1" class="text-xl font-semibold">{{ $b('p_heading') }}</h2>
    <p class="mt-1 text-sm text-ink-muted">{{ $b('p_intro') }}</p>

    {{-- CV language --}}
    <div class="entry-card mt-6">
        <x-field :label="$b('cv_language')" for="cv-language" :hint="$b('cv_language_hint')">
            <x-filament::input.wrapper class="max-w-xs">
                <x-filament::input.select id="cv-language" x-model="project.design.language">
                    <template x-for="language in cvLanguages" :key="language.value">
                        <option x-bind:value="language.value" x-text="language.label"></option>
                    </template>
                </x-filament::input.select>
            </x-filament::input.wrapper>
        </x-field>
    </div>

    {{-- Photo --}}
    <div class="entry-card mt-6">
        <div class="flex flex-wrap items-start gap-5">
            <div class="h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-muted">
                <template x-if="project.photo">
                    <img x-bind:src="project.photo.data" alt="{{ $b('photo_alt') }}" class="h-full w-full object-cover">
                </template>
                <template x-if="!project.photo">
                    <div class="flex h-full w-full items-center justify-center text-ink-muted" aria-hidden="true">
                        <x-filament::icon icon="heroicon-o-user" class="h-10 w-10" />
                    </div>
                </template>
            </div>
            <div class="min-w-0 flex-1">
                <h3 class="font-semibold">{{ $b('photo_heading') }}</h3>
                <p class="mt-1 text-sm text-ink-muted">{{ $b('photo_text') }}</p>
                <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" x-ref="photoInput" x-on:change="onPhotoSelected($event)" tabindex="-1" aria-hidden="true">
                <div class="mt-3 flex flex-wrap gap-2">
                    <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-photo" x-on:click="$refs.photoInput.click()" x-bind:disabled="cropper.busy">
                        <span x-text="project.photo ? @js($b('photo_replace')) : @js($b('photo_add'))"></span>
                    </x-filament::button>
                    <template x-if="project.photo">
                        <x-filament::button color="gray" outlined size="sm" icon="heroicon-m-scissors" x-on:click="editPhoto()">
                            {{ $b('photo_crop') }}
                        </x-filament::button>
                    </template>
                    <template x-if="project.photo">
                        <x-filament::button color="danger" outlined size="sm" icon="heroicon-m-trash" x-on:click="removePhoto()">
                            {{ $b('photo_remove') }}
                        </x-filament::button>
                    </template>
                </div>
                <template x-if="project.photo">
                    <label class="mt-3 flex items-center gap-2 text-sm">
                        <x-filament::input.checkbox x-model="project.design.showPhoto" />
                        <span>{{ $b('photo_show') }}</span>
                    </label>
                </template>
                <p class="field-error" x-show="photoError" x-text="photoError" role="alert"></p>
            </div>
        </div>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
        <x-field :label="$b('first_name')" for="p-firstName" required>
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="p-firstName" x-model="project.cv.personal.firstName" maxlength="60" autocomplete="given-name" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('last_name')" for="p-lastName" required>
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="p-lastName" x-model="project.cv.personal.lastName" maxlength="60" autocomplete="family-name" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('job_title')" for="p-title" :hint="$b('job_title_hint')" class="sm:col-span-2">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="p-title" x-model="project.cv.personal.title" maxlength="120" autocomplete="organization-title" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('email')" for="p-email">
            <x-filament::input.wrapper alpine-valid="!emailInvalid">
                <x-filament::input type="email" id="p-email" x-model="project.cv.personal.email" maxlength="300" autocomplete="email" inputmode="email" x-bind:aria-invalid="emailInvalid ? 'true' : null" x-bind:aria-describedby="emailInvalid ? 'p-email-error' : null" />
            </x-filament::input.wrapper>
            <p id="p-email-error" class="field-error" x-show="emailInvalid" x-cloak role="alert">{{ $b('email_error') }}</p>
        </x-field>
        <x-field :label="$b('phone')" for="p-phone">
            <x-filament::input.wrapper>
                <x-filament::input type="tel" id="p-phone" x-model="project.cv.personal.phone" maxlength="60" autocomplete="tel" inputmode="tel" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('city')" for="p-city">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="p-city" x-model="project.cv.personal.city" maxlength="80" autocomplete="address-level2" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('country')" for="p-country">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="p-country" x-model="project.cv.personal.country" maxlength="80" autocomplete="country-name" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('linkedin')" for="p-linkedin" :hint="$b('linkedin_hint')">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="p-linkedin" x-model="project.cv.personal.linkedin" maxlength="300" autocomplete="url" inputmode="url" />
            </x-filament::input.wrapper>
        </x-field>
        <x-field :label="$b('website')" for="p-website" :hint="$b('website_hint')">
            <x-filament::input.wrapper>
                <x-filament::input type="text" id="p-website" x-model="project.cv.personal.website" maxlength="300" autocomplete="url" inputmode="url" />
            </x-filament::input.wrapper>
        </x-field>
    </div>
</section>
