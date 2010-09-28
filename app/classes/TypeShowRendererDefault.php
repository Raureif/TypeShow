<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TypeShowRendererDefault
 *
 * @author mphasize
 */
class TypeShowRendererDefault extends TypeShowRenderer {

	public $version = 10; // 10 = v0.1, 90 = v0.9, 142 = v1.42
	public $metaName = 'Default';
	public $metaUrl = 'http://typeshow.net';
	public $metaDescription = 'Lorem ipsum dolor sit amet.';
	public $metaDeveloper = '(Developer Name here)';
	public $metaDeveloperUrl = 'http://';

	public function render() {

		// Get current settings
		$settings = TypeShow::getSettings();
		$theme = TypeShow::getTheme();
		$font = TypeShow::getFont();

		// Font scale factor
		$scale = $settings->renderer->ppi / 72;

		// Get width & height
		$w = $settings->dimensions->width;
		$h = $settings->dimensions->height;

		// Create canvas
		$canvas = imagecreatetruecolor($w, $h);

		// Paint background
		$bgcolor = $this->allocateColor($canvas, $theme->backgroundcolor);
		imagefilledrectangle($canvas, 0, 0, $w, $h, $bgcolor);

		//echo TypeShow::path() . 'themes/' . $theme->folder . $theme->backgroundimage; exit;
		try {
			$imgBackground = $this->getImage(TypeShow::path() . 'themes/' . $theme->folder . $theme->backgroundimage);
			imagecopy($canvas, $imgBackground, 0, 0, 0, 0, imagesx($imgBackground), imagesy($imgBackground));
			imagedestroy($imgBackground);
		} catch (Exception $e) {
			// Ignore
		}

		// Get current text
		$textWOL = TypeShow::text(false);
		$text = TypeShow::text();
		$compareSize = ($w / strlen($textWOL)) + ($h / strlen($textWOL)) / 2;
		$padding = $settings->dimensions->padding;

		//ORIGINAL
		/*
		  $bbox = imageftbbox(100, 0, $font->getFile(), $textWOL);
		  $bbox_width = $bbox[2];
		  $bbox_height = $bbox[5] * -1;

		  //calculate necessary font size to fill picture with the text in $s
		  $fontsize = (100 / $bbox_width) * ($w - $padding->left - $padding->right);


		  // limit font size so it won’t go off the page vertically
		  if ($fontsize > ($h - $padding->top - $padding->bottom)) {
		  $fontsize = $h - $padding->top - $padding->bottom;
		  }


		  // calculate final dimensions of text at calculated size to determine positioning
		  $bbox = imageftbbox($fontsize, 0, $font->getFile(), $textWOL);
		  $bbox_width = $bbox[2];
		  $bbox_height = $bbox[5] * (- 1);

		  // set final vertical position of baseline
		  $baseline = (($h - $padding->top - $padding->bottom) / 2 + ($fontsize / 2)) + $padding->top;

		  //center horizontally
		  $x = (($w - $bbox_width) / 2); */

		// ROUND 1
		/* Calculate bounding box (Step #1)
		  $bbox = imageftbbox($compareSize, 0, $font->getFile(), $textWOL);
		  $bbox_width = abs($bbox[0]) + abs($bbox[2]);
		  $bbox_height = abs($bbox[5]);
		  $compareSize = ($compareSize / $bbox_width) * ($w - $padding->left - $padding->right);
		 */

		// ROUND 2
		// Calculate bounding box (Step #1)
		$bbox = imageftbbox($compareSize, 0, $font->getFile(), $textWOL);
		$bbox_width = abs($bbox[0]) + abs($bbox[2]);
		$bbox_height = abs($bbox[5]);
		$fontsize = ($compareSize / $bbox_width) * ($w - $padding->left - $padding->right);
		$descent = abs($bbox[3]);


		// Limit font size so it won’t go off the page vertically
		$fontsizeH = ($compareSize / $bbox_height) * ($h - $padding->top - $padding->bottom); //  - $descent
		$fontsize = ($fontsizeH < $fontsize) ? $fontsizeH : $fontsize;

		// Calculate bounding box for final positioning (Step 2)
		$bbox = imageftbbox($fontsize, 0, $font->getFile(), $textWOL);
		$bbox_width = abs($bbox[0]) + abs($bbox[2]);
		$bbox_height = abs($bbox[5]);


		// Position text according to padding settings
		$f = $bbox_height;
		$baseline = $padding->top + ($h - $padding->top - $padding->bottom - $f) / 2 + $f; // + ($fontsize / 2)) + $padding->top; //$h - $padding->bottom;
		// Position text in the center
		$x = (($w - $bbox_width) / 2);


		// Set text color
		$textcolor = $this->allocateColor($canvas, $theme->textcolor);

		// Debug Paint Bounding Box
		//imagerectangle($canvas, $x, $baseline, $x + $bbox_width, $baseline - $bbox_height, $textcolor);
		//imageline($canvas, $x, $baseline+$descent, $x + $bbox_width, $baseline+$descent, $textcolor);
		// Paint text
		imagefttext($canvas, $fontsize, 0, $x, $baseline, $textcolor, $font->getFile(), $text);

		// Paint overlay image
		try {
			$imgOver = $this->getImage(TypeShow::path() . 'themes/' . $theme->folder . $theme->overlayimage);
			/* if (imagesx($imgOver) != $w || imagesy($imgOver) != $h) {
			  imagecopyresampled($canvas, $imgOver, 0, 0, 0, 0, $w, $h, imagesx($imgOver), imagesy($imgOver));
			  } else {
			  imagecopy($canvas, $imgOver, 0, 0, 0, 0, $w, $h);
			  } */
			imagecopy($canvas, $imgOver, $theme->overlayimage_x, $theme->overlayimage_y, 0, 0, imagesx($imgOver), imagesy($imgOver));
			imagedestroy($imgOver);
		} catch (Exception $e) {
			// Should we create an overlay?
		}


		// Get caption text
		$overlay_dictionary = array(
			'%font%' => $font->name,
			'%style%' => $settings->current->style,
			'%designer%' => $font->designer,
			'%foundry%' => $font->foundry,
			'%size%' => round($fontsize * $scale)
		);
		$overlay_text = strtr($settings->caption->text, $overlay_dictionary);


		// Set caption color
		$captioncolor = $this->allocateColor($canvas, $theme->captioncolor);

		// Paint caption Text
		imagefttext($canvas,
				$settings->caption->fontsize, 0,
				$settings->caption->x,
				$settings->caption->y,
				$captioncolor,
				TypeShow::path() . 'caption/' . $settings->caption->font,
				$overlay_text);

		// Output PNG Image
		header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Datum in der Vergangenheit
		header('Content-type: image/png');
		imagepng($canvas);
	}

	private function allocateColor($canvas, $hexcolor) {
		$colorR = hexdec(substr($hexcolor, 1, 2));
		$colorG = hexdec(substr($hexcolor, 3, 2));
		$colorB = hexdec(substr($hexcolor, 5, 2));
		return ImageColorAllocate($canvas, $colorR, $colorG, $colorB);
	}

}

?>
