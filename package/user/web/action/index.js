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
		this._title 	= 'Users';
		this._data 		= {};
		
		this._template 	= '/index.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		this.response = function(request) {
			//freeze data
			this.___freeze();
			
			//bulk load the templates
			require(['text!' + template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				
				this.Controller() 
					.setTitle(this._title)
					.setBody(body)
					.trigger('sink-response', request, this);
				
				//unfreeze data
				this.___unfreeze();
			}.bind(this));
			
			return this
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});