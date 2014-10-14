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
    
		/* Public Methods
		-------------------------------*/
        this.response = function(callback) {
			//the callback will be called in output
			this._callback = callback;
			
			controller().sync()
				.scope(this)
				.then(this._output)
				.then(this._listen);
			
			return this;
		};
		
		this.setData = function(name, value, min, max, step, attributes) {
			this._data.name 		= name;
			this._data.value 		= value;
			this._data.attributes 	= attributes || '';
			this._data.min			= min || '0';
			this._data.max			= max || '0';
			this._data.step			= step || '0';
			
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
			//add required to attributes
			this._data.attributes = this._addAttribute(this._data.attributes, 'min', this._data.min, true);
			this._data.attributes = this._addAttribute(this._data.attributes, 'max', this._data.max, true);
			this._data.attributes = this._addAttribute(this._data.attributes, 'step', this._data.step, true);
			
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'eve-field-slider');
			
			//load up the action
			require([controller().path('block/action') + '/field/text.js'], function(action) {
				//load the action
				action()
				//set the input type
				.setType('range')
				//set the data needed
				.setData(
					this._data.name, 
					this._data.value, 
					this._data.attributes)
				//pass the attributes along
				.setInnerTemplate(function() {
					return this._data.innerTemplate;
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
			var counter = $('<div>')
				.css('margin-bottom', '-12px')
				.css('font-size', '11px')
				.html(this._data.value || this._data.min);
				
			//find all the widgets
			$('input.eve-field-slider')
				//remove the ones already set
				.not('.eve-field-loaded')
				//mark this as set
				.addClass('eve-field-loaded')
				//invoke the widget
				.before(counter)
				.change(function() {
					counter.html($(this).val());
				});
				
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