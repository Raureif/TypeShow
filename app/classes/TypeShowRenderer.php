<?php

/**
 * Renderer Template
 */
abstract class TypeShowRenderer {

	public $version = 0; // 10 = v0.1, 90 = v0.9, 142 = v1.42
	public $metaName = 'Template';
	public $metaUrl = 'http://';
	public $metaDescription = 'Lorem ipsum dolor sit amet.';
	public $metaDeveloper = '(Developer Name here)';
	public $metaDeveloperUrl = 'http://';

	abstract public function render();

	protected function getImage($file) {
		if (file_exists($file)) {
			$extension = strtoupper(substr($file, strrpos($file, '.')+1));
			switch ($extension) {
				case 'PNG':
					return imagecreatefrompng($file);
					break;
				case 'JPG':
				case 'JPEG':
					return imagecreatefromjpeg($file);
					break;
				case 'GIF':
					return imagecreatefromgif($file);
					break;
				default:
					throw new Exception('Filetype not supported (' . $extension . ')');
			}
		}
		throw new Exception('Image file not found: ' . $file);
	}

}

?>