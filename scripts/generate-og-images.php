<?php
/**
 * scripts/generate-og-images.php
 * Generates OG images for static routes using PHP GD.
 */

$baseUrl = 'https://www.unlistened.me';
$logoPath = __DIR__ . '/../public/images/unlistened.me_white_300.png';
$outputDir = __DIR__ . '/../public/images/og';
$fontPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; // Standard on GitHub Runners

// If font doesn't exist locally (for testing), try a local path
if (!is_file($fontPath)) {
    $fontPath = __DIR__ . '/arial.ttf'; 
}

if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

// Routes to generate images for
$pages = [
    'home' => 'Podcasts and music, all in one place',
    'podcasts' => 'Discover Trending Podcasts',
    'music' => 'Free Creative Commons Music',
    'categories' => 'Browse by Genre',
    'about' => 'About Unlistened.me',
    'documentation' => 'App Documentation',
    'terms' => 'Terms and Conditions',
    'privacy' => 'Privacy Policy',
];

foreach ($pages as $slug => $title) {
    echo "Generating OG image for: {$slug}...\n";
    
    // 1. Create canvas (1200x630 standard OG size)
    $img = imagecreatetruecolor(1200, 630);
    
    // 2. Colors
    $bg = imagecolorallocate($img, 3, 7, 18); // #030712
    $white = imagecolorallocate($img, 255, 255, 255);
    $indigo = imagecolorallocate($img, 79, 70, 229); // #4f46e5
    
    imagefill($img, 0, 0, $bg);
    
    // 3. Add Logo (Center top)
    if (is_file($logoPath)) {
        $logo = imagecreatefrompng($logoPath);
        $logoW = imagesx($logo);
        $logoH = imagesy($logo);
        $targetW = 200;
        $targetH = ($logoH / $logoW) * $targetW;
        
        imagecopyresampled(
            $img, $logo, 
            (1200 - $targetW) / 2, 80, 
            0, 0, 
            $targetW, $targetH, 
            $logoW, $logoH
        );
        imagedestroy($logo);
    }
    
    // 4. Add Title (Center)
    if (is_file($fontPath)) {
        $fontSize = 45;
        $bbox = imagettfbbox($fontSize, 0, $fontPath, $title);
        $textW = $bbox[2] - $bbox[0];
        imagettftext($img, $fontSize, 0, (1200 - $textW) / 2, 400, $white, $fontPath, $title);
        
        // Add subtitle
        $sub = "unlistened.me";
        $subFontSize = 25;
        $bboxSub = imagettfbbox($subFontSize, 0, $fontPath, $sub);
        $subW = $bboxSub[2] - $bboxSub[0];
        imagettftext($img, $subFontSize, 0, (1200 - $subW) / 2, 500, $indigo, $fontPath, $sub);
    } else {
        // Fallback if no TTF font found
        imagestring($img, 5, (1200 - (strlen($title) * 9)) / 2, 350, $title, $white);
    }
    
    // 5. Save
    imagepng($img, "{$outputDir}/{$slug}.png");
    imagedestroy($img);
}

echo "Done!\n";
