window.log = function(){
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
};




$(document).ready(function () {
	$("#host").attr('href', 'http://' + window.location.hostname).text(window.location.hostname);
	//log(Admin.getUrlParams());

	$("#left .nav a").click(function (e) {
		$(this).parent().addClass('current').siblings().removeClass('current');
		var id = this.href.substr(this.href.lastIndexOf('#'));
		$(id).show().siblings().empty();
		$("#center").hide().empty();
		switch(id) {
			case "#editor-fonts":
				$(id).JSONeditor({
					template : tplFonts,
					source : '../resources/preview/fonts.json?' + Admin.savetime.getHours() + Admin.savetime.getMinutes() + Admin.savetime.getSeconds(),
					autosave : true,
					onAdd : function(element) {
						if($(element).hasClass('style')) {
							$("label:not(.filename), input.file", element).hide();
						}
						if($(element).hasClass('font')) {
							updateFontList($(".font", element.parentNode).length-1);
						}
					},
					onChange: function(element) {
						if($(element).hasClass('file')) {
							$(element).prev().text(element.value);
						}
						var check = $(element).parent().get(0);
						if($(check).hasClass('font')) {
							$(".font", check.parentNode).each(function (i, font) {
								if(font == check) updateFontList(i);
							});							
						}
						Admin.onChange(element);
					},
					onSave : function(jsoneditor) {
						Admin.onSave(jsoneditor);
					},
					onSaveFinished : function() {
						Admin.onSaveFinished();
					},
					onDelete : function(element, context) {
						if($(element).hasClass('font')) {
							updateFontList(element.title);
						}
					},
					onReady : function () {
						$(id +" .style label.filename").each(function (i, label) {
							$(this).text($(this).next().val());
						});
						$(id +" .style label:not(.filename), "+ id +" .style input.file").hide();
						$(id +" .array h2:first").hide();
						$(id +" .btn-font-add").hide();
						$(id +" .rr_main .font").hide();
						updateFontList();
					},
					onMove : function(from, to, fromEl) {
						if($(fromEl).hasClass('font')) updateFontList(to);
					}
				});
				break;
			case "#editor-themes":
				$(id).JSONeditor({
					template : tplThemes,
					source : '../resources/preview/themes.json?' + Admin.savetime.getHours() + Admin.savetime.getMinutes() + Admin.savetime.getSeconds(),
					autosave : true,
					onAdd : function(element) {
						if($(element).hasClass('theme')) {
							updateThemeList($(".theme", element.parentNode).length-1);
						}
						$('input.color', element).ColorPicker({
							flat: true,
							onBeforeShow: function () {
								$(this).ColorPickerSetColor(this.value);
							},
							onShow: function (colpkr) {
								$(colpkr).fadeIn("fast");
								return false;
							},
							onHide: function (colpkr) {
								$(colpkr).fadeOut("fast").prev('input').change();
								return false;
							},
							onChange: function (obj, hsb, hex, rgb) {
								$(obj).val('#'+hex).css('backgroundColor', '#' + hex); // .change()
							}
						});
					},
					onChange: function(element) {
						var check = $(element).parent().get(0);
						if($(check).hasClass('theme')) {
							$(".theme", check.parentNode).each(function (i, font) {
								if(font == check) updateThemeList(i);
							});
						
						}
						Admin.onChange(element);
					},
					onDelete : function(element, context) {
						log(element);
						updateThemeList();
					},
					onSave : function(jsoneditor) {
						Admin.onSave(jsoneditor);
					},
					onSaveFinished : function() {
						Admin.onSaveFinished();
					},
					onReady : function (jsoneditor) {
						$(id +" .array h2:first").hide();

						$('input.color', jsoneditor).ColorPicker({
							flat: true,
							onBeforeShow: function () {
								$(this).ColorPickerSetColor(this.value);
							},
							onShow: function (colpkr) {
								$(colpkr).fadeIn("fast");
								return false;
							},
							onHide: function (colpkr) {
								$(colpkr).fadeOut("fast").prev('input').change();
								return false;
							},
							onChange: function (obj, hsb, hex, rgb) {
								$(obj).val('#'+hex).css('backgroundColor', '#' + hex); // .change()
							}
						});

						$(id +" .btn-theme-add").hide();
						$(id +" .rr_main .theme").hide();
						updateThemeList();
					},
					onMove : function(from, to, fromEl) {
						updateThemeList(to);
					}
				});
				break;
			case "#editor-settings":
				$(id).JSONeditor({
					template : tplSettings,
					source : '../resources/preview/settings.json?' + Admin.savetime.getHours() + Admin.savetime.getMinutes() + Admin.savetime.getSeconds(),
					autosave : true,
					onChange: function(element) {
						if(element.name == "height") {
							// Change Caption Y position
							var instance = $.fn.JSONeditor.getInstance(element);
							var height = parseInt(element.value);
							var cap = parseInt($(".caption input[name=y]").val());
							if(cap > height) {
								$(".caption input[name=y]").val("" + (height-20));
							}
						}

						Admin.onChange();
					},
					onSave : function(jsoneditor) {
						Admin.onSave(jsoneditor);
					},
					onSaveFinished : function() {
						Admin.onSaveFinished();
					},
					onReady : function(jsoneditor) {
						$("#center").html('<ul class="nav"></ul>').show();
						$("#editor-settings .rr_main > div").each(function (i, group) {
							$("#center .nav").append('<li><a href="#" id="t'+ group.id +'">'+ $("h2:first", group).text() + '</a></li>');
							$("#t"+group.id).click(function (e) {
								e.preventDefault();
								$("#editor-settings .rr_main > div, #editor-settings .rr_main > button").hide();
								var next = $("#"+ this.id.substring(1)).show().next();
								if(next.is('button')) next.show();
								//$("#center .nav li").removeClass('current');
								$(this).parent().addClass('current').siblings().removeClass('current');
							});
						})
						$("#center .nav li:first a").click();
					}
				});
				break;
			case "#editor-pangrams":
				$(id).JSONeditor({
					template : tplPangrams,
					source : '../resources/preview/pangrams.json?' + Admin.savetime.getHours() + Admin.savetime.getMinutes() + Admin.savetime.getSeconds(),
					autosave : true,
					onChange: function(element) {
						Admin.onChange(element);
					},
					onSave : function(jsoneditor) {
						Admin.onSave(jsoneditor);
					},
					onSaveFinished : function() {
						Admin.onSaveFinished();
					},
					onReady : function(jsoneditor) {
					}
				});
				break;
			case "#statistics":
				$(id).load('statistics.php');
				break;
			default:
				$(id).load(id.substr(1)+'.html');
		}

		
	});

	$("#top li a").click(function (e) {
		var id = this.href.substr(this.href.lastIndexOf('#'));

		/*
		$(this).parent().addClass('current').siblings().removeClass('current');
		$(id).show().siblings().empty();
		$("#center").hide().empty(); */

		switch(id) {
			case "#publish":
				$(id).load('publish.php', function() {
					//$(this).fadeIn("slow").fadeOut("slow");
					$("#top .message").text('Settings published.');
				});
				break;
			case "#preview-wrapper":
				$(id).show();
				$.fn.typeshow.resetAll();
				$("#typeshow").typeshow({
					'folder' : '..',
					'indexfile' : 'admin/preview.php',
					'settingsFile' : 'resources/preview/setup.json?' + Admin.savetime.getHours() + Admin.savetime.getMinutes() + Admin.savetime.getSeconds(),
					'usePangrams' : true,
					onReady : function(instance) {
						$('#preview').css('width', parseInt($(instance).css('width'))+100 + "px");
					}
				});
				break;
		}
		
	});

	$("#btn-close-preview").click(function () {
		$("#preview-wrapper").hide();
	});
	$("#preview-wrapper, #publish, #precompile").hide();

	$("#left .nav a:first").click();
});

