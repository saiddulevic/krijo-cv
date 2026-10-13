<?php

namespace App\Http\Controllers;

use App\Http\Middleware\SetLocale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    /**
     * Remembers the chosen interface language (session + one-year cookie) and
     * sends the visitor back to the page they came from.
     */
    public function __invoke(Request $request, string $locale): RedirectResponse
    {
        abort_unless(array_key_exists($locale, (array) config('krijo.locales', [])), 404);

        $request->session()->put(SetLocale::SESSION_KEY, $locale);

        $target = url()->previous();
        if (! str_starts_with($target, $request->getSchemeAndHttpHost())) {
            $target = route('home');
        }

        return redirect($target)->withCookie(cookie(SetLocale::COOKIE, $locale, 60 * 24 * 365, httpOnly: false));
    }
}
