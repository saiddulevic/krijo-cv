<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

/**
 * Chooses the interface language for the public pages from the visitor's
 * explicit choice, in this order: a ?lang= query parameter (the crawlable
 * URLs used by the language switcher and the hreflang links; it is also
 * remembered), the session, the cookie, then the default (Albanian).
 *
 * The browser's Accept-Language header is deliberately ignored: most Albanian
 * visitors use an English-language browser and would otherwise be moved away
 * from the site's primary language without asking.
 */
class SetLocale
{
    public const SESSION_KEY = 'locale';

    public const COOKIE = 'krijo_locale';

    public const QUERY = 'lang';

    public function handle(Request $request, Closure $next): Response
    {
        $supported = array_keys((array) config('krijo.locales', []));
        // Not config('app.locale'): App::setLocale() overwrites that value.
        $locale = (string) config('krijo.default_locale', 'sq');

        $fromQuery = $request->query(self::QUERY);

        if (is_string($fromQuery) && in_array($fromQuery, $supported, true)) {
            $locale = $fromQuery;
            $request->session()->put(self::SESSION_KEY, $locale);
            Cookie::queue(self::COOKIE, $locale, 60 * 24 * 365, httpOnly: false);
        } else {
            foreach ([$request->session()->get(self::SESSION_KEY), $request->cookie(self::COOKIE)] as $candidate) {
                if (is_string($candidate) && in_array($candidate, $supported, true)) {
                    $locale = $candidate;
                    break;
                }
            }
        }

        App::setLocale($locale);

        return $next($request);
    }
}
