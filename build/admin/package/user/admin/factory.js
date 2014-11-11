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
		 * Returns path related to user
		 *
		 * @param string key name
		 * @return string absolute path
		 */
		this.path = function(key) {
			return this.Controller().path('user/' + key);
		};
		
		/**
		 * Gets a list from the server
		 *
		 * @param object the query
		 * @param function callback
		 * @return string|this
		 */
		this.getList = function(query, callback) {
			query = query || {};
			
			var url = this.Controller().getServerUrl() + '/user';
			
			//if there is something in the query
			if(JSON.stringify(query) !== '{}') {
				url += '?' + $.hashToQuery(query);
			}
			
			if(!callback) {
				return url;
			}
			
			$.getJSON(url, callback);
			
			return this;
		};
		
		/**
		 * Gets a detail row from the server
		 *
		 * @param string the id
		 * @param function callback
		 * @return this|string
		 */
		this.getDetail = function(id, callback) {
			var url = this.Controller().getServerUrl() + '/user/'+id;
			
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
			if(!data.user_name || !data.user_name.length) {
				errors.push({ name: 'user_name', message: 'Name is required!' });
			} 
			
			if(!data.user_email || !data.user_email.length) {
				errors.push({ name: 'user_email', message: 'Email is required!' });
			} else if(data.user_email && !(new RegExp(
				'^(([^<>()[\\]\\.,,:\\s@\\"]+(\\.[^<>()[\\]\\.,,:\\s@\\"]+)*)|(\\' + 
				'".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' + 
				'\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$', 'ig'))
				.test(data.user_email)) {
				errors.push({ name: 'user_email', message: 'Email is not a valid email' });
			} 
			
			
			return errors;
		};
		
		/**
		 * Sends a create command to the server
		 *
		 * @param object
		 * @return {fojo}
		 */
		this.create = function(data, callback) {
			var url = this.Controller().getServerUrl() + '/user/create';
			
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
		
		/**
		 * Sends an update command to the server
		 *
		 * @param string id
		 * @param object
		 * @param function callback
		 * @return {fojo}
		 */
		this.update = function(id, data, callback) {
			var url = this.Controller().getServerUrl() + '/user/update/' + id;
			
			//use fojo to send to db
			return $.fojo()
				.setUrl(url)
				.setData(data)
				.setMethod('put')
				
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
		
		/**
		 * Sends a remove command to the server
		 *
		 * @param string id
		 * @param function callback
		 * @return this
		 */
		this.remove = function(id, callback) {
			var url = this.Controller().getServerUrl() + '/user/remove/' + id;
			
			$.ajax({
				url 	: url,
				type 	: 'DELETE',
				// disable cache
				cache 		: false,
				// do not set content type
				contentType : false,
				// do not proccess data
				processData : false,
				// on error
				error: function(xhr, status, message) {
					callback(error, null);
				},
				// on success
				success : function(response) {
					response = JSON.parse(response);
					callback(null, response);
				}.bind(this) 
			});
			
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});