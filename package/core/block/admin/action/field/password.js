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
    
		/* Public Methods
		-------------------------------*/
        /**
		 * Determines the response
		 * 
		 * @param object request object
		 * @return this
		 */
		this.response = function(request) {
			//freeze the data for async call
			this.___freeze();
			
			//load up the action
			require([this.Controller().path('block/action') + '/field/text.js'], function(action) {
				var innerTemplate = this._data.innerTemplate;
				
				//load the action
				action()
				//set the input type
				.setType('password')
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
		/* Private Methods
		-------------------------------*/
	});
});