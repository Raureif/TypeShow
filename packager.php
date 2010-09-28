<?php

$dir = '.';
$exclude = array('.', '..', '.git', 'packager.php', 'nbproject', '.DS_Store', 'typeshow.install.zip', 'typeshow.package.zip', 'typeshow.update.zip', 'error.log', 'performance.log', 'Thumbs.db');


$zip = new ZipArchive();
if ($zip->open('typeshow.package.zip', ZipArchive::CREATE)) {
	zipdir($dir, $exclude);
	$zip->close();
	echo "Install package created.<br>";
} else {
	echo "Error";
}

$exclude = array_merge($exclude, array('cache', 'resources', '.htaccess', '.htpasswd'));

$zip = new ZipArchive();
if ($zip->open('typeshow.update.zip', ZipArchive::CREATE)) {
	zipdir($dir, $exclude);
	$zip->close();
	echo "Update package created.<br>";
} else {
	echo "Error";
}

function zipdir($dir, array $exclude) {
	global $zip;
	if (is_dir($dir)) {
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if (!in_array($object, $exclude) && substr($object, 0, 2) != '._') {
				echo "Packing: " . $object . "<br>\n";
				if (filetype($dir . "/" . $object) == "dir")
					zipdir($dir . "/" . $object, $exclude); else
					$zip->addFile($dir . "/" . $object, $dir . '/' . $object);
				//unlink($dir . "/" . $object);
			} else {
				echo "Omitting: " . $object . "<br>\n";
			}
		}
		reset($objects);
		//rmdir($dir);
	}
}

?>
