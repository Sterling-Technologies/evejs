module.exports = function($) {
	return this.define(function(public) {
		/* Public Properties
		-------------------------------*/
		public.ssl 		= false;
		public.body 	= null;
		public.headers 	= {};
		public.options 	= {};
		public.error	= $.noop;
		public.count	= 0;
		
		/* Private Properties
		-------------------------------*/
		/* Loader
		-------------------------------*/
		public.__load = function() {
			return new this();
		};
		
		/* Construct
		-------------------------------*/
		public.construct = function(host) {
			this.setHost(host);
		};
		
		/* Public Methods
		-------------------------------*/
		/**
		 * Sets authentication
		 *
		 * @param string
		 * @param string
		 * @return this
		 */
		public.setAuthentication = function(user, password) {
			this.options.auth = user+':'+password;
			return this;
		};
		
		/**
		 * Sets the request body
		 *
		 * @param string
		 * @return this
		 */
		public.setBody = function(body) {
			this.body = body;
			return this;
		};
		
		/**
		 * Sets the headers hash
		 *
		 * @param string|object
		 * @param mixed
		 * @return this
		 */
		public.setHeaders = function(key, value) {
			if($.hash.isHash(key)) {
				this.headers = key;
				return this;
			}
			
			if($.array.isArray(key)) {
				for(var newKey, i = 0; i < key.length; i++) {
					if(typeof key[i] == 'string') {
						newKey = {};
						newKey[key[i].split(':')[0].trim()] = key[i].split(':')[1].trim();
						key[i] = newKey;
					}
					
					if(!$.hash.isHash(key[i])) {
						continue;
					}
					
					for(newKey in key[i]) {
						this.headers[newKey] = key[i][newKey];
					}
				}
				
				this.headers = key;
				return this;
			}
			
			this.headers[key] = value;
			
			return this;
		};
		
		/**
		 * Sets the URL host
		 *
		 * @param string
		 * @return this
		 */
		public.setHost = function(host) {
			this.options.hostname = host;
			return this;
		};
		
		/**
		 * Sets the method IE GET, POST, PUT, DELETE
		 *
		 * @param string
		 * @return this
		 */
		public.setMethod = function(method) {
			this.options.method = method.toUpperCase();
			return this;
		};
		
		/**
		 * Sets the url path
		 *
		 * @param string
		 * @return this
		 */
		public.setPath = function(path) {
			this.options.path = path;
			return this;
		};
		
		/**
		 * Sets the port
		 *
		 * @param int
		 * @return this
		 */
		public.setPort = function(port) {
			this.options.port = port;
			return this;
		};
		
		/**
		 * Disects URL
		 *
		 * @param string
		 * @return this
		 */
		public.setUrl = function(url) {
			url += '';
			
			if(url.indexOf('https://') === 0) {
				this.useSSL();
			}
			
			url = url.replace('http://', '').replace('https://', '');
			
			if(url.split('/')[0].split(':')[0]) {
				this.setHost(url.split('/')[0].split(':')[0]);
			}
			
			if(url.split('/')[0].split(':')[1]) {
				this.setPort(url.split('/')[0].split(':')[1])
			}
			
			return this.setPath('/'+url.split('/').slice(1).join('/'));
		};
		
		/**
		 * Use HTTPS
		 *
		 * @return this
		 */
		public.useSSL = function() {
			this.ssl = true;
			return this;
		};
		
		/**
		 * Sets the error handler
		 *
		 * @param function
		 * @return this
		 */
		public.onError = function(callback) {
			this.error = callback;
			return this;
		};
		
		/**
		 * Sends off the request
		 *
		 * @param function
		 * @param string
		 * @return this
		 */
		public.send = function(callback, encoding) {
			var clone		= Object.create(this);
				resource 	= this.ssl 
							? require('https') 
							: require('http');
			
			callback = callback || $.noop;
			encoding = encoding || 'utf8';
			
			//add headers
			if($.hash.size(this.headers)) {
				this.options.headers = this.headers;
			}
			
			var request = resource.request(this.options, function(response) {
				// Detect a redirect
				if (response.statusCode > 300 
				&& response.statusCode < 400 
				&& response.headers.location
				&& clone.count < 5) {
					//recreate the call
					var rest 		= $.load('rest');
					rest.ssl 		= clone.ssl;
					rest.body 		= clone.body;
					rest.headers 	= clone.headers;
					rest.options 	= clone.options;
					rest.error		= clone.error;
					rest.count		= clone.count + 1;
					
					rest.setUrl(response.headers.location)
						.send(callback, encoding);
						
					return;
				}
				
				var data = '';
				
				response.setEncoding(encoding);
				
				response.on('data', function(chunk) {
					data += chunk;
				});
				
				response.on('end', function() {
					callback(data, 
						response.statusCode, 
						response.headers);
				});
			});
			
			request.on('error', this.error);
			
			if(this.body && this.body.length) {
				request.write(this.body);
			}
			
			request.end();
			
			return this;
		};
		
		/* Private Methods
		-------------------------------*/
	});
};