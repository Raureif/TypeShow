<?php
$CONFIG['SOFTWARE'] = 'TypeShow Update';
$CONFIG['PACKAGE_NAME'] = 'typeshow.update.zip';
$CONFIG['PACKAGE_URL'] = 'http://update.typeshow.net/' . $CONFIG['PACKAGE_NAME'];

// Protect extracted package directories
//$CONFIG['PROTECT'][] = 'admin';
//$CONFIG['PROTECT'][] = 'resources';

// Where to go after finish...
$CONFIG['AFTER_INSTALL'] = 'index.html?please_refresh';

// Help files
$FAQ['NO_FILESYSTEM_ACCESS'] = 'http://typeshow.net/faq/#no_filesystem_access';
$FAQ['NO_ZIP_SUPPORT'] = 'http://typeshow.net/faq/#no_zip_support';
$FAQ['DOWNLOAD_RESTRICTIONS'] = 'http://typeshow.net/faq/#php_download_restrictions';

Installer::run('..');

class Installer {
	private static $software;
	private static $package;
	private static $packageUrl;
	private static $folder;
	private static $me;

	public static function run($folder = '.') {
		global $FAQ, $CONFIG;
		self::$folder = $folder;
		self::$software = $CONFIG['SOFTWARE'];
		self::$package = $CONFIG['PACKAGE_NAME'];
		self::$packageUrl = $CONFIG['PACKAGE_URL'];
		self::$me = basename(__FILE__);

		$step = 1;
		if (isset($_REQUEST['step']) && is_numeric($_REQUEST['step']) && isset($_REQUEST['proceed'])) {
			$step = $_REQUEST['step'];
		}

		ob_start();
		switch (Installer::testDirAccess()) {
			case 0:
				self::printError($FAQ['NO_FILESYSTEM_ACCESS']);
				exit();
				break;
			case 2: echo "Limited Access";
				exit();
				break;
		}

		if (!self::testZipCapability()) {
			self::printError($FAQ['NO_ZIP_SUPPORT']);
			exit();
		}

		$download = !file_exists(self::$package);
		if ($download) {
			$handle = @fopen(self::$packageUrl, "rb");
			if (!$handle) {
				self::printError($FAQ['DOWNLOAD_RESTRICTIONS']);
				exit();
			} else {
				fclose($handle);
			}
		}
		switch ($step) {
			case 1: self::printForm();
				break;
			case 2:
				self::installPackage($download);
				if (isset($CONFIG['PROTECT'])) {
					self::printProtect();
				} else {
					self::printSuccess();
				}
				break;
			case 3:
				self::protect();
				self::printSuccess();
				break;
			case 4:
				self::remove();
				header('Location: '. $CONFIG['AFTER_INSTALL']);
				break;
		}
		ob_end_flush();
	}

	private static function installPackage($download = true) {
		if ($download) {
			$handle = fopen(self::$packageUrl, "rb");
			if (!$handle) {
				die("Could not open remote file");
			}
			$contents = stream_get_contents($handle);
			fclose($handle);

			if (!file_put_contents(self::$package, $contents)) {
				die("Could not write downloaded data.");
			}
		}

		$zip = new ZipArchive();
		$ok = $zip->open(self::$package);
		if ($ok === TRUE) {
			$zip->extractTo(self::$folder);
			$zip->close();
		} else {
			die('Could not extract package!');
		}
	}

	private static function printProtect() {
		self::printHeader();
		echo '<h1>' . self::$software . ' needs to be protected</h1>';
		echo '<p>Please provide the username and the password you want to use to administer ' . self::$software . '</p>';
		echo '<p><b>Important:</b> Your username and password are case-sensitiv!</p>';
		echo '<p>Passwords cannot contain these characters: <strong><code>[space] # @ \' " ` \</code></strong><br> and may not be longer than 15 characters.</p>';
		echo '<form action="'. self::$me .'?step=3" method="post"><input type="text" name="username"><br><input type="password" name="password"><br><input name="proceed" type="submit" value="Protect TypeShow now"></form>';
		self::printFooter();
	}

	private static function printSuccess() {
		self::printHeader();
		echo '<h1>' . self::$software . ' is installed on your server</h1>';
		echo '<p>It looks like everything went smoothly. In the next step, we are going to clean up behind us and then we will take you to the Configuration Interface</p>';
		echo '<p><b>Remember</b>: In case you had to give the installer writing permissions prior to installation, make sure to undo these changes for higher security!</p>';
		echo '<form action="'. self::$me .'?step=4" method="post"><input name="proceed" type="submit" value="Finish and take me to the Configuration"></form>';
		self::printFooter();
	}

	private static function printError($faqUrl) {
		self::printHeader();

		echo '<h1>Installation problems</h1>';
		echo '<p>We have detected a problem, preventing the automatic installation. Please see <a href="' . $faqUrl . '">' . $faqUrl . '</a> for details.</p>';

		self::printFooter();
		exit();
	}

	private static function printForm() {
		self::printHeader();
		echo '<h1>' . self::$software . ' is ready to update</h1>';
		echo '<p>Your server seems to support all neccessary functions required and we are ready to install ' . self::$software . ' for you.</p>';
		echo '<form action="'. self::$me .'?step=2" method="post"><input name="proceed" type="submit" value="Install ' . self::$software . '"></form>';
		self::printFooter();
	}

	private static function printHeader() {
		echo "<!DOCTYPE html>\n" . '<html><head><meta charset="utf-8"><title>' . self::$software  . ' Update</title></head><body>';
	}

	private static function printFooter() {
		echo '</body></html>';
	}

	private static function testDirAccess() {
		$i = 0;
		$testfile = 'writetest' . $i . '.file';
		while (file_exists($testfile)) {
			$i++;
			$testfile = 'writetest' . $i . '.file';
		}
		$handle = @fopen($testfile, 'w');
		if ($handle) {
			fclose($handle);
			$del = @unlink($testfile);
			if ($del) {
				return 1;
			} else {
				return 2;
			}
		} else {
			return 0;
		}
	}

	private static function protect() {
		global $CONFIG, $FAQ;
		if (isset($CONFIG['PROTECT']) && is_array($CONFIG['PROTECT'])) {
			foreach ($CONFIG['PROTECT'] AS $dir) {
				$dir = dirname(__FILE__) .'/'. $dir;
				if (is_dir($dir)) {
					if (@file_put_contents($dir . '/.htaccess', self::htAccessFile($dir . '/.htpasswd')) === false)
						self::printError($FAQ['PROTECTION_ERROR']);
					if (@file_put_contents($dir . '/.htpasswd', self::htPasswdFile($_REQUEST['username'], $_REQUEST['password'])) === false)
						self::printError($FAQ['PROTECTION_ERROR']);
				}
			}
		}
	}

	private static function remove() {
		//@unlink('./'. self::$me);
		@unlink(self::$package);
	}

	private static function testZipCapability() {
		return class_exists('ZipArchive');
	}

	private static function htAccessFile($passwdPath) {
		return
		"AuthType Basic\n" .
		'AuthName "TypeShow Administration"' . "\n" .
		'AuthUserFile ' . $passwdPath . "\n" .
		"Require valid-user";
	}

	private static function htPasswdFile($username, $password) {
		return $username . ':' . crypt($password,CRYPT_EXT_DES);
	}

}

?>
