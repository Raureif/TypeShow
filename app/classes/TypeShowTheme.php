<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TypeShowTheme
 *
 * @author mphasize
 */
class TypeShowTheme {

	public $name = "Green & Gray";
	public $folder = "0/";
	public $textcolor = "#ffffff";
	public $backgroundcolor = "#000000";
	public $backgroundimage = "bg.png";
	public $overlayimage = "overlay.png";
	public $overlayimage_x = 30;
	public $overlayimage_y = -24;
	public $captioncolor = "#aaaaaa";

	public function __construct($obj = null) {
		if ($obj instanceof stdClass) {
			foreach ((array) $obj AS $key => $value) {
				$this->$key = $value;
			}
		}
	}
}

?>
