<?php

namespace App\Support;

use Filament\Support\Colors\Color;

/**
 * Brand colour palette for Filament components. Filament's generated palette
 * keeps only the hue of #C1121F and makes shade 600 much lighter, so primary
 * buttons ended up salmon with dark text. Shades 500 to 800 are pinned to the
 * real brand red, which also keeps white button text above WCAG AA contrast.
 */
class Brand
{
    public const RED = '#C1121F';

    /**
     * @return array<int, string>
     */
    public static function palette(): array
    {
        $palette = Color::hex(self::RED);
        $palette[500] = Color::convertToOklch('#D42A35');
        $palette[600] = Color::convertToOklch(self::RED);
        $palette[700] = Color::convertToOklch('#9C0E19');
        $palette[800] = Color::convertToOklch('#7F0B14');

        return $palette;
    }
}
