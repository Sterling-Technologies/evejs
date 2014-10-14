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
	
        this._template = controller().path('block/template') + '/form/fieldset.html';
    
		/* Public Methods
		-------------------------------*/
        this.response = function(callback) {
			//the callback will be called in output
			this._callback = callback;
			
			controller().sync().scope(this).then(this._output);
			
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
		this._output = function(next) {
			//store form templates path to array
			var templates = ['text!' + this._template];
			
			//add the ace admin class
			this._data.attributes = this._addAttribute(
			this._data.attributes, 'class', 'form-group clearfix');
			
			if(this._data.error) {
				this._data.attributes = this._addAttribute(
				this._data.attributes, 'class', 'has-error');
			}
			
			var callback = this._callback, data = this._data;
			
			//require form templates
			//assign it to main form
			require(templates, function(template) {
				//render
				callback(Handlebars.compile(template)(data));
					
				next();
			}.bind(this));
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