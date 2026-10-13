@props([
    'titleExpr',
    'moveUp',
    'moveDown',
    'remove',
    'firstExpr',
    'lastExpr',
])

<div class="entry-toolbar">
    <h4 class="font-semibold" x-text="{{ $titleExpr }}"></h4>
    <div class="flex items-center gap-1" role="group" aria-label="{{ __('ui.builder.reorder_aria') }}">
        <x-filament::icon-button icon="heroicon-m-chevron-up" color="gray" :label="__('ui.builder.move_up')" x-on:click="{{ $moveUp }}" x-bind:disabled="{{ $firstExpr }}" />
        <x-filament::icon-button icon="heroicon-m-chevron-down" color="gray" :label="__('ui.builder.move_down')" x-on:click="{{ $moveDown }}" x-bind:disabled="{{ $lastExpr }}" />
        <x-filament::icon-button icon="heroicon-m-trash" color="danger" :label="__('ui.builder.delete_entry')" x-on:click="{{ $remove }}" />
    </div>
</div>
