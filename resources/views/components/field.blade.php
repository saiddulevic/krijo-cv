@props([
    'label',
    'for' => null,
    'forExpr' => null,
    'hint' => null,
    'required' => false,
])

<div {{ $attributes->class(['min-w-0']) }}>
    <label
        class="field-label"
        @if ($for) for="{{ $for }}" @endif
        @if ($forExpr) x-bind:for="{{ $forExpr }}" @endif
    >
        {{ $label }}
        @if ($required)
            <span class="text-brand" aria-hidden="true">*</span>
            <span class="sr-only">{{ __('ui.builder.required_sr') }}</span>
        @endif
    </label>

    {{ $slot }}

    @if ($hint)
        <p class="field-hint">{{ $hint }}</p>
    @endif
</div>
