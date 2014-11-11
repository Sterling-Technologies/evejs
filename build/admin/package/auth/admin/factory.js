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
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/**
		 * Returns path related to post
		 *
		 * @param string key name
		 * @return string absolute path
		 */
		this.path = function(key) {
			return this.Controller().path('auth/' + key);
		};
		
		/**
		 * Gets a detail row from the server
		 *
		 * @param string the id
		 * @param function callback
		 * @return this|string
		 */
		this.getDetail = function(id, callback) {
			var url = this.Controller().getServerUrl() + '/auth/detail/'+id;
			
			if(!callback) {
				return url;
			}
			
			$.getJSON(url, callback);
			
			return this;
		};
		
		/**
		 * Validates fields to be sent to the server
		 * and returns errors
		 *
		 * @param object
		 * @return object hash of errors
		 */
		this.getErrors = function(data) {
			var errors = [];
			
			//VALIDATION
			//NOTE: BULK GENERATE
			if(!data.auth_user) {
				errors.push({ name: 'auth_user', message: 'Email/Name is required!' });
			} 
			
			if(!data.auth_password) {
				errors.push({ name: 'auth_password', message: 'Password is required!' });
			}
			
			return errors;
		};
		
		/**
		 * Sends a login command to the server
		 *
		 * @param object
		 * @return {fojo}
		 */
		this.login = function(data, callback) {
			var url = this.Controller().getServerUrl() + '/auth/login';
			
			//use fojo to send to db
			return $.fojo()
				.setUrl(url)
				.setData(data)
				.setMethod('post')
				
				.once('abort', function(e) {
					callback(e, null);
				})
				
				.once('error', function(e) {
					callback(e, null);
				})
				
				.once('response', function(e, response) {
					response = JSON.parse(response);
					callback(null, response);	
				});
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});