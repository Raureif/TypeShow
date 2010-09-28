<?php

$from = '../resources/preview';

$hide = array("fontfile", "hasLigatures", "ligatures");
$fonts = json_decode(file_get_contents($from . '/fonts.json'), TRUE);
deleteInfosByExclusion($fonts, $hide);
//file_put_contents('../cache/fonts.json', json_encode($fonts));

$allow = array("themes", "name");
$themes = json_decode(file_get_contents($from . '/themes.json'), TRUE);
deleteInfosByInclusion($themes, $allow);
//file_put_contents('../cache/themes.json', json_encode($themes));

$allow = array("settings", "dimensions", "width", "height", "defaults", "font", "style", "theme", "infolink", "display", "description");
$settings['settings'] = json_decode(file_get_contents($from . '/settings.json'), TRUE);
deleteInfosByInclusion($settings, $allow);
//file_put_contents('../cache/settings.json', json_encode($settings));

$pangrams = json_decode(file_get_contents($from . '/pangrams.json'), TRUE);

$compiled = array_merge($fonts, $themes, $settings, $pangrams);
file_put_contents($from .'/setup.json', json_encode($compiled));

echo 'Settings compiled.';

function deleteInfosByExclusion(&$array, $keys) {
	foreach ($array AS $key => $value) {
		if (!is_numeric($key) && in_array($key, $keys)) {
			echo 'DELETE: '. $key .' ('. $array[$key] .')'. "<br>\n";
			unset($array[$key]);
		} else {
			if (is_array($array[$key])) {
				deleteInfosByExclusion($array[$key], $keys);
			}
		}
	}
}

function deleteInfosByInclusion(&$array, $keys) {
	foreach ($array AS $key => $value) {
		if (!in_array($key, $keys) && !is_numeric($key)) {
			unset($array[$key]);
		} else {
			if (is_array($array[$key])) {
				deleteInfosByInclusion($array[$key], $keys);
			}
		}
	}
}
?>
