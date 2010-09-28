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


date_default_timezone_set('Europe/Berlin');

// DATA SET (Live or Preview)
if (!defined('TS_DATASET'))
	define('TS_DATASET', 'live');



// ERROR HANDLING
if (!defined('TS_DEBUG'))
	define('TS_DEBUG', false);


try {
	if (!TS_DEBUG) {
		set_error_handler('err');
		ini_set('display_errors', '0');
		ini_set('log_errors', 1);
		ini_set('error_log', dirname(__FILE__) . '/error.log');
	} else {
		error_reporting(E_ALL | E_STRICT);
	}

	// EASY CLASS LOADING
	function __autoload($class_name) {
		if (file_exists(dirname(__FILE__) . '/classes/' . $class_name . '.php')) {
			require_once dirname(__FILE__) . '/classes/' . $class_name . '.php';
		} else {
			throw new Exception('Could not autoload ' . $class_name . '. File does not exist or is not accessible!');
		}
	}

	// SETUP
	TypeShow::setRoot(dirname(__FILE__) . '/../');
	TypeShow::setDataPath('resources/' . TS_DATASET . '/');

	TypeShow::setFontsDB('fonts.json');
	TypeShow::setThemesDB('themes.json');
	TypeShow::setSettings('settings.json');
	TypeShow::setRenderer(new TypeShowRendererDefault());

	if (isset($_REQUEST['s']))
		TypeShow::setText($_REQUEST['s']);
	if (isset($_REQUEST['font']))
		TypeShow::setFont($_REQUEST['font']);
	if (isset($_REQUEST['style']))
		TypeShow::setStyle($_REQUEST['style']);
	if (isset($_REQUEST['theme']))
		TypeShow::setTheme($_REQUEST['theme']);

	// RUN
	TypeShow::run();

	// DONE.
} catch (Exception $e) {
	if (!TS_DEBUG) {
		err($e);
	} else {
		echo $e;
	}
}

function err($e1, $e2 = '', $e3 = '', $e4 = '') {
	if (!TS_DEBUG) {
		$msg = date("Y.m.d H:i:s") ."\n". $e1 . ' ' . $e2 . ' ' . $e3 . ' ' . $e4 . ' ';
		file_put_contents(dirname(__FILE__) . '/../resources/logs/error.log', $msg, FILE_APPEND);
		header('Content-type: image/png');
		echo file_get_contents(TypeShow::path() . 'img/error.png');
		exit();
	}
}

?>