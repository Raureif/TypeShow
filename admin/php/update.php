<?php
if (isset($_REQUEST['source'])) {
	header('Content-Type: application/json');
	$file = $_REQUEST['source'];

	$fonts = json_decode(file_get_contents('../' . substr($file, 0, (strpos($file, '?')))));
	$path = explode('_', $_REQUEST['item']);
	$itemname = $path[sizeof($path) - 1];
	$obj = $fonts;
	$i = 0;
	foreach ($path AS $name) {
		if ($name != $itemname) {
			if (is_numeric($name)) {
				$obj = $obj[$name];
			} else {
				$obj = $obj->$name;
			}
		} else {
			echo json_encode(array(
				'node' => $_REQUEST['node'],
				'value' => $obj->$itemname,
				'path' => $path,
				'json' => $fonts
			));
		}
	}
}
?>