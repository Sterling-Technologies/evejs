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
        this._template 	= '/form/fieldset.html';
    
		/* Public Methods
		-------------------------------*/
        this.response = function(request) {
			//add the ace admin class
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'form-group clearfix');
			
			if(this._data.error) {
				this._data.attributes = this._addAttribute(
				this._data.attributes, 'class', 'has-error');
			}
			
			//store form templates path to array
			var template = this.Controller().path('block/template') + this._template;
			
			//freeze data for async call
			this.___freeze();
			
			//require form templates
			//assign it to main form
			require(['text!' + template], function(template) {
				//trigger
				var response = Handlebars.compile(template)(this._data);
				this.Controller().trigger('block-response', request, response);
				
				//we are done, unfreeze data
				this.___unfreeze();
			}.bind(this));
			
			return this;
		};
		
		this.setData = function(label, error, labelSize, fieldSize, attributes) {
			this._data.label 		= label;
			this._data.error		= error;
			this._data.labelSize 	= labelSize || '2';
			this._data.fieldSize 	= fieldSize || '10';
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