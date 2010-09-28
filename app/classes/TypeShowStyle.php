<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TypeShowStyle
 *
 * @author mphasize
 */
class TypeShowStyle {

	public $name = "Regular";
	public $file = null;

	public function __construct($obj = null) {
		if ($obj instanceof stdClass) {
			foreach ((array) $obj AS $key => $value) {
				$this->$key = $value;
			}
		}
	}
}
?>
