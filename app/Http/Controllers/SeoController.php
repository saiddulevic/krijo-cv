<?php

namespace App\Http\Controllers;

use App\Support\Seo;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $xml = ['<?xml version="1.0" encoding="UTF-8"?>'];
        $xml[] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

        foreach (Seo::indexablePaths() as $path) {
            $alternates = Seo::alternates($path);
            $links = '';
            foreach ($alternates as $locale => $href) {
                $links .= '<xhtml:link rel="alternate" hreflang="'.$locale.'" href="'.e($href).'"/>';
            }
            $links .= '<xhtml:link rel="alternate" hreflang="x-default" href="'.e($alternates[config('krijo.default_locale', 'sq')]).'"/>';

            foreach ($alternates as $href) {
                $xml[] = '<url><loc>'.e($href).'</loc>'.$links.'<changefreq>monthly</changefreq><priority>'.($path === '/' ? '1.0' : '0.7').'</priority></url>';
            }
        }

        $xml[] = '</urlset>';

        return response(implode("\n", $xml), 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots(): Response
    {
        $lines = [
            'User-agent: *',
            'Disallow: /admin',
            'Disallow: /gjuha/',
            'Allow: /',
            '',
            'Sitemap: '.url('/sitemap.xml'),
            '',
        ];

        return response(implode("\n", $lines), 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
