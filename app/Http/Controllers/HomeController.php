<?php

namespace App\Http\Controllers;

use App\Models\CvTemplate;
use App\Models\Faq;
use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    public function __invoke(): View
    {
        return view('home', [
            'faqs' => Faq::query()->published()->get(),
            'templates' => CvTemplate::query()->enabled()->get(),
        ]);
    }
}
