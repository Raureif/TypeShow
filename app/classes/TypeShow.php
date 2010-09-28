<?php

/* -----------------------------------------------------------------------------

  _______                   _____ _
  |__   __|                 / ____| |
  | | _   _  _ __   ___ | (___ | |__   _____      __
  | || | | || '_ \ / _ \ \___ \| '_ \ / _ \ \ /\ / /
  | || |_| || |_) |  __/ ____) | | | | (_) \ V  V /
  |_| \__, || .__/ \___||_____/|_| |_|\___/ \_/\_/
  __/ / | |
  |___/  |_|

  TypeShow, A Font Rendering Interface for Type Foundry Websites
  Copyright © 2008–10 Raureif GmbH, www.raureif.net | www.typeshow.net

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
  ----------------------------------------------------------------------------- */

/**
 * Core Class for TypeShow
 */
class TypeShow {

	static private $root = '../';
	static private $datapath = 'resources/live/';
	static private $defaults = 'settings.json';
	static private $settings = null; // Settings Object
	static private $fonts = null; // Settings Object
	static private $themes = null; // Settings Object
	static private $renderer = null; // Renderer

	static public function run() {
		$time_start = self::get_formatted_time();

		// Check initialisation
		if (self::$settings == null)
			self::setSettings(TS_ROOT . self::$defaults);

		if (self::$renderer == null)
			self::$renderer = new TypeShowRendererDefault ();
		self::$renderer->render();


		//measure performance
		$time_end = self::get_formatted_time();
		$time_total = $time_end - $time_start;
		self::log($time_total . "\t" . date('Y-m-d') . "\t" . date('H:i:s') . "\t" . self::$settings->current->font . "\t" . self::$settings->current->style . "\t" . self::$settings->current->text . "\t" . self::$settings->current->theme . "\n");
	}

	static public function setSettings($resource = '') {
		self::$settings = self::handleJSON($resource);
		self::$settings->current = clone self::$settings->defaults;
	}

	static public function setFontsDB($resource = '') {
		self::$fonts = self::handleJSON($resource)->fonts;
	}

	static public function setThemesDB($resource = '') {
		self::$themes = self::handleJSON($resource)->themes;
	}

	static public function setRenderer(TypeShowRenderer $renderer) {
		self::$renderer = $renderer;
	}

	static public function getSettings() {
		return self::$settings;
	}

	static public function getTheme() {
		for ($i = 0; $i < sizeof(self::$themes); $i++) {
			if (self::$themes[$i]->name == self::$settings->current->theme) {
				self::$themes[$i]->folder =  self::$themes[$i]->folder. '/';
				return new TypeShowTheme(self::$themes[$i]);
			}
		}
		if (sizeof(self::$themes) > 0) {
			return new TypeShowTheme(self::$themes[0]);
		}
		throw new Exception('Invalid theme! (' . self::$settings->current->theme . ')');
	}

	static public function setTheme($name) {
		self::$settings->current->theme = $name;
	}

	static public function getFonts() {
		return self::$fonts;
	}

	static public function getFont() {
		foreach (self::$fonts AS $font) {
			if ($font->name == self::$settings->current->font) {
				return new TypeShowFont($font);
			}
		}
		if (sizeof(self::$fonts) > 0)
			return new TypeShowFont(self::$fonts[0]);
		throw new Exception('Invalid font: ' . self::$settings->current->font);
	}

	static public function setFont($name) {
		self::$settings->current->font = $name;
	}

	static public function setStyle($name) {
		self::$settings->current->style = $name;
	}

	static public function getThemes() {
		return self::$themes;
	}

	static public function getStyleName() {
		return self::$settings->current->style;
	}

	static public function setText($string) {
		self::$settings->current->text = $string;
	}

	static public function setRoot($root) {
		self::$root = $root;
	}

	static public function setDataPath($path) {
		self::$datapath = $path;
	}

	static public function root() {
		return self::$root;
	}

	static public function path() {
		return self::$root . self::$datapath;
	}

	static public function text($useLigatures = true) {
		$text = self::$settings->current->text;
		$text = substr($text, 0, self::$settings->dimensions->text_max_length);
		if ($useLigatures && self::getFont()->hasLigatures) {
			$text = strtr($text, self::ligatures());
		}
		if(strlen($text) == 0) $text = " ";
		return $text;
	}

	static public function ligatures() {
		$ligs = array();
		foreach (self::$settings->ligatures AS $lig) {
			$ligs[$lig->search] = $lig->replace;
		}
		return $ligs;
	}

	static private function handleJSON($json) {
		if ($json instanceof stdClass) {
			return $json;
		}
		if (strlen($json) != 0) {
			if (file_exists(self::path() . $json)) {
				$string = file_get_contents(self::path() . $json);
				return json_decode($string);
			} else {
				throw new Exception("File not found: " . $json . ' in ' . self::path());
			}
		}
		throw new Exception('Error handling JSON data');
	}

	static private function get_formatted_time() {
		list($usec, $sec) = explode(' ', microtime());
		return $usec + $sec;
	}

	static private function log($text) {
		$logdir = self::$root . 'resources/logs/';
		$logfile = 'performance.log';

		touch($logdir . $logfile);
		if (filesize($logdir . $logfile) > 100000) {
			rename($logdir . $logfile, $logdir . date('YmdHis') . ".log");
			$f_log = fopen($logdir . $logfile, 'w');
		} else {
			$f_log = fopen($logdir . $logfile, 'a');
		}
		if ($f_log) {
			fwrite($f_log, $text);
			fclose($f_log);
		} else {
			throw new Exception('Logfile Error');
		}
	}

}

?>