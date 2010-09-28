(function($) {
	// JSONeditor plugin for JQuery
	$.fn.JSONeditor = function(options) {
		var my = $.fn.JSONeditor;

		options = options ? options : {};
		// Synthesize tsOptions from defaults and config object
		var opts = $.extend({}, my.defaults, options);

		// Iterate over each DIV element and initialize JSON Editor
		this.each(function() {
			var $this = this;
			if(this.tagName == 'DIV' ) {

				// Is the Metadata Plugin installed and additional config data available?
				var o = $.metadata ? $.extend({}, opts, $this.metadata()) : opts;
				if(o.template && o.source) {

					$.get('php/load.php?source='+o.source, function(data) {
						//log(data);


						my.nodeCount++;
						$($this).html('<div id="rrN' + my.nodeCount + '"></div>');
						var instance = document.getElementById('rrN' + my.nodeCount);

						// Save pointer for handling
						$(instance).append(my.html);

						// Save the Options for this instance
						instance.rrOptions = o;
						instance.rrJson = data || {};
						instance.rrTemplate = o.template;
						instance.onSaveFinished = o.onSaveFinished;

						if(!$(instance).hasClass(o.className)) {
							$(instance).addClass(o.className);
							my.instances.push(instance);
						}

						my.runOn(instance);
					}, 'json');

				}
			}
		});

		return this;
	}

	//
	$.fn.JSONeditor.defaults = {
		className : "rr_editor",
		autosave : false,
		onAdd : function (e) {},
		onChange : function(e) {},
		onDelete : function (el, context) {},
		onSave : function (jsoneditor) {},
		onSaveFinished : function() {},
		onReady : function(jsoneditor) {},
		onMove : function(from, to, fromEl, toEl) {}
	}

	$.fn.JSONeditor.instances = [];

	$.fn.JSONeditor.html = '<button class="rr_save">Save</button><div class="rr_main"></div>';

	$.fn.JSONeditor.runOn = function(instance) {
		if(instance.rrTemplate.items) {
			$.fn.JSONeditor.eachItem(instance.rrTemplate.items, instance.rrJson, $.fn.JSONeditor.processItem, $(".rr_main", instance).get(0));
			//$(".rr_main > .group", instance).hide().first().show();
			if(instance.rrOptions.autosave) {
				$('.rr_save', instance).hide();
			} else {
				$('.rr_save', instance).click(function(e) {
					var instance = $.fn.JSONeditor.getInstance(e.target);
					$.fn.JSONeditor.saveHandler(instance);
				});
			}
			$('input, textarea, select', instance).change(function () {
				$.fn.JSONeditor.updateJSON(this);
			});

			if(instance.rrOptions.autosave) {
				$('input, textarea', instance).keyup(function () {
					if(instance.timer) window.clearTimeout(instance.timer);
					instance.timer = window.setTimeout("$.fn.JSONeditor.autosave()", 2000);
				});
			}
			instance.rrOptions.onReady(instance);
		}
	}

	$.fn.JSONeditor.eachItem = function(array, obj, fn, context) {
		$.each(array, function(i, item) {
			fn(i, item, obj, context);
		});
	}

	$.fn.JSONeditor.saveHandler = function(instance) {
		$.post('php/save.php', {
			"json" : JSON.stringify(instance.rrJson),
			"source" : instance.rrOptions.source
		},function(data) {
			if(data != "ok") {
				alert(data);
			} else {
				instance.onSaveFinished();
			}
		});
		instance.rrOptions.onSave(instance);
	}

	$.fn.JSONeditor.deleteHandler = function(event) {
		if(confirm(event.target.title)) {
			var my = $.fn.JSONeditor;
			var instance = my.getInstance(event.target);
			var path = my.getXNames(event.target);
			var obj = instance.rrJson;
			while(path.length > 1) {
				obj = obj[path.shift()];
			}
			var number = Number(path[0]);
			obj.splice(number,1);
			var $item = $(event.target).parent().parent();
			$item.nextAll('div').each(function (i, item) {
				item.title = parseInt(item.title)-1;
			});
			var context = $item.parent();
			var removed = $item.detach();
			if(instance.rrOptions.autosave) {
				$.fn.JSONeditor.saveHandler(instance);
			}
			instance.rrOptions.onDelete(removed.get(0),context);
		}
	}

	$.fn.JSONeditor.addHandler = function(event) {
		//log(event);

		var my = $.fn.JSONeditor;
		var path = my.getXNames(event.target);
		var instance = my.getInstance(event.target);
		var obj = instance.rrJson;

		var template = $(event.target).data('template');

		//log(path);

		while(path.length > 0) {
			if(!obj[path[0]]) {
				obj[path[0]] = [];
			}
			obj = obj[path.shift()]
		}
		var newItem = {};
		$.each(template.items, function(i, item) {
			if(item.xtype == 'array') {
				newItem[item.name] = [];
			}
			else if(item.xtype == 'group') {
				newItem[item.name] = {};
			}
			else {
				newItem[item.name] = item.autofill || (i == 0 ? 'new' : '');
			}
		});
		//log(obj);
		//log(newItem);
		obj.push(newItem);
		var newPathId = ""+ (obj.length-1);
		var newItemContext = $(event.target).prev().get(0);

		my.processArrayItem(newPathId, template, newItem, newItemContext);

		$('input, textarea', newItemContext).change(function () {
			$.fn.JSONeditor.updateJSON(this);
		});
		if(instance.rrOptions.autosave) {
			$.fn.JSONeditor.saveHandler(instance);
		}
		instance.rrOptions.onAdd(newItemContext.lastChild);
	}

	$.fn.JSONeditor.fileHandler = function (event) {
		var instance = $.fn.JSONeditor.getInstance(event.target);
		var path = $.fn.JSONeditor.getXNames(event.target);
		var folder = $.fn.JSONeditor.getXFolder(event.target);
		var xpath = '';
		var accept = $(event.target).data('accept');
		accept = accept || "";
		var node = event.target.id;
		//log(node);
		for(var i in path) {
			if(i != 0) xpath += '_';
			//log(path[i]);
			xpath += path[i];
		}
		//log(xpath);
		$.fn.JSONeditor.nodeCount++;
		var image = null;
		var ext = event.target.value.substring(event.target.value.lastIndexOf('.')+1);
		if(ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "gif") {
			image = folder +'/'+ event.target.value;
		}
		$('.rr_filedialog', instance).remove();
		$('<div class="rr_filedialog"><button id="rrN' + ($.fn.JSONeditor.nodeCount) +'" class="btn btn-close">Close</button><button id="rrN'+ ($.fn.JSONeditor.nodeCount+1) +'" class="btn btn-clear-file">Delete File</button><p>'+ event.target.value +'</p><iframe id="rrN' + ($.fn.JSONeditor.nodeCount+2) +'" src="php/upload.php?item='+ xpath +'&node=' + node +'&source='+ instance.rrOptions.source +'&folder='+ folder +'&accept='+ accept +'"></iframe>'+ (image ? '<img src="'+ image +'" alt="Preview">' : '')+'</div>').insertAfter(event.target);
		$('#rrN'+ $.fn.JSONeditor.nodeCount).click(function (e) {
			$(this).parent().remove();
		});

		$.fn.JSONeditor.nodeCount++;
		$('#rrN'+ $.fn.JSONeditor.nodeCount).click($.fn.JSONeditor.fileClearHandler);

		$.fn.JSONeditor.nodeCount++;
		$('#rrN'+ $.fn.JSONeditor.nodeCount).data('xpath', xpath).data('node', node).data('source', instance.rrOptions.source).data('loadFired', false).bind('load', $.fn.JSONeditor.onUpload);
	}

	$.fn.JSONeditor.fileClearHandler = function (event) {
		var input = $(event.target).parent().prev('input.file');
		//log(input);
		if(confirm('Delete '+ input.val()+" ?")) {
			input.removeAttr('readonly').get(0).value = 'Select File';
			input.attr('readonly', 'readonly').change();
			$(event.target).parent().remove();
		}
	}


	$.fn.JSONeditor.onUpload = function(event) {
		var my = $.fn.JSONeditor;
		if($(event.target).data('loadFired')) {
			$.get('php/update.php', {
				'item' : $(event.target).data('xpath'),
				'node' : $(event.target).data('node'),
				'source' : $(event.target).data('source')
			}, function (data) {
				var el = document.getElementById(data.node);
				$(el).removeAttr('readonly').val(data.value).attr('readonly', 'readonly');
				$(".rr_filedialog",el.parentNode).remove();
				$(el).prev().get(0).title = data.value;
				var instance = my.getInstance(el);
				my.updateJSONValue(instance.rrJson, data.path, data.value);
				instance.rrOptions.onChange(el);
				instance.rrOptions.onSaveFinished();
			});
		} else {
			$(event.target).data('loadFired', true);
		}
	}

	$.fn.JSONeditor.moveUpHandler = function(event) {
		var item = $(event.target).parent().parent();
		var itemIndex = item.attr('title');
		var prev = item.prev('div');
		if(prev.length > 0) {
			var prevIndex = prev.attr('title');
			item.detach().insertBefore(prev);
			item.attr('title', prevIndex);
			prev.attr('title', itemIndex);

			var instance = $.fn.JSONeditor.getInstance(event.target);
			var path = $.fn.JSONeditor.getXNames(event.target);
			var obj = instance.rrJson;
			for(var i = 0; i < path.length - 1; i++) {
				obj = obj[path[i]];
			}
			var tmpObj = obj[itemIndex];
			obj[itemIndex] = obj[prevIndex];
			obj.splice(prevIndex, 1, tmpObj);

			instance.rrOptions.onMove(itemIndex, prevIndex, item, prev);
			if(instance.rrOptions.autosave) {
				$.fn.JSONeditor.saveHandler(instance);
			}
		}

	}

	$.fn.JSONeditor.moveDownHandler = function(event) {
		var item = $(event.target).parent().parent();
		var itemIndex = item.attr('title');
		var next = item.next('div');
		if(next.length > 0) {
			var nextIndex = next.attr('title');
			item.detach().insertAfter(next);
			item.attr('title', nextIndex);
			next.attr('title', itemIndex);

			var instance = $.fn.JSONeditor.getInstance(event.target);
			var path = $.fn.JSONeditor.getXNames(event.target);
			var obj = instance.rrJson;
			for(var i = 0; i < path.length - 1; i++) {
				obj = obj[path[i]];
			}
			var tmpObj = obj[nextIndex];
			obj[nextIndex] = obj[itemIndex];
			obj.splice(itemIndex, 1, tmpObj);

			instance.rrOptions.onMove(itemIndex, nextIndex, item, next);
			if(instance.rrOptions.autosave) {
				$.fn.JSONeditor.saveHandler(instance);
			}
		}
	}

	$.fn.JSONeditor.updateJSONValue = function(json, path, value) {
		var obj = json;
		for(var i = 0; i < path.length - 1; i++) {
			obj = obj[path[i]];
		}
		obj[path[path.length-1]] = value;
	}

	$.fn.JSONeditor.updateJSON = function(el) {
		var instance = $.fn.JSONeditor.getInstance(el);
		var path = $.fn.JSONeditor.getXNames(el);
		var obj = instance.rrJson;
		var key = $(el).parent().data('key');
		if(key) {
			if(path.length >= 2 && path[path.length-1] == key && path[path.length-2]) {
				var oldPath = path[path.length-2];
				var newPath = el.value;
				$(el).parent().data('xname', newPath).attr('title', newPath);
			}
		}

		for(var i = 0; i < path.length - 1; i++) {
			if(i == path.length-2 && oldPath && newPath) {
				obj[newPath] = obj[oldPath];
				delete obj[oldPath];
				path[path.length-2] = newPath;
			}
			obj = obj[path[i]];
		}
		var value = el.value;
		if(el.type == "checkbox") {
			if(el.checked) {
				value = 'Y';
			} else {
				value = 'N';
			}
		}
		obj[path[path.length-1]] = value;

		instance.rrOptions.onChange(el);
		if(instance.rrOptions.autosave) {
			$.fn.JSONeditor.saveHandler(instance);
		}
	}


	$.fn.JSONeditor.processItem = function(i, item, obj, context) {
		obj = obj || {};
		var my = $.fn.JSONeditor;
		my.nodeCount++;
		var element;
		if(item.xtype == "group") {
			$(context).append('<div id="rrN'+ my.nodeCount +'" class="'+ item.xtype +' '+ item.name +' clearfix"><h2 class="rr_caption">'+ item.desc +'</h2>' + (item.hint ? '<p>'+ item.hint +'</p>' : '' ) + '</div>');
			obj = obj[item.name] ? obj[item.name] : obj[item.name] = {};

			// Process children
			context = document.getElementById('rrN'+my.nodeCount);
			$(context).data("xname", item.name);
			if(item.folder) $(context).data("xfolder", item.folder);
			if(item.items) {
				$.fn.JSONeditor.eachItem(item.items, obj, $.fn.JSONeditor.processItem, context);
			}
		}
		if(item.xtype == "array") {
			// Array DIV
			$(context).append('<div id="'+'rrN'+ my.nodeCount +'" class="'+ item.xtype +' '+ item.name +'"><h2 class="rr_caption">'+ item.desc +'</h2>' + (item.hint ? '<p>'+ item.hint +'</p>' : '' ) + '</div>');
			var arrContext = document.getElementById('rrN'+my.nodeCount);
			if(item.name) {
				obj = obj[item.name] || {};
				$(arrContext).data('xname',item.name);
			}
			if(item.folder) $(arrContext).data("xfolder", item.folder);
			$(arrContext).append()
			$.each(obj, function(key, objitem) {
				my.processArrayItem(key, item.template, objitem, arrContext);
			});
			my.nodeCount++;
			$(context).append('<button id="rrN'+ my.nodeCount +'" class="btn btn-'+ item.template.xtype +'-add" title="Add '+ item.template.xtype +'">+</button>');
			var button = document.getElementById('rrN'+ my.nodeCount);
			$(button).data('template', item.template).data('xname', item.name).click($.fn.JSONeditor.addHandler);


		}
		if(item.xtype == "number" || item.xtype == "text" || item.xtype == "password") {
			// Standard Input Element
			$(context).append('<label for="rrN'+ my.nodeCount +'">'+ item.desc + '</label><input id="rrN'+ my.nodeCount +'" type="'+ item.xtype + '" name="' + item.name + '" value="' + (obj[item.name] ? obj[item.name] : '') + '">');
			if(item.hint) $(context).append('<p class="rr_hint">'+item.hint+'</p>');
		}
		if(item.xtype == "textarea") {
			// Standard Input Element
			$(context).append('<label for="rrN'+ my.nodeCount +'">'+ item.desc + '</label><textarea id="rrN'+ my.nodeCount +'" name="' + item.name + '">' + (obj[item.name] ? obj[item.name] : '') + '</textarea>');
			if(item.hint) $(context).append('<p class="rr_hint">'+item.hint+'</p>');
		}
		if(item.xtype == "select") {
			// Standard Input Element
			$(context).append('<label for="rrN'+ my.nodeCount +'">'+ item.desc + '</label><select size="1" id="rrN'+ my.nodeCount +'" name="' + item.name + '"></select>');
			for(var v in item.values) {
				$("#rrN"+my.nodeCount).append('<option value="'+ item.values[v] +'" '+ (obj[item.name] == item.values[v] ? 'selected="selected"': '') +'>'+ item.values[v] +'</option>');
			}
			if(item.hint) $(context).append('<p class="rr_hint">'+item.hint+'</p>');
		}
		if(item.xtype == "checkbox") {
			// Standard Input Element
			$(context).append('<label for="rrN'+ my.nodeCount +'">'+ item.desc + '</label><input id="rrN'+ my.nodeCount +'" type="'+ item.xtype + '" name="' + item.name + '" value="'+(obj[item.name] == item.autofill ? 'Y' : 'N')+'" '+ (obj[item.name] == item.autofill ? 'checked="checked"' : '') +'>');
			//log(obj[item.name]);
			if(item.hint) $(context).append('<p class="rr_hint">'+item.hint+'</p>');
		}
		if(item.xtype == "color") {
			// Standard Input Element
			$(context).append('<input id="rrN'+ my.nodeCount +'" type="text" class="'+ item.xtype +'" name="' + item.name + '" value="' + (obj[item.name] ? obj[item.name] : '') + '"><label for="rrN'+ my.nodeCount +'">'+ item.desc + "</label>");
			$('#rrN'+ my.nodeCount).css('backgroundColor', obj[item.name] || 'white');
			if(item.hint) $(context).append('<p class="rr_hint">'+item.hint+'</p>');
		}
		if(item.xtype == "file") {
			// Standard Input Element
			$(context).append('<label id="rrN'+ (my.nodeCount+1) +'" for="rrN'+ my.nodeCount +'" class="filename" title="'+ (obj[item.name] ? obj[item.name] : 'Select File') +'">' + item.desc + '</label><input id="rrN'+ my.nodeCount +'" type="text" name="' + item.name + '" value="' + (obj[item.name] ? obj[item.name] : 'Select File') + '" readonly="readonly" class="file">');
			$("#rrN"+ my.nodeCount).click($.fn.JSONeditor.fileHandler);
			if(item.folder) $("#rrN"+ my.nodeCount).data("xfolder", item.folder);
			if(item.accept) $("#rrN"+ my.nodeCount).data('accept', item.accept);
			my.nodeCount++;
			$("#rrN"+my.nodeCount).click(function (e) {
				$($(e.target).attr('for')).click();
			});
			if(item.hint) $(context).append('<p class="rr_hint">'+item.hint+'</p>');
		}
		if(item.xtype == "hash") {
			var hash = (obj[item.name] ? obj[item.name] : obj[item.name] = my.uniqId());
			$(context).append('<input type="hidden" id="rrN'+ my.nodeCount +'" class="hash" name="'+ item.name +'" value="'+ hash +'">');
			if(item.name == "folder") {
				$(context).data("xfolder", hash);
			}
		}
		if(item.xtype == "spacer") {
			$(context).append("<hr>");
		}
	}

	$.fn.JSONeditor.processArrayItem = function (key, template, data, context) {
		var my = $.fn.JSONeditor;
		if(!isNaN(key)) {
			key = ""+key;
		}
		// Array Children
		my.nodeCount++;
		$(context).append('<div id="rrN'+ my.nodeCount +'" class="'+ template.xtype +' clearfix" title="' + key +'"></div>');
		var arrContext = document.getElementById('rrN'+ my.nodeCount);
		if(template.folder) $(arrContext).data('xfolder', template.folder.replace(/%i/, key));


		my.nodeCount++;
		$(arrContext).append('<div class="rr_group_functions"><button id="rrN'+ my.nodeCount +'" class="btn btn-move-up" title="Move Up" tabindex="-1">Up</button><button id="rrN'+ (my.nodeCount+1) +'" class="btn btn-move-down" title="Move Down" tabindex="-1">Down</button><button id="rrN'+ (my.nodeCount+2) +'" class="btn btn-del"  title="Delete ' + template.xtype + '?" tabindex="-1">Delete ' + template.xtype + '</button></div>');
		$("#rrN"+ my.nodeCount).click($.fn.JSONeditor.moveUpHandler);
		my.nodeCount++;
		$("#rrN"+ my.nodeCount).click($.fn.JSONeditor.moveDownHandler);
		my.nodeCount++;
		$("#rrN"+ my.nodeCount).click($.fn.JSONeditor.deleteHandler);

		$(arrContext).data("xname", key);
		$.fn.JSONeditor.eachItem(template.items, data, $.fn.JSONeditor.processItem, arrContext);

	}

	$.fn.JSONeditor.getTopNode = function (element, className) {
		className = className || false;
		var tree = element;
		var re = element;
		while(tree.parentNode) {
			tree = tree.parentNode;
			if(tree.id && tree.id.indexOf('rrN') == 0) {
				re = tree;
				if(className && $(re).hasClass(className)) return re;
			}
		}
		return re;
	}

	$.fn.JSONeditor.getXNames = function(element) {
		var path = [];
		if(element.name && element.name.length > 0) path.push(element.name);
		if($(element).data('xname')) path.push($(element).data('xname'));
		var tree = element;
		while(tree.parentNode) {
			tree = tree.parentNode;
			if($(tree).data("xname")) {
				path.unshift($(tree).data('xname'));
			}
		}
		return path;
	}

	$.fn.JSONeditor.getXFolder = function(element) {
		var folder = '';
		if($(element).data('xfolder')) folder += $(element).data('xfolder');
		var tree = element;
		while(tree.parentNode) {
			tree = tree.parentNode;
			if($(tree).data("xfolder")) folder = ($(tree).data('xfolder')) + (folder.length > 0 ? '/' : '') + folder;
		}
		return folder;
	}

	$.fn.JSONeditor.getInstance = function(element) {
		var topnode = $.fn.JSONeditor.getTopNode(element);
		var editor = null;
		$.each($.fn.JSONeditor.instances, function(i, instance) {
			if(instance.id == topnode.id) {
				editor = instance;
			}
		});
		return editor;
	}

	$.fn.JSONeditor.autosave = function() {
		for(var i = 0; i < $.fn.JSONeditor.instances.length; i++) {
			var instance = $.fn.JSONeditor.instances[i];
			if(instance.timer) {
				$.fn.JSONeditor.saveHandler(instance);
				instance.timer = null;
			}
		}
	}

	$.fn.JSONeditor.uniqId = function() {
		var d = new Date;
		return "" + d.getTime();
	}

	$.fn.JSONeditor.nodeCount = 0;
	
})(jQuery);