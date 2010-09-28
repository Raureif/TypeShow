var tplPangrams = {
	"name" : "Pangrams",
	"items" : [{
		"xtype" : "array",
		"name" : "pangrams",
		"desc" : "Pangrams",
		"hint" : "One of these random sample texts will be loaded whenever the user deletes all text in the front-end. Of course, <a href='http://en.wikipedia.org/wiki/Pangrams'>Pangrams</a> are highly recommended.",
		"template" : {
			"xtype" : "pangram",
			"items" : [{
				"xtype" : "text",
				"name" : "text",
				"desc" : "Pangram Text",
				"autofill" : "Please enter your quick brown fox."
			}]
		}
	}]
}
