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
			
			//add the style to header
			//<link rel="stylesheet" type="text/css" href="/styles/mask.css" />
			$('<link rel="stylesheet" type="text/css" />')
				.attr('href', controller().path('block/asset') + '/styles/mask.css')
				.appendTo('head');
			
			//add script to header
			//<script type="text/javascript" src="/scripts/mask.js">script>
			$('<script type="text/javascript"></script>')
				.attr('src', controller().path('block/asset') + '/scripts/mask.js')
				.appendTo('head');
			
			_loaded = true;
			
			callback();
			
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
		
		this.setData = function(name, pattern, value, attributes) {
			this._data.name 		= name;
			this._data.pattern		= pattern;
			this._data.value 		= value;
			this._data.attributes 	= attributes || '';
			
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
			//add the ace admin class
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'eve-field-mask');
			
			//load up the action
			require([controller().path('block/action') + '/field/text.js'], function(action) {
				//load the action
				action()
				//set the data needed
				.setData(
					this._data.name, 
					this._data.value, 
					this._data.attributes)
				//pass the attributes along
				.setInnerTemplate(function() {
					return this._data.attributes;
				}.bind(this))
				//render the text field
				.response(function(html) {
					//call the callback set in render
					this._callback(html);
					
					//continue with sequence
					next();
				}.bind(this));
			}.bind(this));
		};
	
		this._listen = function(next) {
			//find all the widgets
			$('input.eve-field-mask')
				//remove the ones already set
				.not('.eve-field-loaded')
				//mark this as set
				.addClass('eve-field-loaded')
				//invoke the widget
				.inputmask({ mask: this._data.pattern });
				
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