<?php

namespace App\Http\Controllers;

use App\Models\CvTemplate;
use App\Support\SiteSettings;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class BuilderController extends Controller
{
    /** Keys of the ui.builder group that the Alpine component needs at run time. */
    private const BUILDER_STRINGS = [
        'step1_short', 'step1_title', 'step2_short', 'step2_title', 'step3_short', 'step3_title',
        'step4_short', 'step4_title', 'step5_short', 'step5_title',
        'step_of', 'page_n_of', 'file_names',
    ];

    public function __invoke(Request $request, SiteSettings $settings): View
    {
        $locale = app()->getLocale();

        $templates = CvTemplate::query()->enabled()->get()->map(fn (CvTemplate $template): array => [
            'id' => $template->slug,
            'name' => $template->localizedName($locale),
            'description' => $template->localizedDescription($locale),
            'thumbnail' => $template->thumbnailUrl(),
        ])->values();

        $preselected = (string) $request->query('model', '');

        $strings = array_merge(
            (array) trans('ui.js'),
            Arr::only((array) trans('ui.builder'), self::BUILDER_STRINGS),
        );

        return view('builder', [
            'config' => [
                'templates' => $templates,
                'defaultAccent' => $settings->get('design.default_accent'),
                'locale' => $locale,
                'strings' => $strings,
                'import' => $request->boolean('importo'),
                'sample' => $request->boolean('shembull'),
                'template' => preg_match('/^[a-z0-9-]{1,40}$/', $preselected) ? $preselected : null,
                'cvLanguage' => in_array($request->query('gjuha_cv'), array_keys((array) config('krijo.locales', [])), true) ? $request->query('gjuha_cv') : null,
                'step' => max(1, min(5, (int) $request->query('hapi', 1))),
            ],
        ]);
    }
}
