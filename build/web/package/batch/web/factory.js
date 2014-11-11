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
		this._batch = [];
		
		/* Private Properties
		-------------------------------*/
		/* Magic
		-------------------------------*/
		/* Public.Methods
		-------------------------------*/
		/**
		 * Adds a call to the batch
		 *
		 * @param string
		 * @param mixed
		 * @param string
		 * @return this
		 */
		this.add = function(url, data, method) {
			var call  = { url: url, method: method || 'GET' };
			
			call.method = call.method.toUpperCase();
			
			if(data) {
				call.data = data;
			}
			
			this._batch.push(call);
			return this;
		};
		
		/**
		 * Returns path related to user
		 *
		 * @param string key name
		 * @return string absolute path
		 */
		this.path = function(key) {
			return this.Controller().path('batch/' + key);
		};
		
		/**
		 * Sends the batch call
		 *
		 * @param callback
		 * @return this
		 */
		this.send = function(callback) {
			callback = callback || $.noop;
			
			//it no calls
			if(!this._batch.length) {
				//don't send it
				callback('No batch data to send.', null);
				return this;
			}
			
			//call it
			$.post(
				this.Controller().getServerUrl() + '/batch', 
				JSON.stringify(this._batch), function(response) { 
					response = JSON.parse(response);
					callback(null, response);
				});
			
			//reset batch
			this._batch = [];
				
			return this;
		};
		
		/* Protected Methods
		-------------------------------*/
		/* Private Methods
		-------------------------------*/
	}).singleton();
});