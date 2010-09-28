<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TypeShowFont
 *
 * @author mphasize
 */
class TypeShowFont {

	public $name = 'DefaultFont';
	public $designer = 'DefaultDesigner';
	public $foundry = 'DefFoundry';
	public $folder = 'DefaultFolder';
	public $url = 'http://typeshow.net';
	public $styles = array();
	public $ligatures = array();
	public $hasLigatures = false;

	public function __construct($obj = null) {
		if ($obj instanceof stdClass) {
			foreach ((array) $obj AS $key => $value) {
				switch ($key) {
					case 'styles':
						foreach ($value AS $style) {
							$this->styles[$style->name] = new TypeShowStyle($style);
						}
						break;
					case 'ligatures':
						foreach ($value AS $lig) {
							$this->ligatures[$lig->search] = $lig->replace;
						}
						break;
					case 'hasLigatures':
						if ($value == 'Y') {
							$this->hasLigatures = true;
						}
						break;
					case 'designer':
						$this->$key = empty($value) ? TypeShow::getSettings()->caption->designer : $value;
						break;
					case 'foundry':
						$this->$key = empty($value) ? TypeShow::getSettings()->caption->foundry : $value;
						break;
					default: $this->$key = $value;
				}
			}
		}
	}

	public function getFile() {
		$name = TypeShow::getStyleName();
		if (array_key_exists($name, $this->styles)) {
			$style = $this->styles[$name];
			if (file_exists(TypeShow::path() . 'fonts/' . $style->fontfile)) {
				return TypeShow::path() . 'fonts/' . $style->fontfile;
			} else {
				throw new Exception('Font file is missing: ' . $this->name . ' / ' . $style->name . ' (' . TypeShow::path() . 'fonts/' . $style->fontfile . ')');
			}
		} else {
			foreach ($this->styles AS $style) {
				if (file_exists(TypeShow::path() . 'fonts/' . $style->fontfile)) {
					return TypeShow::path() . 'fonts/' . $style->fontfile;
				}
			}
		}
		throw new Exception('Invalid Style: ' . $name);
	}
}

?>
