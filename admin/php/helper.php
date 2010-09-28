<?php

$settings = array(
	"dimensions" => array(
		"width" => 600,
		"height" => 300,
		"text_max_length" => 80,
		"padding" => array(
			"left" => 20,
			"right" => 20,
			"top" => 20,
			"bottom" => 60
		)
	),
	"caption" => array(
		"x" => 20,
		"y" => 280,
		"text" => "%font% %style% by %designer% at %size%px",
		"font" => "TypeShowType.ttf",
		"fontsize" => 6,
		"foundry" => "Empty",
		"designer" => "Inserta DeFaulte-Designère"
	),
	"defaults" => array(
		"text" => "Please type your Quick Brown Fox to view this lovely TypeShow.",
		"font" => "GentiumBasic",
		"style" => "Regular",
		"theme" => "green-gray"
	),
	"renderer" => array(
		"ppi" => 96
	)
);


$fonts = array(
	"fonts" => array(
		array(
			"name" => "GentiumBasic",
			"designer" => "Designer",
			"foundry" => "Foundry",
			"url" => "/fonts/gentiumbasic/gentiumbasic",
			"styles" => array(
				array(
					"name" => "Regular",
					"fontfile" => "GentiumBasic-Regular.ttf"
				),
				array(
					"name" => "Italic",
					"fontfile" => "GentiumBasic-Italic.ttf"
				),
				array(
					"name" => "Bold",
					"fontfile" => "GentiumBasic-Bold.ttf"
				),
				array(
					"name" => "BoldItalic",
					"fontfile" => "GentiumBasic-BoldItalic.ttf"
				)
			)
		),
		array(
			"name" => "GentiumBasicBook",
			"designer" => "Designer 2",
			"foundry" => "Foundry 2",
			"url" => "/fonts/gentiumbook",
			"styles" => array(
				array(
					"name" => "Regular",
					"fontfile" => "GentiumBasic-Regular.ttf"
				),
				array(
					"name" => "Italic",
					"fontfile" => "GentiumBasic-Italic.ttf"
				),
				array(
					"name" => "Bold",
					"fontfile" => "GentiumBasic-Bold.ttf"
				),
				array(
					"name" => "BoldItalic",
					"fontfile" => "GentiumBasic-BoldItalic.ttf"
				)
			),
			"ligatures" => array(
				array(
					"search" => "",
					"replace" => ""
				)
			)
		)
	)
);

$themes = array(
	"themes" => array(
		array(
			"name" => "Green & Gray",
			"textcolor" => "#8fb626",
			"backgroundcolor" => "#000000",
			"backgroundimage" => "bg.png",
			"overlaycolor" => "#aaaaaa",
			"overlayimage" => "overlay.png",
			"overlayimage_x" => 30,
			"overlayimage_y" => -24
		),
		array(
			"name" => "Gray & Green",
			"textcolor" => "#ffffff",
			"backgroundcolor" => "#000000",
			"backgroundimage" => "bg.png",
			"overlaycolor" => "#aaaaaa",
			"overlayimage" => "overlay.png",
			"overlay_x" => 30,
			"overlay_y" => -24
		)
	)
);


file_put_contents("../../resources/preview/settings/settings.json", json_encode($settings));
file_put_contents("../../resources/preview/fonts.json", json_encode($fonts));
file_put_contents("../../resources/preview/themes.json", json_encode($themes));
echo "Done";
?>