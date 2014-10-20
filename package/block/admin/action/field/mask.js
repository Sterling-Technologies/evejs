define(function() {
	return jQuery.eve.base.extend(function() {
		/* Require
		-------------------------------*/
		var $ = jQuery;
		
		/* Constants
		-------------------------------*/
		/* Public.Properties
		-------------------------------*/
		/* Protected Properties
		-------------------------------*/
        this._data = {};
    
		/* Private Properties
		-------------------------------*/    
		var _loaded = false;

		/* Public Methods
		-------------------------------*/
		this.loadAssets = function() {
			//if loaded
			if(_loaded) {
				//do nothing
				return this;
			}
			
			//add the style to header
			//<link rel="stylesheet" type="text/css" href="/styles/mask.css" />
			$('<link rel="stylesheet" type="text/css" />')
				.attr('href', this.Controller().path('block/asset') + '/styles/mask.css')
				.appendTo('head');
			
			//add script to header
			//<script type="text/javascript" src="/scripts/mask.js">script>
			$('<script type="text/javascript"></script>')
				.attr('src', this.Controller().path('block/asset') + '/scripts/mask.js')
				.appendTo('head');
			
			_loaded = true;
			
			return this;
		};
	
        /**
		 * Determines the response
		 * 
		 * @param object request object
		 * @return this
		 */
		this.response = function(request) {
			//load assets
			this.loadAssets();
			
			//add the ace admin class
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'eve-field-mask');
			
			//freeze the data for async call
			this.___freeze();
			
			//load up the action
			require([this.Controller().path('block/action') + '/field/text.js'], function(action) {
				var id = request.id, innerTemplate = this._data.innerTemplate;
				
				this.Controller().on('block-response', function mask(e, request, response) {
					if(request.action === 'field/mask' && request.id === id) {
						//now listen
						this._listen();
						
						//unfreeze data
						this.___unfreeze();	
						
						this.Controller().off('block-response', mask);
					}				
				}.bind(this));
				
				//load the action
				action()
				//set the data needed
				.setData(
					this._data.name, 
					this._data.value, 
					this._data.attributes)
				//pass the attributes along
				.setInnerTemplate(function() {
					return innerTemplate;
				})
				//render the text field
				.response(request);
				
			}.bind(this));
			
			return this;
		};
		
		/**
		 * Sets data depending on arguments from block
		 *
		 * @param mixed[,mixed..]
		 * @return this
		 */
		this.setData = function(name, pattern, value, attributes) {
			this._data.name 		= name;
			this._data.pattern		= pattern;
			this._data.value 		= value;
			this._data.attributes 	= attributes || '';
			
			return this;
		};
		
		/**
		 * Sets inner template if applicable
		 *
		 * @param string
		 * @return this
		 */
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
		this._listen = function() {
			//find all the widgets
			$('input.eve-field-mask')
				//remove the ones already set
				.not('.eve-field-loaded')
				//mark this as set
				.addClass('eve-field-loaded')
				//invoke the widget
				.inputmask({ mask: this._data.pattern });
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