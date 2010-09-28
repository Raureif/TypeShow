<!DOCTYPE html>
<html>
	<head>
		<title>FileDialog</title>
		<link rel="stylesheet" type="text/css" href="../css/iframe.css">
		<script type="text/javascript" src="../js/jquery.js"></script>
	</head>
	<body>


		<?php
		if (!empty($_FILES) && isset($_REQUEST['source'])) {
			$filename = $_REQUEST['source'];
			$filename = substr($filename, 0, (strpos($filename, '?')));
			$fonts = json_decode(file_get_contents('../' . $filename));
			foreach ($_FILES AS $item => $file) {
				if (is_uploaded_file($file['tmp_name'])) {
					if (isset($_REQUEST['accept']) && !empty($_REQUEST['accept'])) {
						$accepted = explode(',', strtolower($_REQUEST['accept']));
						$ext = substr($file['name'], strrpos($file['name'], '.') + 1);
						if (!in_array(strtolower($ext), $accepted)) {
							die('Filetype not accepted');
						}
					}
					$path = explode('_', $item);
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
							//echo $itemname;
							//echo var_dump($obj);
							$obj->$itemname = $file['name'];
							if (!is_dir('../' . $_REQUEST['folder'])) {
								mkdir('../' . $_REQUEST['folder']);
							}
							move_uploaded_file($file['tmp_name'], '../' . $_REQUEST['folder'] . '/' . $file['name']);
							//echo 'Done';
						}
					}
				}
			}
			file_put_contents('../' . $filename, json_encode($fonts));
			echo 'ok';
		} else {
		?>

			<form action="upload.php" method="post" enctype="multipart/form-data">
				<input type="hidden" name="node" value="<?php echo $_REQUEST['node'] ?>">
				<input type="file" name="<?php echo $_REQUEST['item'] ?>">
				<input type="hidden" name="source" value="<?php echo $_REQUEST['source'] ?>">
				<input type="hidden" name="folder" value="<?php echo $_REQUEST['folder'] ?>">
				<input type="hidden" name="accept" value="<?php echo $_REQUEST['accept'] ?>">
				<input id="submit" type="submit" value="Upload">
			</form>

			<script type="text/javascript">
				$("form").submit(function (e) {
					$("input#submit").addClass("loading");
				});	
			</script>


		<?php } ?>
	</body>
</html>
