(function ($) {
	// TypeShow plugin for JQuery

	$.fn.typeshow = function (options) {
		options = options ? options : {};
		// Synthesize TypeShow from defaults and config object
		var opts = $.extend({}, $.fn.typeshow.defaults, options);

		//log(opts);

		// Iterate over each DIV element and initialize TypeShow
		this.each(function () {
			if (this.tagName === 'DIV') {
				// Save pointer for handling
				var $this = $(this);

				// Is the Metadata Plugin installed and additional config data available?
				var o;
				o = $.metadata ? $.extend({}, opts, $this.metadata()) : opts;

				if (o.folder.length === 0) {
					o.folder = './';
				} else {
					o.folder += '/';
				}

				// Save the Options for this instance
				this.TypeShow = o;

				// Add CSS class for styling
				$this.addClass('ts_typeshow');
				// Load the Template
				$this.html($.fn.typeshow.template);

				// Add the instance to TypeShow
				$.fn.typeshow.instances.push(this);

				// WARNING! Index might not be correct if Plugin is loaded multiple times on the same DIV Element
				var index = $.fn.typeshow.instances.length - 1;
				$this.data('TS_ID', index);

				// When no Fonts and Themes set, try to load them from JSON Config files
				if (!$.fn.typeshow.isReady(this)) {
					$.fn.typeshow.prepare(this);
				} else {
					$.fn.typeshow.start(this);
				}
			}
		});

		return this;
	};

	// TypeShow default settings
	$.fn.typeshow.defaults = {
		// Per Instance Settings
		folder : '',
		indexfile : '',
		text : '',
		fonts : [],
		themes : [],
		pangrams : [],
		settings : {},
		usePangrams : true,
		allowExternalLinks : true,
		settingsFile : 'cache/setup.json',
		// Global Settings
		delay : 800,
		onReady : function () {}
	};

	$.fn.typeshow.start = function (instance) {
		var TS = instance.TypeShow;

		// Set initial instance data
		if (TS.text === "") {
			TS.text = $.fn.typeshow.getPangram(instance);
		}
		$(".ts_text", instance).val(TS.text); // localStorage ? localStorage.TypeShowText || o.text :
		$.fn.typeshow.setFonts(instance);
		$.fn.typeshow.setThemes(instance);

		// Change font listener
		$("select.ts_dropdown_fonts", instance).change(function (e) {
			var instance = $.fn.typeshow.getInstance(e.target);
			var fontname =  $(this).val();
			var fonts = instance.TypeShow.fonts;
			$.each(fonts, function (i, font) {
				if (font.name === fontname) {
					$.fn.typeshow.setStyles(instance, font.styles);
					if (instance.TypeShow.settings.infolink.display === "Y" && font.url !== "") {
						$.fn.typeshow.setInfo(instance, font);
					} else {
						$('.ts_font_info').hide();
					}
				}
			});
			$.fn.typeshow.update(true);
		});

		// Change style listener
		$("select.ts_dropdown_styles", instance).change(function (e) {
			$.fn.typeshow.update(true);
		});

		// Change theme listener
		$("select.ts_dropdown_themes", instance).change(function (e) {
			$.fn.typeshow.update(true);
		});

		// Change text listener 1
		$(".ts_text", instance).change(function (e) {
			var instance = $.fn.typeshow.getInstance(e.target);
			if ($(this).val() !== instance.TypeShow.text) {
				$.fn.typeshow.update(e);
			}
		}).keyup(function (e) {
			var instance = $.fn.typeshow.getInstance(e.target);
			if ($(this).val() !== instance.TypeShow.text) {
				$.fn.typeshow.update(e);
			}
		}).focus(function (e) {
			e.target.select();
		});

		$(".ts_image", instance).attr('alt', 'TypeShow font sample is loading...');
		$.fn.typeshow.update(true);
		TS.onReady(instance);
	};


	// Do we have Fonts and Themes loaded?
	$.fn.typeshow.isReady = function (instance) {
		var TS = instance.TypeShow;
		var pangrams = TS.usePangrams ? TS.pangrams.length > 0 : true;
		return (TS.settings.dimensions && TS.fonts.length > 0 && TS.themes.length > 0 && pangrams);
	};

	// Update Font Preview
	$.fn.typeshow.update = function (event, go) {
		if (go === true) {
			for (var i = 0; i < $.fn.typeshow.instances.length; i++) {
				var instance = $.fn.typeshow.instances[i];
				$('.ts_image', instance).get(0).src =  $.fn.typeshow.getImageSource(instance);
				$('.ts_text', instance).removeClass('loading');
			}
		} else {
			var instance = $.fn.typeshow.getInstance(event.target);
			$('.ts_text', instance).addClass('loading');
			if ($.fn.typeshow.timer) {
				window.clearTimeout($.fn.typeshow.timer);
			}
			$.fn.typeshow.timer = window.setTimeout("$.fn.typeshow.update(null,true)", $.fn.typeshow.defaults.delay);

		}
	};

	// Compile Image Source
	$.fn.typeshow.getImageSource = function (instance, text) {
		text = text ? text : $('.ts_text', instance).val();
		if (text === "") {
			if($.fn.typeshow.supportsSelect()) {
				text = $.fn.typeshow.getPangram(instance);
				$('.ts_text', instance).val(text).select();
			}
		}
		instance.TypeShow.text = text;
		var cache = new Date();
		return instance.TypeShow.folder
		+ instance.TypeShow.indexfile
		+ '?s=' + encodeURIComponent(text)
		+ "&font=" + encodeURIComponent($('.ts_dropdown_fonts', instance).val())
		+ "&style=" + encodeURIComponent($('.ts_dropdown_styles', instance).val())
		+ "&theme=" + encodeURIComponent($('.ts_dropdown_themes', instance).val())
		+ "&cache=" + cache.getHours() + cache.getMinutes() + cache.getSeconds() + cache.getMilliseconds();
	};

	// Get a random pangram
	$.fn.typeshow.getPangram = function (instance) {
		var TS = instance.TypeShow;
		if (TS.usePangrams && TS.pangrams.length > 0) {
			var pangram = TS.pangrams[Math.round(Math.random() * (TS.pangrams.length - 1))];
			return pangram.text;
		} else {
			return "";
		}
	};

	// Set active Fonts for one instance
	$.fn.typeshow.setFonts = function (instance, fonts, selected) {
		selected = selected ? selected : instance.TypeShow.settings.defaults.font;
		$.each(instance.TypeShow.fonts, function (i, font) {
			$("select.ts_dropdown_fonts", instance).append('<option value="' + font.name + '" ' + (selected === font.name ? 'selected="selected"' : '') + '>' + font.name + '</option>');
			if (font.name === selected) {
				$.fn.typeshow.setStyles(instance, font.styles);
				$.fn.typeshow.setInfo(instance, font);
			}
		});
	};

	// Set active Styles for one instance
	$.fn.typeshow.setStyles = function (instance, styles) {
		styles = styles ? styles : [];
		var element = $('.ts_dropdown_styles', instance).get(0);
		var selected = element.value ||  instance.TypeShow.settings.defaults.style;
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
		$.each(styles, function (i, style) {
			$("select.ts_dropdown_styles", instance).append('<option value="' + style.name + '"' + (style.name === selected ? 'selected="selected"' : '') + '>' + style.name + '</option>');
		});
	};

	// Set active Themes for one instance
	$.fn.typeshow.setThemes = function (instance, selected) {
		selected = selected ? selected : instance.TypeShow.settings.defaults.theme;
		$.each(instance.TypeShow.themes, function (i, theme) {
			$("select.ts_dropdown_themes", instance).append('<option value="' + theme.name + '"' + (selected === theme.name ? 'selected="slected"' : '') + '>' + theme.name + '</option>');
		});
	};

	$.fn.typeshow.setInfo = function (instance, font) {
		var linktext = instance.TypeShow.settings.infolink.description;
		linktext = $.fn.typeshow.replace(linktext, "%font%", font.name);
		linktext = $.fn.typeshow.replace(linktext, "%foundry%", font.foundry);
		linktext = $.fn.typeshow.replace(linktext, "%designer%", font.designer);
		$(".ts_font_info", instance).html('<a href="' + font.url + '" class="ts_font_link">' + linktext + '</a>').show();
	};

	$.fn.typeshow.replace = function (string, search, replace) {
		if (string.indexOf(search) >= 0) {
			string = string.substr(0, string.indexOf(search)) + replace + string.substr(string.indexOf(search) + search.length);
		}
		return string;
	};

	$.fn.typeshow.prepare = function (instance) {
		var TS = instance.TypeShow;
		$.getJSON(TS.folder + TS.settingsFile, function (data) {
			if (!TS.settings.dimensions && data.settings) {
				TS.settings = data.settings;
			}
			if (TS.fonts.length === 0 && data.fonts) {
				TS.fonts = data.fonts;
			}
			if (TS.themes.length === 0 && data.themes) {
				TS.themes = data.themes;
			}

			if (TS.pangrams.length === 0 && data.pangrams) {
				TS.pangrams = data.pangrams;
			}
			if(TS.allowExternalLinks === true) {
				var params = $.fn.typeshow.getUrlParams();
				if(params["ts-font"]) TS.settings.defaults.font = decodeURIComponent(params["ts-font"]);
				if(params["ts-style"]) TS.settings.defaults.style = decodeURIComponent(params["ts-style"]);
				if(params["ts-theme"]) TS.settings.defaults.theme = decodeURIComponent(params["ts-theme"]);
			}
			$.fn.typeshow.start(instance);
		});
	};

	$.fn.typeshow.getInstance = function (el) {
		var id = $(el).parents(".ts_typeshow").data('TS_ID');
		return $.fn.typeshow.instances[id];
	};

	$.fn.typeshow.resetAll = function () {
		$.fn.typeshow.instances = [];
		$.fn.typeshow.init = false;
		$.fn.typeshow.timer = null;
	};

	$.fn.typeshow.supportsSelect = function () {
		// @todo Try to figure out a real feature detection here
		var agent = navigator.userAgent.toLowerCase();
		var is_iphone = (agent.indexOf('iphone') !== -1 || agent.indexOf('ipad') !== -1);
		return !is_iphone;
	};

	$.fn.typeshow.getUrlParams = function () {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	};

	// TypeShow internal variables and arrays
	$.fn.typeshow.instances = [];
	$.fn.typeshow.init = false;
	$.fn.typeshow.timer = null;

	// TypeShow HTML Template
	$.fn.typeshow.template = '<img class="ts_image" alt="TypeShow requires JavaScript to be turned on in your browser." src="blanko">'
+ '<form onsubmit="return false;" method="get" action="" class="ts_controls">'
+ '<label for="ts_text"><span>Type here</span></label>'
+ '<input name="ts_text" type="text" class="ts_text" size="97" maxlength="97" value="" tabindex="0" />'
+ '<div class="ts_fonts">'
+ '<label for="ts_dropdown_fonts">Font</label>'
+ '<select class="ts_dropdown_fonts" tabindex="1">'
+ '</select>'
+ '<select class="ts_dropdown_styles" tabindex="2">'
+ '</select>'
+ '</div>'
+ '<div class="ts_themes">'
+ '<label for="ts_dropdown_themes">Theme </label>'
+ '<select class="ts_dropdown_themes" tabindex="3">'
+ '</select>'
+ '</div>'
+ '</form>'
+ '<div class="ts_font_info"></div>'
+ '<div class="ts_clear">';

})(jQuery);