function updateFontList(show) {
	show = show || 0;
	$("#center").html('<ul class="nav folder fonts"><li><button id="btn-add-font">New Font</button></li></ul>').show();
	$("#editor-fonts .rr_main .font").each(function (i, font) {
		i == show ? $(this).show() : $(this).hide();
		$("#center .nav").append('<li class="'+ (i == show ? 'current' : '') + '"><a href="#'+ font.id +'">'+ $("input:eq(0)", font).val() + '</a></li>');
	})
	$("#center ul.nav li a").click(function (e) {
		e.preventDefault();
		var id = this.href.substr(this.href.lastIndexOf('#'));
		$(id).show().siblings().hide();
		$(this).parent().addClass('current').siblings().removeClass('current');
	});

	$("#center #btn-add-font").click(function (e) {
		$("#editor-fonts .btn-font-add").click();
	});
}

function updateThemeList(show) {
	show = show || 0;
	$("#center").html('<ul class="nav folder themes"><li><button id="btn-add-theme">New Theme</button></li></ul>').show();
	$("#editor-themes .rr_main .theme").each(function (i, theme) {
		i == show ? $(this).show() : $(this).hide();
		$("#center .nav").append('<li class="'+ (i == show ? 'current' : '') + '"><a href="#'+theme.id +'">'+ $("input:eq(0)", theme).val() + '</a></li>');
	})
	$("#center ul.nav li a").click(function (e) {
		e.preventDefault();
		var id = this.href.substr(this.href.lastIndexOf('#'));
		$(id).show().siblings().hide();
		$(this).parent().addClass('current').siblings().removeClass('current');
	});
	$("#center #btn-add-theme").click(function (e) {
		$("#editor-themes .btn-theme-add").click();
	});

}

var Admin = {
	savetime : new Date(),
	onChange : function(element) {
		$("#top .message").html("Settings changed... you need to save!");
	},
	onSave : function(jsoneditor) {
		$("#top .message").html("Saving...").addClass('loading');
	},
	onSaveFinished : function() {
		this.savetime = new Date();
		$("#top .message").html("Settings saved at "+ this.savetime.getHours() + ":"+ (this.savetime.getMinutes() < 10 ? '0' : '') + this.savetime.getMinutes()).removeClass('loading');
		$("#precompile").load('precompile.php', function(data) {
			$("#precompile").html(data);
		});
	},
	urlParams : {},
	getUrlParams : function () {
		var e,
		d = function (s) {
			return decodeURIComponent(s.replace(/\+/g, " "));
		},
		q = window.location.search.substring(1),
		r = /([^&=]+)=?([^&]*)/g;

		while (e = r.exec(q))
			urlParams[d(e[1])] = d(e[2]);
	}
}