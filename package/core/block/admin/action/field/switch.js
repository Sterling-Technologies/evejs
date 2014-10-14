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
			
			controller().sync().scope(this).then(this._output);
			
			return this;
		};
		
		this.setData = function(name, value, selected, type, attributes) {
			this._data.name 		= name;
			this._data.value 		= value;
			this._data.attributes 	= attributes || '';
			this._data.selected		= selected;
			
			if(selected instanceof Array) {
				for(var i = 0; i < selected.length; i++) {
					if(value == selected[i]) {
						this._data.attributes = this._addAttribute(
						this._data.attributes, 'selected', 'selected');
						
						return this;
					}
				}
				
				return this;
			}
			
			type = type || 1;
			
			this._data.attributes = this._addAttribute(this._data.attributes, 
			'class', 'ace-switch ace-switch-' + type);
			
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
			//load up the action
			require([controller().path('block/action') + '/field/checkbox.js'], function(action) {
				//load the action
				action()
				//set the data needed
				.setData(
					this._data.name, 
					this._data.value, 
					this._data.selected,
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