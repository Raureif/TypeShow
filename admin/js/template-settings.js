var tplSettings = {
	"name" : "Settings",
	"items" : [
	{
		"xtype" : "group",
		"name" : "dimensions",
		"desc" : "Dimensions",
		"hint" : "Width and height of the rendered font samples.",
		"items" : [
		{
			"xtype" : "number",
			"name" : "width",
			"desc" : "Width <code>(px)</code>",
		},
		{
			"xtype" : "number",
			"name" : "height",
			"desc" : "Height <code>(px)</code>"
		},{
			"xtype" : "group",
			"name" : "padding",
			"desc" : "Padding",
			"hint" : "The rendered font’s distance from the image borders.",
			"items" : [{
				"xtype" : "number",
				"name" : "left",
				"desc" : "Left ↤ <code>(px)</code>"
			},{
				"xtype" : "number",
				"name" : "right",
				"desc" : "Right ↦ <code>(px)</code>"
			},{
				"xtype" : "number",
				"name" : "top",
				"desc" : "Top ↥ <code>(px)</code>"
			},{
				"xtype" : "number",
				"name" : "bottom",
				"desc" : "Bottom ↧ <code>(px)</code>"
			}]
		},{
			"xtype" : "number",
			"name" : "text_max_length",
			"desc" : "Max. Characters",
			"hint" : "The maximum number of characters."
		}]
	},
	{
		"xtype" : "group",
		"name" : "caption",
		"desc" : "Caption",
		"items" : [{
			"xtype" : "text",
			"name" : "text",
			"desc" : "Caption Template",
			"hint" : "These keywords will be replaced by the respective info:<br> <code>%font%, %style%, %designer%, %foundry%, %size%</code>"
		},{
			"xtype" : "file",
			"name" : "font",
			"desc" : "Font for Caption",
			"folder" : "../resources/preview/caption",
			"hint" : "You can replace the default pixel font by your own.",
			"accept" : "ttf,otf"
		},{
			"xtype" : "number",
			"name" : "fontsize",
			"desc" : "Caption size <code>(px)</code>"
		},{
			"xtype" : "number",
			"name" : "x",
			"desc" : "Horizontal Position <code>(px)</code>"
		},{
			"xtype" : "number",
			"name" : "y",
			"desc" : "Vertical Position <code>(px)</code>"
		},{
			"xtype" : "text",
			"name" : "foundry",
			"desc" : "Foundry name",
			"hint" : "This foundry name will be used as the default. You can override it for individual font families."
		},{
			"xtype" : "text",
			"name" : "designer",
			"desc" : "Designer name",
			"hint" : "This designer name will be used as the default. You can override it for individual font families."
		}]
	},{
		"xtype" : "group",
		"name" : "defaults",
		"desc" : "Display Defaults",
		"items" : [{
			"xtype" : "text",
			"name" : "font",
			"desc" : "Default Font"
		},{
			"xtype" : "text",
			"name" : "style",
			"desc" : "Default Font Style"
		},{
			"xtype" : "text",
			"name" : "theme",
			"desc" : "Default Theme",
			"hint" : "Please make sure that the specified font, style and theme actually exist."
		}]
	},{
		"xtype" : "group",
		"name" : "infolink",
		"desc" : "Info Link",
		"items" : [{
			"xtype" : "checkbox",
			"name" : "display",
			"desc" : "Show Info Link",
			"hint" : "You can set a link (e.g. to a product page) for each font family",
			"autofill" : "Y"
		},{
			"xtype" : "text",
			"name" : "description",
			"desc" : "Link Template",
			"hint" : "The info link will be constructed using this template. You may use these placeholders:<br> <code>%font%, %designer%, %foundry%</code>",
			"autofill" : "Learn more about %font%"
		}]

	},{
		"xtype" : "array",
		"name" : "ligatures",
		"desc" : "Ligatures",
		"hint" : "Set up global ligatures via private use Unicodes here.<br>Example: To convert f+i to  &#xFB01;, the letters to replace are f i (without the space), and the Unicode is <code>&amp;#xFB01;</code>)",
		"template" : {
			"xtype" : "ligature",
			"key" : "number",
			"items" : [{
				"xtype" : "text",
				"name" : "search",
				"desc" : "Letters to Replace"
			},{
				"xtype" : "text",
				"name" : "replace",
				"desc" : "Ligature Unicode"
			}]
		}
	},{
		"xtype" : "group",
		"name" : "renderer",
		"desc" : "Advanced",
		"items" : [{
			"xtype" : "number",
			"name" : "ppi",
			"desc" : "Renderer PPI",
			"hint" : "Default is <strong>96 PPI (Pixels per inch)</strong>. Some servers require a different setting in order to display font sizes correctly—try 72 PPI."
		}]

	}]

}
