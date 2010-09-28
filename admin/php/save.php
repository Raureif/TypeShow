<?php
if (get_magic_quotes_gpc()) {
    $process = array(&$_GET, &$_POST, &$_COOKIE, &$_REQUEST);
    while (list($key, $val) = each($process)) {
        foreach ($val as $k => $v) {
            unset($process[$key][$k]);
            if (is_array($v)) {
                $process[$key][stripslashes($k)] = $v;
                $process[] = &$process[$key][stripslashes($k)];
            } else {
                $process[$key][stripslashes($k)] = stripslashes($v);
            }
        }
    }
    unset($process);
}

error_reporting(-1);
$file = isset($_REQUEST['source']) ? $_REQUEST['source'] : 'default';
$file = '../' . substr($file, 0, (strpos($file, '?')));
if (!empty($_REQUEST['json'])) {
	$handle = fopen($file, 'w');
	if ($handle) {
		fwrite($handle, $_REQUEST['json']);
		fclose($handle);
		echo 'ok';
	} else {
		echo 'Cannot save settings to file! Please setup write permissions.';
	}
}
?>
