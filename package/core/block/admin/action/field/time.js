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
		
		this.setData = function(name, value, options, attributes) {
			this._data.name 		= name;
			this._data.value 		= value;
			this._data.options		= options || {};
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
			this._data.options.pickDate 	= false;
			this._data.options.format 	= 'HH:mm PP';
			
			//load up the action
			require([controller().path('block/action') + '/field/datetime.js'], function(action) {
				//load the action
				action()
				//set the data needed
				.setData(
					this._data.name, 
					this._data.value, 
					this._data.options, 
					this._data.attributes)
				.setType('time')
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
			
		/* Private Methods
		-------------------------------*/
	});
});