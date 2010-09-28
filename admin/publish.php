<?php

$from = '../resources/preview';
$to = '../resources/live';

//rrmdir($to);
//mkdir($to);

$exclude_files = array('.DS_Store');
publishdir($from);

$hide = array("fontfile", "hasLigatures", "ligatures");
$fonts = json_decode(file_get_contents($to . '/fonts.json'), TRUE);
deleteInfosByExclusion($fonts, $hide);
//file_put_contents('../cache/fonts.json', json_encode($fonts));

$allow = array("themes", "name");
$themes = json_decode(file_get_contents($to . '/themes.json'), TRUE);
deleteInfosByInclusion($themes, $allow);
//file_put_contents('../cache/themes.json', json_encode($themes));

$allow = array("settings", "dimensions", "width", "height", "defaults", "font", "style", "theme", "infolink", "display", "description");
$settings['settings'] = json_decode(file_get_contents($to . '/settings.json'), TRUE);
deleteInfosByInclusion($settings, $allow);
//file_put_contents('../cache/settings.json', json_encode($settings));


//copy($to . '/pangrams.json', '../cache/pangrams.json');
$pangrams = json_decode(file_get_contents($to . '/pangrams.json'), TRUE);

$compiled = array_merge($fonts, $themes, $settings, $pangrams);
file_put_contents('../cache/setup.json', json_encode($compiled));


echo 'Settings published.';

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

function publishdir($dir) {
	global $from, $to, $exclude_files;
	if (is_dir($dir)) {
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if ($object != "." && $object != ".." && !in_array($object, $exclude_files)) {
				$comp = str_replace($from, $to, $dir);
				if (!is_dir($comp)) {
					mkdir($comp);
					echo 'CREATED: Directory ' . $comp . "<br>\n";
				}
				if (filetype($dir . "/" . $object) == "dir") {
					publishdir($dir . "/" . $object);
				} else {
					if (file_exists($comp . '/' . $object)) {
						if (filemtime($dir . '/' . $object) > filemtime($comp . '/' . $object)) {
							echo 'UPDATE: ' . $dir . '/' . $object . ' -> ' . $comp . '/' . $object . "<br>\n";
							copy($dir . "/" . $object, $comp . '/' . $object);
						} else {
							echo 'PASSED: ' . $dir . '/' . $object . ' == ' . $comp . '/' . $object . "<br>\n";
						}
					} else {
						echo 'CREATE: ' . $dir . '/' . $object . ' -> ' . $comp . '/' . $object . "<br>\n";
						copy($dir . "/" . $object, $comp . '/' . $object);
					}
				}
			}
		}
		reset($objects);
	}
}


/* DELETE DIRECTORY COMPLETELY BEFORE PUBLISH?
function rrmdir($dir) {
	if (is_dir($dir)) {
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if ($object != "." && $object != "..") {
				if (filetype($dir . "/" . $object) == "dir")
					rrmdir($dir . "/" . $object); else
					unlink($dir . "/" . $object);
			}
		}
		reset($objects);
		rmdir($dir);
	}
} */

?>
