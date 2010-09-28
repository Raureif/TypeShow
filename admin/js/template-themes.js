var tplThemes = {
	"name" : "Settings",
	"items" : [
	{
		"xtype" : "array",
		"name" : "themes",
		"desc" : "Themes",
		"folder" : "../resources/preview/themes",
		"template" : {
			"xtype" : "theme",
			"desc" : "Theme",
			"items" : [{
				"xtype" : "text",
				"name" : "name",
				"desc" : "Theme Name"
			},{
				"xtype" : "hash",
				"name" : "folder"
			},{
				"xtype" : "color",
				"name" : "textcolor",
				"desc" : "Font Color",
				"autofill" : "#000000"
			},{
				"xtype" : "color",
				"name" : "backgroundcolor",
				"desc" : "Background Color",
				"autofill" : "#ffffff"
			},{
				"xtype" : "file",
				"name" : "backgroundimage",
				"desc" : "Background Image",
				"accept" : "png,jpg,gif"
			},{
				"xtype" : "spacer"
			},{
				"xtype" : "color",
				"name" : "captioncolor",
				"desc" : "Caption Color",
				"autofill" : "#000000",
				"hint" : "Color to be used for the pixel font caption."
			},{
				"xtype" : "file",
				"name" : "overlayimage",
				"desc" : "Overlay Image",
				"hint" : "This image will be put on top of everything as a water mark. Please use 32 bit png (24 bit with transparency).",
				"accept" : "png"
			},{
				"xtype" : "number",
				"name" : "overlayimage_x",
				"desc" : "Horizontal Position <code>(px)</code>",
				"autofill" : "0",
				"hint" : "The overlay image’s offset from the left."
			},{
				"xtype" : "number",
				"name" : "overlayimage_y",
				"desc" : "Vertical Position <code>(px)</code>",
				"autofill" : "0",
				"hint" : "The overlay image’s offset from the top."
			}]
		}

	}]
}