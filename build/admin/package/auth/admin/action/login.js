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
		this._data	= {};
		this._title	= 'Login';
		
		this._template = '/login.html';
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		this.response = function(request) {
			//are they already validated ?
			if(this.Controller().cookie('auth')) {
				window.location = '/';
			}
			
			//variable list
			this._data.url 		= request.url;
			this._data.setting	= request.data;
			this._data.errors 	= {};
			
			//if there are field errors
			if(request.errors instanceof Array && request.errors.length) {	
				//parse out those errors for the template
				for(var i = 0; i < request.errors.length; i++) {
					this._data.errors[request.errors[i].name] = request.errors[i].message;
				}
				
				//no need for these anymore
				delete request.error;
				delete request.errors;
				
				//output the errors
				this._output(request);
				return this;
			}
			
			//if there is data from the request and there are no errors
			if(Object.keys(this._data.setting).length 
			&& request.method.toUpperCase() === 'POST'
			&& !request.error) {
				//start the create process
				this.Controller().trigger('auth-login', this._data.setting, request, this);
				return this;
			}
			
			//if it was an error
			delete request.error;
			
			//output the form
			this._output(request);
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		this._output = function(request) {
			var template = this.Controller().package('auth').path('template') + this._template;
			
			//freeze the data
			this.___freeze();
			
			//require form templates
			//assign it to main form
			require(['text!' + template], function(template) {
				//render the body
				var body = Handlebars.compile(template)(this._data);
				$('#navbar').remove();
				$(document.body).addClass('login-layout')
				$('#main-container').html(body);
				
				
				this.Controller()
					.setTitle(this._title)
					//.setBody(body)
					.trigger('auth-login-output', request, this);            
			
				//unfreeze data
				this.___unfreeze();
			}.bind(this));
		};
		
		/* Private Methods
		-------------------------------*/
	}).singleton();
});