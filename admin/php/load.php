<?php
$file = isset($_REQUEST['source']) ? $_REQUEST['source'] : 'INVALID';
$file = '../' . substr($file, 0, (strpos($file, '?')));
if(file_exists($file)) {
	echo file_get_contents($file);
}
?>
