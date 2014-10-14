define(function() {
	return jQuery.eve.action.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
        this._callback = null;
	
        this._template = controller().path('block/template') + '/field/tag.html';
    
		/* Private Properties
		-------------------------------*/    
		var _loaded = false;

		/* Public Methods
		-------------------------------*/
		this.loadAssets = function(callback) {
			//make sure callback is a function
			callback = callback || $.noop;
			
			//if loaded
			if(_loaded) {
				//do nothing
				callback();
				return this;
			}
			
			//load autocomplete
			require([controller().path('block/action') + '/field/autocomplete.js'], function(action) {
				//load autocomplete assets
				action().loadAssets(function() {
					//add the style to header
					//<link rel="stylesheet" type="text/css" href="/styles/tag.css" />
					$('<link rel="stylesheet" type="text/css" />')
						.attr('href', controller().path('block/asset') + '/styles/tag.css')
						.appendTo('head');
					
					//add script to header
					//<script type="text/javascript" src="/scripts/tag.js">script>
					$('<script type="text/javascript"></script>')
						.attr('src', controller().path('block/asset') + '/scripts/tag.js')
						.appendTo('head');
					
					_loaded = true;
					
					callback();
				});
			});
			
			return this;
		};
	
        this.response = function(callback) {
			//the callback will be called in output
			this._callback = callback;
			
			controller().sync()
				.scope(this)
				.then(this.loadAssets)
				.then(this._output)
				.then(this._listen);
			
			return this;
		};
		
		this.setData = function(name, value, options, attributes) {
			this._data.name 		= name;
			this._data.value 		= value;
			this._data.attributes 	= attributes || '';
			this._data.options		= options || {};
			
			return this;
		};
		
		this.setInnerTemplate = function(template) {
			//make template an empty function
			//if not already defined
			template = template || $.noop;
			
			//call the template (Handlebars)
			//make sure attributes is a string otherwise
			this._data.innerTemplate = template() || '';
			
			return this;
		};
	
		/* Protected Methods
		-------------------------------*/
		this._output = function(next) {
			//store form templates path to array
			var templates = ['text!' + this._template];
			
			//add the ace admin class
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'eve-field-tag');
			
			//require form templates
			//assign it to main form
			require(templates, function(template) {
				//render
				this._callback(Handlebars.compile(template)(this._data));
				
				next();
			}.bind(this));
		};
		
		this._listen = function(next) {
			var options = this._data.options;
			
			//find all the widgets
			var tag = $('input.eve-field-tag')
				//remove the ones already set
				.not('.eve-field-loaded')
				//mark this as set
				.addClass('eve-field-loaded');
			
			//invoke the widget
			tag.tagsManager({prefilled: tag.val().split(','), replace: true, tagClass: 'btn'});
			
			//focus on click
			tag.parent().click(function() {
				tag.focus();
			});
			
			//change width on type
			var resize = function(e) {
				//8 - backspace
				//13 - enter
				var ruler = $('<span>')
					.html( $(this).val() )
					.appendTo('body');
				
				$(this).width( ruler.width() + 14 );
				
				if(JSON.stringify(options) != '{}') {
					var hint = $(this).siblings('input.tt-hint');
					
					if(hint.val().length) {
						ruler.html(hint.val());
					}
					
					hint.width( ruler.width() + 14 );
					$(this).width( ruler.width() + 14 );
					
					hint.css('top', $(this).position().top + 'px')
						.css('left', $(this).position().left + 'px')
				}
				
				ruler.remove();
			};
			
			tag
				.keydown(resize)
				.keyup(resize)
				.blur(resize)
				.focus(resize);
			
			if(JSON.stringify(options) != '{}') {
				tag.typeahead(options)
					.on('typeahead:selected', 
					function (e, d) {
						tag.tagsManager("pushTag", d.value);
					})
					.siblings('input.tt-hint')
					.css('top', tag.position().top + 'px')
					.css('left', tag.position().left + 'px')
			}
			
			next();
		};
		
		this._addAttribute = function(attributes, key, value, verbose) {
			//we are attempting to inject a new class name
			if(attributes.indexOf(key + '=') == -1) {
				//freely prepend to attributes
				return attributes + ' ' + key + '="' + value + '"';
			}
			
			//the key already exists
			
			//is it a class ?
			if(key == 'class') {
				//the class name exists
				//so try to prepend in the class instead
				return attributes
					.replace('class="', 'class="'+value+' ')
					.replace("class='", "class='"+value+" ");
			}
			
			if(!verbose) {
				return attributes;
			}
			
			var match = (new RegExp(key + '="([^"]*)"', 'ig')).exec(attributes);
			
			//try to replace the attribute
			return attributes.replace(match[0], key + '="'+value+'"');
		};
	
		/* Private Methods
		-------------------------------*/
	});
});