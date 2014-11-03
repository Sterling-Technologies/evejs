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
		 * Returns path related to file
		 *
		 * @param string key name
		 * @return string absolute path
		 */
		this.path = function(key) {
			return this.Controller().path('file/' + key);
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
			
			var url = this.Controller().getServerUrl() + '/file';
			
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
			var url = this.Controller().getServerUrl() + '/file/'+id;
			
			if(!callback) {
				return url;
			}
			
			$.getJSON(url, callback);
			
			return this;
		};
		
		/**
		 * Sends a create command to the server
		 *
		 * @param object
		 * @return {fojo}
		 */
		this.create = function(data, callback) {
			var url = this.Controller().getServerUrl() + '/file/create';
			
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
		 * Sends a remove command to the server
		 *
		 * @param string id
		 * @param function callback
		 * @return this
		 */
		this.remove = function(id, callback) {
			var url = this.Controller().getServerUrl() + '/file/remove/' + id;
			
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