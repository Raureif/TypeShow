var tplFonts = {
	"name" : "Fonts",
	"items" : [{
		"xtype" : "array",
		"name" : "fonts",
		"desc" : "Font Families",
		"folder" : "../resources/preview",
		"template" : {
			"xtype" : "font",
			"items" : [{
				"xtype" : "text",
				"name" : "name",
				"desc" : "Font Family Name",
				"autofill" : "New Font"
			},{
				"xtype" : "text",
				"name" : "designer",
				"desc" : "Designer",
				"autofill" : "Insert Default Designer"
			},{
				"xtype" : "text",
				"name" : "foundry",
				"desc" : "Foundry",
				"autofill" : "Insert Default Foundry"
			},{
				"xtype" : "text",
				"name" : "url",
				"desc" : "Info URL",
				"hint" : "Link to a page with more information about this font (will be displayed below TypeShow)"
				
			},{
				"xtype" : "checkbox",
				"name" : "hasLigatures",
				"desc" : "Font Has Ligatures",
				"hint" : "If you would like to use the hacky ligature support via private use Unicodes, please set them up under Settings &gt; Ligatures",
				"autofill" : "Y"
			},{
				"xtype" : "array",
				"name" : "styles",
				"desc" : "Font Styles",
				"folder" : "fonts",
				"template" : {
					"xtype" : "style",
					"key" : "number",
					"items" : [{
						"xtype" : "file",
						"name" : "fontfile",
						"desc" : "Font File",
						"autofill" : "Select File",
						"accept" : "ttf,otf"
					},{
						"xtype" : "text",
						"name" : "name",
						"desc" : "Name",
						"autofill" : "Regular"
					}]
				}
			}]
		}
	}]
}
