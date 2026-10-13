<?php

namespace App\Http\Controllers;

use App\Models\CvTemplate;
use Illuminate\Contracts\View\View;

class LandingController extends Controller
{
    public function __invoke(string $slug): View
    {
        $page = config("krijo.landing.{$slug}");
        abort_unless(is_array($page), 404);

        return view('landing', [
            'slug' => $slug,
            'page' => $page,
            'templates' => ($page['gallery'] ?? false) ? CvTemplate::query()->enabled()->get() : collect(),
        ]);
    }
}
