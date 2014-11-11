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
			
			//add script to header
			//<script type="text/javascript" src="/scripts/autocomplete.js">script>
			$('<script type="text/javascript"></script>')
				.attr('src', this.Controller().path('block/asset') + '/scripts/number.js')
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
			
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'eve-field-number');
			
			//freeze the data for async call
			this.___freeze();
			
			//load up the action
			require([this.Controller().path('block/action') + '/field/text.js'], function(action) {
				var id = request.id, innerTemplate = this._data.innerTemplate;
				
				this.Controller().on('block-response', function number(e, request, response) {
					if(request.action === 'field/number' && request.id === id) {
						//now listen
						this._listen();
						
						//unfreeze data
						this.___unfreeze();	
						
						this.Controller().off('block-response', number);
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
		this.setData = function(name, value, min, max, step, attributes) {
			this._data.name 		= name;
			this._data.value 		= value;
			this._data.attributes 	= attributes || '';
			this._data.min			= min || '0';
			this._data.max			= max || '0';
			this._data.step			= step || '0';
			
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
			var step = this._data.step;
			//find all the widgets
			$('input.eve-field-number')
				//remove the ones already set
				.not('.eve-field-loaded')
				//mark this as set
				.addClass('eve-field-loaded')
				//invoke the widget
				.ace_spinner({
					//FUEL_UX SPINNER options
					value			: parseInt(this._data.value),
					min				: parseInt(this._data.min),
					max				: parseInt(this._data.max),
					step			: parseInt(this._data.step),
					
					// + custom ones
					icon_up			: 'icon-plus',//default : 'icon-chevron-up'
					icon_down		: 'icon-minus',// default : 'icon-chevron-down'
					btn_up_class	: 'btn-success',//default : ''
					btn_down_class	: 'btn-danger',//default : ''
					
					on_sides: false,//will show decrement button on left and the other one on right
					touch_spinner: false// will use larger buttons by default
				}).keydown(function(e) {
					//go up
					if(e.keyCode == 38) {
						e.preventDefault();
						$(this).val(parseInt($(this).val()) + parseInt(step));
						//go down
					
					} else if(e.keyCode == 40) {
						$(this).val(parseInt($(this).val()) - parseInt(step));
					}
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