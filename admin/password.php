<?php
file_put_contents('.htpasswd', $_REQUEST['username'] .':'. crypt($_REQUEST['password'], CRYPT_EXT_DES));
file_put_contents('../resources/.htpasswd', $_REQUEST['username'] .':'. crypt($_REQUEST['password'], CRYPT_EXT_DES));
header('Location: index.html');
?>
