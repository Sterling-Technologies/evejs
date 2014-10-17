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
        this._data 		= {};
        this._template 	= '/field/color.html';
    
		/* Private Properties
		-------------------------------*/    
		var _loaded = false;

		/* Public Methods
		-------------------------------*/
		this.loadAssets = function() {
			//if loaded
			if(_loaded) {
				//do nothing
				callback();
				return this;
			}
			
			//add the style to header
			//<link rel="stylesheet" type="text/css" href="/styles/color.css" />
			$('<link rel="stylesheet" type="text/css" />')
				.attr('href', this.Controller().path('block/asset') + '/styles/color.css')
				.appendTo('head');
			
			//add script to header
			//<script type="text/javascript" src="/scripts/color.js">script>
			$('<script type="text/javascript"></script>')
				.attr('src', this.Controller().path('block/asset') + '/scripts/color.js')
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
			
			this._data.source 	= this.Controller().path('block/asset') + '/images/color/blank.gif';
			this._data.value 	= this._data.value || '#FFFFFF';
			
			//add the ace admin class
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'form-control');
        	
			//store form templates path to array
			var template = this.Controller().path('block/template') + this._template;
			
			//freeze the data for async call
			this.___freeze();
			
			//require form templates
			//assign it to main form
			require(['text!' + template], function(template) {
				//trigger
				var response = Handlebars.compile(template)(this._data);
				this.Controller().trigger('block-response', request, response);
				
				//now listen
				this._listen();
				
				//unfreeze data
				this.___unfreeze();
			}.bind(this));
			
			return this;
		};
		
		/**
		 * Sets data depending on arguments from block
		 *
		 * @param mixed[,mixed..]
		 * @return this
		 */
		this.setData = function(name, value, attributes) {
			this._data.name 		= name;
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
			var color = this._data.value;
			
			//find all the widgets
			var color = $('img.eve-field-color')
				//remove the ones already set
				.not('.eve-field-loaded')
				//mark this as set
				.addClass('eve-field-loaded')
				//invoke the widget
				.ColorPicker({
					color: color,
					onShow: function(picker) {
						$(picker).fadeIn(500);
						return false;
					}, 
					
					onHide: function(picker) {
						$(picker).fadeOut(500);
						return false;
					},
					
					onChange: function (hsb, hex, rgb) {
						color.css('background-color', '#' + hex.toUpperCase())
							.parent()
							.prev()
							.val('#' + hex.toUpperCase());
					}
				});
				
			color.parent().prev().focus(function() {
				color.click();
			});
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